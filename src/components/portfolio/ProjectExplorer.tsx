"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";

const categories: ("All projects" | ProjectCategory)[] = ["All projects", "AI & ML", "Full stack", "Interfaces"];

export function ProjectExplorer() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All projects");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => projects.filter(project =>
    (category === "All projects" || project.category === category) &&
    (project.name + " " + project.description + " " + project.tech.join(" ")).toLowerCase().includes(query.trim().toLowerCase())
  ), [category, query]);
  return <section className="container project-explorer" aria-label="Browse projects">
    <div className="project-toolbar"><div className="filter-buttons" role="group" aria-label="Filter by discipline">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? "filter-chip selected" : "filter-chip"} onClick={() => setCategory(item)}>{item}<span>{item === "All projects" ? projects.length : projects.filter(project => project.category === item).length}</span></button>)}</div><div className="project-search"><Search size={16} /><label htmlFor="project-search" className="sr-only">Search projects or technologies</label><input id="project-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search projects or tech…" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></button>}</div></div>
    <div className="results-line mono" aria-live="polite">{filtered.length} {filtered.length === 1 ? "project" : "projects"}{category !== "All projects" ? " in " + category : " to explore"}{query ? " matching “" + query + "”" : ""}</div>
    {filtered.length ? <div className="project-grid">{filtered.map(project => <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />)}</div> : <div className="empty-state"><Search size={30} /><h2>No projects found.</h2><p>Try another discipline or technology.</p><button className="pill-button button-outline" onClick={() => { setQuery(""); setCategory("All projects"); }}>Reset filters<X size={15} /></button></div>}
  </section>;
}
