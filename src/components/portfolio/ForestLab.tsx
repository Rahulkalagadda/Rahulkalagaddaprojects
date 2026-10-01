"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Cloud, Moon, MousePointer2, Pause, Play, RotateCcw, Sparkles, Sunrise, Wind } from "lucide-react";
import { ForestScene, type ForestLight } from "./ForestScene";
import { useMotionSettings } from "./MotionProvider";
import { LeafMark } from "./Botanical";

export function ForestLab() {
  const { enabled } = useMotionSettings();
  const [light, setLight] = useState<ForestLight>("moonlight");
  const [wind, setWind] = useState(0.8);
  const [fireflies, setFireflies] = useState(true);
  const [mist, setMist] = useState(true);
  const [running, setRunning] = useState(true);
  const [userMotion, setUserMotion] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => { setRunning(enabled); setUserMotion(false); }, [enabled]);
  const reset = () => {
    setLight("moonlight"); setWind(0.8); setFireflies(true); setMist(true);
    setRunning(enabled); setUserMotion(false); setResetKey(value => value + 1);
  };
  return <section className="container forest-lab-layout">
    <div className="forest-lab-stage" data-light={light}>
      <ForestScene variant="lab" light={light} wind={wind} fireflies={fireflies} mist={mist} running={running} userMotion={userMotion} resetKey={resetKey} />
      <div className="forest-stage-top mono"><span><LeafMark />A LIVING LANDSCAPE</span><span>{light === "moonlight" ? "BLUE HOUR / 01" : "FIRST LIGHT / 02"}</span></div>
      <div className="forest-stage-bottom"><span><MousePointer2 size={14} />Drag to explore · Arrow keys also work</span><span className="mono">PINE / FERN / MOSS</span></div>
    </div>
    <aside className="forest-lab-controls">
      <div className="forest-control-heading"><span className="eyebrow">Follow your curiosity</span><h2>Make a little<br /><span className="serif-word">atmosphere.</span></h2><p>Take a breath. Look around. Leave the forest a little different than you found it.</p></div>
      <fieldset><legend>01 / Light</legend><div className="forest-light-options">{(["moonlight", "sunrise"] as const).map(item => <button key={item} onClick={() => setLight(item)} aria-pressed={light === item} className={light === item ? "selected" : ""}>{item === "moonlight" ? <Moon size={20} /> : <Sunrise size={20} />}<span>{item === "moonlight" ? "Moonlight" : "Sunrise"}</span></button>)}</div></fieldset>
      <div className="forest-wind-control"><label htmlFor="forest-wind"><Wind size={15} />02 / Wind</label><output htmlFor="forest-wind">{wind === 0 ? "Still" : wind < 1 ? "Gentle" : "Breezy"}</output><input id="forest-wind" aria-label="Wind strength" type="range" min="0" max="2" step="0.1" value={wind} onChange={event => setWind(Number(event.target.value))} /></div>
      <fieldset className="forest-elements"><legend>03 / Details</legend><button onClick={() => setFireflies(value => !value)} aria-pressed={fireflies}><span><Sparkles size={17} />Fireflies</span><i className={fireflies ? "forest-switch on" : "forest-switch"} aria-hidden="true" /></button><button onClick={() => setMist(value => !value)} aria-pressed={mist}><span><Cloud size={17} />Forest mist</span><i className={mist ? "forest-switch on" : "forest-switch"} aria-hidden="true" /></button></fieldset>
      <div className="playback-controls"><button className="pill-button button-primary" onClick={() => { setRunning(value => !value); setUserMotion(true); }} aria-pressed={!running}>{running ? <Pause size={16} /> : <Play size={16} />}<span>{running ? "Pause motion" : "Play motion"}</span></button><button className="icon-button" onClick={reset} aria-label="Reset forest and controls" title="Reset forest"><RotateCcw size={18} /></button></div>
      <a className="forest-control-note" href="/credits">Real 3D foliage. A little digital magic.<ArrowUpRight size={14} /></a>
    </aside>
  </section>;
}
