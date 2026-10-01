export const forestTracks = [
  { id: "canopy", name: "Under the Canopy", mood: "Soft rain · warm keys", note: "A slow piano-like motif beneath a veil of rain.", base: 50, scale: [0, 3, 5, 7, 10], rain: .12, seed: 741, color: "#9dcaa0" },
  { id: "moonlight", name: "Moonlit Trail", mood: "Night air · drifting bells", note: "Open chords and distant bells for a quieter kind of focus.", base: 48, scale: [0, 3, 5, 7, 10], rain: .025, seed: 292, color: "#a4aee3" },
  { id: "first-light", name: "First Light", mood: "Morning breeze · gentle chimes", note: "A brighter melody, light wind, and a little birdsong.", base: 55, scale: [0, 2, 4, 7, 9], rain: .04, seed: 813, color: "#e2cf8c" },
] as const;

export const SCORE_DURATION = 72;
const sampleRate = 22050;
const frequency = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

// Original ambient compositions. Only the selected score is rendered, on first Play.
async function renderScore(trackIndex: number) {
  const track = forestTracks[trackIndex];
  const context = new OfflineAudioContext(1, SCORE_DURATION * sampleRate, sampleRate);
  const master = context.createGain();
  master.gain.setValueAtTime(0, 0);
  master.gain.linearRampToValueAtTime(.8, .7);
  master.gain.setValueAtTime(.8, SCORE_DURATION - 1.3);
  master.gain.linearRampToValueAtTime(0, SCORE_DURATION);
  master.connect(context.destination);
  let seed: number = track.seed;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };

  const tone = (midi: number, start: number, length: number, level: number, pad = false) => {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const end = Math.min(SCORE_DURATION, start + length);
    oscillator.type = "sine";
    oscillator.frequency.value = frequency(midi);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(level, start + (pad ? 1.8 : .045));
    envelope.gain.exponentialRampToValueAtTime(.0001, end);
    oscillator.connect(envelope).connect(master);
    oscillator.start(start);
    oscillator.stop(end);
  };

  [0, 5, 7, 0, 0, 5, 7, 0].forEach((root, bar) => {
    [0, 7, 12].forEach(interval => tone(track.base - 12 + root + interval, bar * 9, 11, .033, true));
  });
  for (let beat = 0; beat < 24; beat++) {
    const note = track.base + 12 + track.scale[Math.floor(random() * track.scale.length)];
    const start = beat * 3 + .18;
    tone(note, start, 3.7, .105 + random() * .025);
    tone(note + 12, start, 1.8, .012);
    if (beat % 4 === 2) tone(note + 7, start + 1.5, 2, .025);
  }
  const noise = context.createBuffer(1, sampleRate * 4, sampleRate);
  const samples = noise.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = random() * 2 - 1;
  const breeze = context.createBufferSource();
  breeze.buffer = noise;
  breeze.loop = true;
  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = trackIndex === 0 ? 1900 : 480;
  const breezeGain = context.createGain();
  breezeGain.gain.value = track.rain;
  breeze.connect(filter).connect(breezeGain).connect(master);
  breeze.start();
  breeze.stop(SCORE_DURATION);
  if (trackIndex === 2) {
    for (let bird = 0; bird < 7; bird++) {
      const start = 4 + bird * 9;
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.frequency.setValueAtTime(1700 + random() * 500, start);
      oscillator.frequency.exponentialRampToValueAtTime(2800, start + .13);
      oscillator.frequency.exponentialRampToValueAtTime(1500, start + .4);
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(.012, start + .04);
      envelope.gain.linearRampToValueAtTime(0, start + .4);
      oscillator.connect(envelope).connect(master);
      oscillator.start(start);
      oscillator.stop(start + .4);
    }
  }
  return context.startRendering();
}

export class ForestAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private source: { node: AudioBufferSourceNode; envelope: GainNode } | null = null;
  private buffer: AudioBuffer | null = null;
  private bufferTrack = -1;
  private startTime = 0;
  private offset = 0;
  private generation = 0;
  private suspendTimer: ReturnType<typeof setTimeout> | undefined;
  private spectrum = new Uint8Array(128);
  private closed = false;

  private initialize() {
    if (this.context) return this.context;
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = 0;
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = .65;
    this.master.connect(this.analyser).connect(this.context.destination);
    return this.context;
  }

  setVolume(volume: number, muted: boolean) {
    if (this.context && this.master) this.master.gain.setTargetAtTime(muted ? 0 : volume, this.context.currentTime, .015);
  }

  position() {
    return this.source && this.context ? (this.offset + this.context.currentTime - this.startTime) % SCORE_DURATION : this.offset;
  }

  private releaseSource() {
    const source = this.source;
    this.source = null;
    if (!source || !this.context) return;
    source.envelope.gain.setTargetAtTime(0, this.context.currentTime, .012);
    source.node.stop(this.context.currentTime + .07);
    source.node.onended = () => { source.node.disconnect(); source.envelope.disconnect(); };
  }

  async play(track: number, position: number, volume: number, muted: boolean) {
    const generation = ++this.generation;
    clearTimeout(this.suspendTimer);
    this.releaseSource();
    const context = this.initialize();
    await context.resume();
    this.setVolume(volume, muted);
    if (!this.buffer || this.bufferTrack !== track) {
      const buffer = await renderScore(track);
      if (generation !== this.generation || this.closed) return false;
      this.buffer = buffer;
      this.bufferTrack = track;
    }
    if (generation !== this.generation || this.closed) return false;
    const node = context.createBufferSource();
    const envelope = context.createGain();
    node.buffer = this.buffer;
    node.loop = true;
    envelope.gain.setValueAtTime(0, context.currentTime);
    envelope.gain.linearRampToValueAtTime(1, context.currentTime + .06);
    node.connect(envelope).connect(this.master!);
    this.offset = Math.max(0, Math.min(position, SCORE_DURATION - .01));
    this.startTime = context.currentTime;
    node.start(0, this.offset);
    this.source = { node, envelope };
    return true;
  }

  pause() {
    this.offset = this.position();
    const generation = ++this.generation;
    this.releaseSource();
    clearTimeout(this.suspendTimer);
    this.suspendTimer = setTimeout(() => {
      if (generation === this.generation && this.context?.state === "running") void this.context.suspend();
    }, 130);
    return this.offset;
  }

  levels() {
    if (!this.analyser || !this.source) return Array(18).fill(0) as number[];
    this.analyser.getByteFrequencyData(this.spectrum);
    return Array.from({ length: 18 }, (_, i) => this.spectrum[1 + i] / 255);
  }

  close() {
    this.closed = true;
    this.generation++;
    clearTimeout(this.suspendTimer);
    this.source?.node.stop();
    this.source?.node.disconnect();
    this.source?.envelope.disconnect();
    this.source = null;
    this.buffer = null;
    this.master?.disconnect();
    this.analyser?.disconnect();
    if (this.context) void this.context.close();
  }
}
