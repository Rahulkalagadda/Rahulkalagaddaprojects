"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy, Plus, RotateCcw, Sprout } from "lucide-react";
import { projects } from "@/data/portfolio";
import { ProjectVisual } from "./ProjectVisual";

const defaults = ["sevasetu-ai", "estateflow-crm"];

function readSelection() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has("selection")) return defaults;
  const raw = params.get("selection") || "";
  const valid = Array.from(new Set(raw.split(","))).filter(slug => projects.some(project => project.slug === slug)).slice(0, 3);
  return raw && !valid.length ? defaults : valid;
}

export function ProjectComparison() {
  const [selected, setSelected] = useState(defaults);
  const [ready, setReady] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    const restore = () => { setSelected(readSelection()); setCopyMessage(""); };
    restore();
    setReady(true);
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    url.searchParams.set("selection", selected.join(","));
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [selected, ready]);

  const toggle = (slug: string) => {
    setSelected(current => current.includes(slug) ? current.filter(item => item !== slug) : current.length < 3 ? [...current, slug] : current);
    setCopyMessage("");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMessage("Comparison link copied.");
    } catch {
      setCopyMessage("Copy the URL from your address bar to share this selection.");
    }
  };

  const compared = selected.map(slug => projects.find(project => project.slug === slug)!);

  return <section className="container comparison-workspace" aria-label="Project comparison">
    <div className="comparison-selector">
      <div className="comparison-selector-heading"><div><p className="eyebrow">Build your own collection</p><h2>A different view<br /><span className="serif-word">of the work.</span></h2></div><p id="comparison-selection-help">Choose up to three projects. Compare their purpose, stack, architecture, and scope.</p></div>
      <div className="comparison-choices" role="group" aria-label="Choose projects to compare" aria-describedby="comparison-selection-help">
        {projects.map(project => <button key={project.slug} aria-pressed={selected.includes(project.slug)} disabled={!selected.includes(project.slug) && selected.length === 3} onClick={() => toggle(project.slug)}>{selected.includes(project.slug) ? <Check size={15} /> : <Plus size={15} />}<span>{project.name}</span><small>{project.category}</small></button>)}
      </div>
      <div className="comparison-toolbar"><p className="mono" aria-live="polite">{selected.length} / 3 selected{selected.length === 3 ? " · Remove one to choose another" : ""}</p><div><button className="text-link" onClick={() => { setSelected(defaults); setCopyMessage(""); }}><RotateCcw size={14} />Reset selection</button><button className="text-link" onClick={copyLink} disabled={!ready || !selected.length}><Copy size={14} />Copy comparison link</button></div></div>
      <p className="comparison-copy-status" role="status">{copyMessage}</p>
    </div>
    {compared.length ? <div className="comparison-grid" style={{ "--comparison-columns": compared.length } as CSSProperties}>
      {compared.map(project => <article className="comparison-project" key={project.slug} aria-labelledby={"compare-" + project.slug}>
        <div className="comparison-project-heading"><Link className="comparison-project-art" href={"/projects/" + project.slug} aria-label={"Read the " + project.name + " case study"}><ProjectVisual kind={project.visual} name={project.name} /><span><ArrowUpRight size={18} /></span></Link><div><p className="eyebrow">{project.category}</p><h3 id={"compare-" + project.slug}>{project.name}</h3><span className="comparison-status">{project.status}</span></div></div>
        <section className="comparison-cell"><h4>01 / Purpose</h4><p>{project.description}</p></section>
        <section className="comparison-cell"><h4>02 / The stack</h4><ul className="comparison-stack">{project.tech.map(tech => <li key={tech}>{tech}</li>)}</ul></section>
        <section className="comparison-cell"><h4>03 / System flow</h4><ol className="comparison-flow">{project.architecture.map(stage => <li key={stage.title}><strong>{stage.title}</strong><span>{stage.detail}</span></li>)}</ol></section>
        <section className="comparison-cell"><h4>04 / Project scope</h4><p>{project.scope}</p></section>
        <div className="comparison-project-links"><Link className="text-link" href={"/projects/" + project.slug}>Read case study<ArrowUpRight size={16} /></Link><a className="text-link" href={project.repo} target="_blank" rel="noopener noreferrer">Source<ArrowUpRight size={16} /></a></div>
      </article>)}
    </div> : <div className="comparison-empty"><Sprout size={36} /><h2>Room for a new perspective.</h2><p>Choose a project above to start exploring.</p><button className="pill-button button-outline" onClick={() => setSelected(defaults)}>Start with AI + full stack<span className="button-icon"><Plus size={17} /></span></button></div>}
    <p className="comparison-footnote">Based on the linked repositories. Project scopes distinguish applications, integration prototypes, and interface explorations.</p>
  </section>;
}
