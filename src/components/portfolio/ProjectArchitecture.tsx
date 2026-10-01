"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolio";
import { BotanicalBranch } from "./Botanical";

type ArchitectureProject = Pick<PortfolioProject, "slug" | "name" | "architecture" | "repo">;
const points = [[80, 230], [210, 110], [350, 230], [480, 110]];

export function ProjectArchitecture({ project }: { project: ArchitectureProject }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const stages = project.architecture;
  const stage = stages[active];
  const panelId = project.slug + "-architecture-panel";

  const navigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + stages.length) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return <div className="architecture-explorer">
    <div className="architecture-tabs" role="tablist" aria-label={project.name + " architecture stages"}>
      {stages.map((item, index) => <button
        key={item.title} role="tab" id={project.slug + "-stage-" + index}
        aria-selected={active === index} aria-controls={panelId} tabIndex={active === index ? 0 : -1}
        ref={element => { tabs.current[index] = element; }}
        onClick={() => setActive(index)} onKeyDown={event => navigate(event, index)}
      ><span className="architecture-tab-number mono">{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><ArrowUpRight size={16} aria-hidden="true" /></button>)}
    </div>
    <div className="architecture-detail" role="tabpanel" id={panelId} aria-labelledby={project.slug + "-stage-" + active} tabIndex={0}>
      <div className="architecture-stage-copy" key={active}>
        <p className="eyebrow">Inside the system · {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}</p>
        <h3>{stage.title}<span className="blue-dot">.</span></h3>
        <p className="architecture-stage-description">{stage.detail}</p>
        <a href={project.repo} className="text-link" target="_blank" rel="noopener noreferrer">Explore the implementation<ArrowUpRight size={16} /></a>
      </div>
      <div className="architecture-map" aria-hidden="true">
        <BotanicalBranch className="architecture-botanical" />
        <svg viewBox="0 0 560 350" className="architecture-network">
          <path className="architecture-path" d="M80 230C145 230 145 110 210 110S285 230 350 230S415 110 480 110" />
          {points.slice(0, stages.length).map(([x, y], index) => <g key={index} className={active === index ? "architecture-map-node is-active" : "architecture-map-node"}>
            <circle cx={x} cy={y} r="43" className="architecture-node-halo" />
            <circle cx={x} cy={y} r="28" className="architecture-node-core" />
            <text x={x} y={y + 4} textAnchor="middle">{String(index + 1).padStart(2, "0")}</text>
            <circle cx={x} cy={y + 60} r="3" />
          </g>)}
        </svg>
        <span className="architecture-map-caption mono">A system is a set of connections.</span>
      </div>
    </div>
    <div className="architecture-navigation">
      <span>Choose a stage. Follow the connections.</span>
      <div><button className="icon-button" aria-label="Previous architecture stage" disabled={active === 0} onClick={() => setActive(value => value - 1)}><ArrowLeft size={17} /></button><span className="mono" aria-live="polite">{active + 1} / {stages.length}</span><button className="icon-button" aria-label="Next architecture stage" disabled={active === stages.length - 1} onClick={() => setActive(value => value + 1)}><ArrowRight size={17} /></button></div>
    </div>
  </div>;
}
