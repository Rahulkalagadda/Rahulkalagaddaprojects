"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check, Play, RotateCcw } from "lucide-react";
const steps = [
  { name: "Interface", detail: "A person asks a question through a clear, accessible interface." },
  { name: "API", detail: "The API validates the request and carries the conversation context." },
  { name: "Retrieval", detail: "Relevant document context is selected for the question." },
  { name: "Model", detail: "The language model uses the question and retrieved context to compose a response." },
  { name: "Response", detail: "The application returns the answer to the interface." },
];

export function PipelineWalkthrough() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    if (active >= steps.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setActive(value => value + 1), 1000);
    return () => window.clearTimeout(timer);
  }, [active, playing]);
  return <div className="pipeline-panel">
    <div className="pipeline-heading"><span className="eyebrow">An illustrative AI request path</span><button className="text-link" onClick={() => { setActive(0); setPlaying(true); }}>{active === steps.length - 1 ? <RotateCcw size={15} /> : <Play size={15} />}Replay walkthrough</button></div>
    <div className="pipeline-steps" role="group" aria-label="Explore the stages of an AI request">{steps.map((step, index) => <div className="pipeline-step-wrap" key={step.name}><button className={"pipeline-step" + (index === active ? " current" : index < active ? " complete" : "")} aria-pressed={index === active} onClick={() => { setPlaying(false); setActive(index); }}><span>{index < active ? <Check size={16} /> : String(index + 1).padStart(2, "0")}</span><strong>{step.name}</strong></button>{index < steps.length - 1 && <ArrowRight className="pipeline-arrow" size={18} />}</div>)}</div>
    <p className="pipeline-description" aria-live="polite"><span className="mono">{String(active + 1).padStart(2, "0")} /</span>{steps[active].detail}</p>
  </div>;
}
