import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { ActionLink, CallToAction, Eyebrow } from "@/components/portfolio/Primitives";
import { ProjectVisual } from "@/components/portfolio/ProjectVisual";
import { ProjectArchitecture } from "@/components/portfolio/ProjectArchitecture";
import { getProject, projects } from "@/data/portfolio";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export const dynamicParams = false;
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  return project ? { title: project.name, description: project.description } : { title: "Project not found" };
}
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const index = projects.findIndex(item => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];
  return <>
    <section className="container case-intro"><Link href="/projects" className="back-link"><ArrowLeft size={16}/>Back to projects</Link><div className="case-heading"><div><Eyebrow>{String(index + 1).padStart(2, "0")} / {project.category}</Eyebrow><h1>{project.name}<span className="blue-dot">.</span></h1><p>{project.eyebrow}</p></div><ActionLink href={project.repo} external primary>View source code</ActionLink></div><div className="case-meta"><div><span>Discipline</span><strong>{project.category}</strong></div><div><span>Project scope</span><strong>{project.status}</strong></div><div><span>Engineering focus</span><strong>{project.tech.slice(0, 3).join(" / ")}</strong></div></div></section>
    <div className="container case-art"><ProjectVisual kind={project.visual} name={project.name} large/><p className="art-disclaimer mono">CONCEPTUAL INTERFACE ILLUSTRATION · EXPLORE THE REPOSITORY FOR THE IMPLEMENTATION</p></div>
    <section className="container case-story"><div><Eyebrow>The brief</Eyebrow><h2>A problem<br /><span className="serif-word">worth exploring.</span></h2></div><div><p className="case-lead">{project.description}</p><h3>The challenge</h3><p>{project.challenge}</p><h3>The approach</h3><p>{project.approach}</p><div className="skill-pills">{project.tech.map(tag=><span key={tag}>{tag}</span>)}</div></div></section>
    <section className="container case-features"><Eyebrow>Inside the implementation</Eyebrow><div className="principles-grid">{project.features.map((feature,i)=><article key={feature.title}><span className="mono">0{i+1} /</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>
    <section className="container case-architecture"><div className="section-heading"><div><Eyebrow>The architecture</Eyebrow><h2>How the pieces<br /><span className="serif-word">connect.</span></h2></div><div className="section-heading-aside"><p>A simplified view of the architecture described in the repository. Choose a stage to look closer.</p><div className="case-architecture-links"><Link className="text-link" href={"/projects/compare?selection=" + project.slug + "," + next.slug}>Compare this project<ArrowUpRight size={16} /></Link></div></div></div><ProjectArchitecture project={{ slug: project.slug, name: project.name, architecture: project.architecture, repo: project.repo }} /></section>
    <section className="container case-scope"><div><Eyebrow>Scope &amp; perspective</Eyebrow><h2>Clear boundaries.<br /><span className="serif-word">Useful lessons.</span></h2></div><div><p>{project.scope}</p><blockquote>{project.takeaway}</blockquote><div className="action-row"><ActionLink href={project.repo} external>Explore the repository</ActionLink>{project.additionalRepo&&<a href={project.additionalRepo} className="text-link" target="_blank" rel="noopener noreferrer">Backend source<ArrowUpRight size={16}/></a>}</div></div></section>
    <Link className="container next-project" href={"/projects/"+next.slug}><div><Eyebrow>Up next</Eyebrow><h2>{next.name}</h2></div><ArrowUpRight size={54} strokeWidth={1}/></Link><CallToAction />
  </>;
}
