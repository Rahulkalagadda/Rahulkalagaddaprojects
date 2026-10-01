import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Braces, Cpu, Layers } from "lucide-react";
import { CallToAction, Eyebrow, PageIntro } from "@/components/portfolio/Primitives";
import { PipelineWalkthrough } from "@/components/portfolio/PipelineWalkthrough";
import { disciplines, getProject } from "@/data/portfolio";
export const metadata: Metadata = { title: "Expertise", description: "AI engineering, software systems, and web development: explore Rahul's skills through the projects that put them into practice." };
export default function ExpertisePage() {
  return <><PageIntro number="03" label="The engineering toolkit" title="Built across" italic="the whole stack." text="Three connected disciplines. One practical goal: turn a useful idea into a product that people can move through." />
    <section className="container expertise-list">{disciplines.map((item,i)=><article id={item.number} className="expertise-row" key={item.number}><div className="expertise-icon">{i===0?<Cpu size={44} strokeWidth={1}/>:i===1?<Layers size={44} strokeWidth={1}/>:<Braces size={44} strokeWidth={1}/>}<span className="mono">{item.number} /</span></div><div className="expertise-detail"><Eyebrow>{item.title}</Eyebrow><h2>{item.subtitle}</h2><p>{item.text}</p><div className="skill-pills">{item.skills.map(skill=><span key={skill}>{skill}</span>)}</div></div><div className="expertise-evidence"><span className="eyebrow">See it in the work</span>{item.projectSlugs.map(slug=>{const project=getProject(slug);return project?<Link key={slug} href={"/projects/"+slug}><span>{project.name}<small>{project.status}</small></span><ArrowUpRight size={20}/></Link>:null;})}</div></article>)}</section>
    <section className="container section-pad architecture-section"><div className="section-heading"><div><Eyebrow>Connecting the pieces</Eyebrow><h2>A system is more<br /><span className="serif-word">than its parts.</span></h2></div><p className="section-heading-aside">Explore a simplified retrieval-assisted AI request. This walkthrough illustrates the architecture; it does not call an AI service.</p></div><PipelineWalkthrough /></section><CallToAction /></>;
}
