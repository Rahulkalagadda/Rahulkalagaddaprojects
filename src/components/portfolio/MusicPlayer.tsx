"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Check, Disc3, Headphones, LoaderCircle, Minus, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { ForestAudio, forestTracks, SCORE_DURATION } from "@/lib/forest-audio";
import { useMotionSettings } from "./MotionProvider";
import { BotanicalBranch, LeafMark } from "./Botanical";
import { Eyebrow } from "./Primitives";

type Phase = "idle" | "loading" | "playing" | "paused" | "error";
interface MusicSettings {
  track: number; phase: Phase; position: number; volume: number; muted: boolean; levels: number[]; dock: boolean;
  toggle: () => void; choose: (track: number) => void; seek: (position: number) => void;
  setVolume: (volume: number) => void; toggleMute: () => void; setDock: (open: boolean) => void;
}
const MusicContext = createContext<MusicSettings | null>(null);
const formatTime = (value: number) => Math.floor(value / 60) + ":" + String(Math.floor(value % 60)).padStart(2, "0");
function useMusic() { const context = useContext(MusicContext); if (!context) throw new Error("MusicProvider is required"); return context; }

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { enabled } = useMotionSettings();
  const [track, setTrack] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(.28);
  const [muted, setMuted] = useState(false);
  const [levels, setLevels] = useState<number[]>(Array(18).fill(0));
  const [dock, setDock] = useState(false);
  const [ready, setReady] = useState(false);
  const audio = useRef<ForestAudio | null>(null);
  const request = useRef({ id: 0 });

  useEffect(() => {
    const pending = request.current;
    try {
      const saved = JSON.parse(localStorage.getItem("rk-music") || "null");
      if (saved) {
        const selected = forestTracks.findIndex(item => item.id === saved.track);
        if (selected >= 0) setTrack(selected);
        if (typeof saved.volume === "number" && Number.isFinite(saved.volume)) setVolume(Math.max(0, Math.min(1, saved.volume)));
        if (typeof saved.muted === "boolean") setMuted(saved.muted);
      }
    } catch { /* Listening preferences are optional. */ }
    setReady(true);
    return () => { pending.id++; audio.current?.close(); audio.current = null; };
  }, []);

  useEffect(() => {
    audio.current?.setVolume(volume, muted);
    if (ready) { try { localStorage.setItem("rk-music", JSON.stringify({ track: forestTracks[track].id, volume, muted })); } catch { /* Controls still work. */ } }
  }, [volume, muted, track, ready]);

  useEffect(() => {
    if (pathname !== "/" && phase === "playing") setDock(true);
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "playing") { setLevels(Array(18).fill(0)); return; }
    const tick = () => {
      if (document.hidden) return;
      setPosition(audio.current?.position() || 0);
      setLevels(enabled ? audio.current?.levels() || Array(18).fill(0) : Array(18).fill(0));
    };
    tick();
    const timer = window.setInterval(tick, 250);
    document.addEventListener("visibilitychange", tick);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, [phase, enabled]);

  const start = async (selected: number, offset: number) => {
    const current = ++request.current.id;
    setPhase("loading");
    const room = document.querySelector(".music-listening-content")?.getBoundingClientRect();
    if (!room || room.bottom < 80 || room.top > window.innerHeight) setDock(true);
    try {
      if (!audio.current) audio.current = new ForestAudio();
      const started = await audio.current.play(selected, offset, volume, muted);
      if (current === request.current.id && started) setPhase("playing");
    } catch {
      if (current === request.current.id) { audio.current?.pause(); setPhase("error"); }
    }
  };
  const toggle = () => {
    if (phase === "playing" || phase === "loading") {
      request.current.id++;
      setPosition(audio.current?.pause() ?? position);
      setPhase("paused");
    } else void start(track, position);
  };
  const choose = (selected: number) => {
    if (selected === track) return;
    const wasPlaying = phase === "playing" || phase === "loading";
    request.current.id++;
    audio.current?.pause();
    setTrack(selected);
    setPosition(0);
    if (wasPlaying) void start(selected, 0);
    else setPhase(phase === "idle" ? "idle" : "paused");
  };
  const seek = (offset: number) => {
    setPosition(offset);
    if (phase === "playing" || phase === "loading") void start(track, offset);
  };
  // The provider survives route changes. Playback is never restored automatically.
  const value = { track, phase, position, volume, muted, levels, dock, toggle, choose, seek, setVolume, toggleMute: () => setMuted(value => !value), setDock };
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function MusicLauncher() {
  const { phase, dock, setDock } = useMusic();
  return <button id="music-launcher" className={"icon-button music-launcher" + (phase === "playing" ? " is-playing" : "")} aria-label="Open music player" aria-expanded={dock} aria-controls="forest-music-dock" title="Forest soundtrack" onClick={() => setDock(!dock)}><Music2 size={17} /></button>;
}

function MusicControls({ compact = false }: { compact?: boolean }) {
  const music = useMusic();
  const id = useId();
  const busy = music.phase === "loading";
  const playing = music.phase === "playing";
  return <div className={"music-controls" + (compact ? " music-controls-compact" : "")}>
    <div className="music-transport"><button className="icon-button" aria-label="Previous music track" onClick={() => music.choose((music.track + forestTracks.length - 1) % forestTracks.length)}><SkipBack size={18} /></button><button className="music-play" aria-label={busy ? "Cancel music loading" : playing ? "Pause music" : "Play music"} onClick={music.toggle}>{busy ? <LoaderCircle className="music-loading" size={22} /> : playing ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}</button><button className="icon-button" aria-label="Next music track" onClick={() => music.choose((music.track + 1) % forestTracks.length)}><SkipForward size={18} /></button>{!compact && <span className="music-loop-label"><Disc3 size={14} />72-second ambient loop</span>}</div>
    <div className="music-seek"><label className="sr-only" htmlFor={id + "-seek"}>Playback position</label><input id={id + "-seek"} type="range" min={0} max={SCORE_DURATION - .1} step={.1} value={music.position} aria-valuetext={formatTime(music.position) + " of " + formatTime(SCORE_DURATION)} onChange={event => music.seek(Number(event.target.value))} /><div className="mono"><span>{formatTime(music.position)}</span><span>{formatTime(SCORE_DURATION)}</span></div></div>
    <div className="music-volume"><button className="icon-button" aria-label={music.muted ? "Unmute music" : "Mute music"} aria-pressed={music.muted} onClick={music.toggleMute}>{music.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button><label className="sr-only" htmlFor={id + "-volume"}>Music volume</label><input id={id + "-volume"} type="range" min={0} max={100} step={1} value={Math.round(music.volume * 100)} onChange={event => music.setVolume(Number(event.target.value) / 100)} /><output htmlFor={id + "-volume"}>{music.muted ? "Muted" : Math.round(music.volume * 100) + "%"}</output>{compact && <select aria-label="Select music track" value={music.track} onChange={event => music.choose(Number(event.target.value))}>{forestTracks.map((track, i) => <option value={i} key={track.id}>{track.name}</option>)}</select>}</div>
    {music.phase === "error" && <p className="music-error" role="status">Sound couldn&apos;t start. Press Play to try again.</p>}
  </div>;
}

export function ListeningRoom() {
  const music = useMusic();
  const track = forestTracks[music.track];
  return <section id="listening-room" className="container section-pad listening-room">
    <div className="section-heading"><div><Eyebrow><span className="index-number">06 /</span>The listening room</Eyebrow><h2>A little atmosphere.<br /><span className="serif-word">A slower rhythm.</span></h2></div><p className="section-heading-aside">Three original ambient sketches for exploring the forest. Choose your soundtrack. Sound starts when you press Play.</p></div>
    <div className="listening-panel" data-audio-state={music.phase} data-track={track.id} style={{ "--record-color": track.color } as CSSProperties}>
      <div className="music-artwork"><BotanicalBranch className="music-artwork-branch" /><span className="music-edition mono">WILD SYSTEMS / ORIGINAL SCORES</span><div className="music-record-wrap"><div className="music-record" data-playing={music.phase === "playing"}><div className="music-record-label"><LeafMark /><span>WILD<br />SYSTEMS</span><i /></div></div></div><div className="music-waveform" aria-hidden="true">{music.levels.map((level, i) => <i key={i} style={{ height: (4 + level * 32) + "px" }} />)}</div><span className="music-art-caption mono">A SOUNDTRACK FOR THE SCENIC ROUTE</span></div>
      <div className="music-listening-content"><div className="music-now"><span className="eyebrow"><Headphones size={15} />{music.phase === "playing" ? "Now playing" : "Ready when you are"}</span><span className="mono">0{music.track + 1} / 03</span></div><h3>{track.name}<span className="blue-dot">.</span></h3><p>{track.note}</p><MusicControls /><div className="music-playlist" role="group" aria-label="Forest soundtrack playlist">{forestTracks.map((item, i) => <button key={item.id} aria-pressed={music.track === i} onClick={() => music.choose(i)}><span className="mono">0{i + 1}</span><span><strong>{item.name}</strong><small>{item.mood}</small></span>{music.track === i ? <Check size={17} /> : <ArrowUpRight size={17} />}</button>)}</div><p className="music-note">Opt-in sound. Your controls follow you between pages.</p></div>
    </div>
  </section>;
}

export function MusicDock({ blocked = false }: { blocked?: boolean }) {
  const music = useMusic();
  const track = forestTracks[music.track];
  return <aside id="forest-music-dock" className="music-dock" hidden={!music.dock || blocked} aria-label="Music player" data-audio-state={music.phase} data-track={track.id} data-lenis-prevent>
    <div className="music-dock-heading"><div className="music-dock-disc"><LeafMark /></div><div><span className="mono">FOREST SOUNDTRACK</span><strong>{track.name}</strong></div><button className="icon-button" aria-label="Minimize music player" onClick={() => { music.setDock(false); document.getElementById("music-launcher")?.focus(); }}><Minus size={17} /></button></div><MusicControls compact />
  </aside>;
}
