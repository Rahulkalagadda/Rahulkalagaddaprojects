import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolio";
import { ProjectVisual } from "./ProjectVisual";

export function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  return <article className="project-card" style={{ "--project-accent": project.accent } as React.CSSProperties}>
    <Link className="project-image-link" href={"/projects/" + project.slug} aria-label={"Read the " + project.name + " case study"}>
      <ProjectVisual kind={project.visual} name={project.name} />
      <span className="project-open"><ArrowUpRight size={24} /></span>
      <span className="project-status">{project.status}</span>
    </Link>
    <div className="project-meta"><span className="mono">{String(index + 1).padStart(2, "0")} / {project.category}</span><span className="mono">CASE STUDY</span></div>
    <h3><Link href={"/projects/" + project.slug}>{project.name}<ArrowUpRight size={24} /></Link></h3>
    <p>{project.description}</p>
    <div className="tech-tags">{project.tech.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div>
  </article>;
}
