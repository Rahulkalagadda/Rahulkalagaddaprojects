"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, MousePointer2, Pause, Play, RotateCcw } from "lucide-react";
import { Scene, type SculptureFinish, type SculptureShape } from "./Scene";
import { useMotionSettings } from "./MotionProvider";

export function Playground() {
  const { enabled } = useMotionSettings();
  const [shape, setShape] = useState<SculptureShape>("knot");
  const [finish, setFinish] = useState<SculptureFinish>("chrome");
  const [speed, setSpeed] = useState(1);
  const [running, setRunning] = useState(true);
  const [userMotion, setUserMotion] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  useEffect(() => { setRunning(enabled); setUserMotion(false); }, [enabled]);
  const reset = () => {
    setShape("knot"); setFinish("chrome"); setSpeed(1);
    setRunning(enabled);
    setUserMotion(false); setResetKey(value => value + 1);
  };
  return <section className="container playground-layout">
    <div className="playground-stage">
      <div className="stage-grid" aria-hidden="true" /><span className="stage-orbit" aria-hidden="true" />
      <div className="stage-top mono"><span><i className="blue-dot" />OBJECT / {shape.toUpperCase()}</span><span>REAL-TIME 3D</span></div>
      <Scene shape={shape} finish={finish} speed={speed} running={running} userMotion={userMotion} resetKey={resetKey} />
      <div className="stage-bottom mono"><span><MousePointer2 size={14} />Drag to rotate · Arrow keys also work</span><span>01 / RK</span></div>
    </div>
    <aside className="playground-controls">
      <div className="control-heading"><span className="eyebrow">Your creative sandbox</span><h2>Make it<br /><span className="serif-word">your own.</span></h2><p>A small experiment in shape, light, and interaction. Change the object and see where it takes you.</p></div>
      <fieldset><legend>01 — Geometry</legend><div className="shape-options">{(["knot", "orbit", "sphere", "helix"] as const).map(item => <button key={item} aria-pressed={shape === item} className={shape === item ? "shape-option selected" : "shape-option"} onClick={() => setShape(item)}><span className={"shape-icon shape-" + item} aria-hidden="true" /><span>{item[0].toUpperCase() + item.slice(1)}</span></button>)}</div></fieldset>
      <fieldset><legend>02 — Material</legend><div className="material-options">{(["chrome", "cobalt", "pearl", "iridescent"] as const).map(item => <button key={item} aria-pressed={finish === item} className={finish === item ? "material-option selected" : "material-option"} onClick={() => setFinish(item)}><span className={"material-swatch swatch-" + item} /><span>{item[0].toUpperCase() + item.slice(1)}</span></button>)}</div></fieldset>
      <div className="speed-control"><label htmlFor="rotation-speed">03 — Rotation speed</label><output htmlFor="rotation-speed">{speed.toFixed(1)}×</output><input id="rotation-speed" type="range" min="0.2" max="2" step="0.1" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></div>
      <div className="playback-controls"><button className="pill-button button-primary" onClick={() => { setRunning(value => !value); setUserMotion(true); }} aria-pressed={!running}>{running ? <Pause size={16} /> : <Play size={16} />}<span>{running ? "Pause motion" : "Play motion"}</span></button><button className="icon-button reset-button" onClick={reset} aria-label="Reset sculpture and controls" title="Reset all"><RotateCcw size={18} /></button></div>
      <p className="control-note"><ArrowUpRight size={14} />Built with Three.js. Made for a moment of exploration.</p>
    </aside>
  </section>;
}
