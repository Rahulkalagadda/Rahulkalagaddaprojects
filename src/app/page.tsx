import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Braces, Cpu, Layers, Sparkles, Wind } from "lucide-react";
import { ForestScene } from "@/components/portfolio/ForestScene";
import { BotanicalBranch, LeafMark } from "@/components/portfolio/Botanical";
import { ActionLink, CallToAction, Eyebrow, SourceLink } from "@/components/portfolio/Primitives";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { disciplines, person, projects } from "@/data/portfolio";

export default function Home() {
  return <>
    <section className="forest-hero">
      <ForestScene />
      <div className="forest-hero-shade" aria-hidden="true" />
      <div className="forest-hero-inner container">
        <div className="forest-hero-top"><Eyebrow dot>Rahul Kalagadda · Engineering portfolio</Eyebrow><span className="forest-edition mono">WILD SYSTEMS<span>FIELD NOTES / 2026</span></span></div>
        <div className="forest-hero-copy">
          <div className="forest-hero-kicker"><span /><p>Intelligence, with a little imagination.</p></div>
          <h1>Ideas take root.<br /><span className="serif-word">Systems come alive.</span></h1>
          <p className="forest-hero-description">I&apos;m Rahul — an AI &amp; software engineer.<br />I turn complex ideas into useful, thoughtfully built software.</p>
          <div className="action-row"><ActionLink href="/projects" primary>Explore my work</ActionLink><ActionLink href="/about">Meet the engineer</ActionLink></div>
        </div>
        <div className="forest-hero-bottom"><div className="role-list">{person.roles.map((role, i) => <span key={role}><i aria-hidden="true">0{i + 1}</i>{role}</span>)}</div><a href="#selected-work" className="scroll-cue"><span>FOLLOW THE TRAIL</span><ArrowDownRight size={23} /></a></div>
      </div>
      <span className="forest-scene-note mono" aria-hidden="true">A LIVING FOREST · MOVE YOUR CURSOR</span>
    </section>
    <div className="forest-field-strip"><div className="container"><span><LeafMark />Rooted in curiosity</span><span>AI systems</span><i aria-hidden="true">✳</i><span>Full-stack software</span><i aria-hidden="true">✳</i><span>Thoughtful interfaces</span><a href={person.github} target="_blank" rel="noopener noreferrer">OPEN SOURCE<ArrowUpRight size={14} /></a></div></div>
    <section id="selected-work" className="container section-pad forest-selected">
      <div className="section-heading"><div><Eyebrow><span className="index-number">01 /</span>The work, in the wild</Eyebrow><h2>Built to solve.<br /><span className="serif-word">Made to matter.</span></h2></div><div className="section-heading-aside"><p>AI systems, connected applications, and considered interfaces. Six projects, each with its own story.</p><SourceLink /></div></div>
      <div className="project-grid">{projects.slice(0, 4).map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      <div className="section-footer"><span className="mono">A TRAIL FROM IDEA TO IMPLEMENTATION.</span><ActionLink href="/projects">All {projects.length} projects</ActionLink></div>
    </section>
    <section className="forest-story container section-pad">
      <div className="forest-story-image"><div className="forest-story-photo" aria-hidden="true" /><BotanicalBranch className="forest-story-branch" /><div className="forest-story-seal"><LeafMark /><span>ALWAYS<br />GROWING</span></div><div className="forest-story-caption"><span className="mono">THE PERSON BEHIND THE SYSTEMS</span><span>{person.name}<ArrowUpRight size={23} /></span></div></div>
      <div className="forest-story-copy"><Eyebrow><span className="index-number">02 /</span>By nature, an explorer</Eyebrow><h2>Curiosity is<br /><span className="serif-word">my starting point.</span></h2><p>{person.intro}</p><p>My work lives where AI, engineering, and product meet. I care about how a system works and how it feels to use.</p><div className="forest-person-note"><LeafMark /><span>Based in Thane, India.<br />Thinking beyond the next line of code.</span></div><ActionLink href="/about">A little more about me</ActionLink></div>
    </section>
    <section className="container section-pad expertise-preview">
      <div className="section-heading"><div><Eyebrow><span className="index-number">03 /</span>Three branches. One practice.</Eyebrow><h2>Connected thinking.<br /><span className="serif-word">Considered engineering.</span></h2></div><ActionLink href="/expertise">Explore my expertise</ActionLink></div>
      <div className="discipline-cards">{disciplines.map((discipline, index) => <Link href={"/expertise#" + discipline.number} className="discipline-card" key={discipline.number}><div className="discipline-card-top"><span className="mono">{discipline.number} /</span>{index === 0 ? <Cpu size={29} strokeWidth={1.2} /> : index === 1 ? <Layers size={29} strokeWidth={1.2} /> : <Braces size={29} strokeWidth={1.2} />}</div><h3>{discipline.title}</h3><p>{discipline.text}</p><span className="discipline-card-bottom mono">EXPLORE THIS BRANCH<ArrowUpRight size={19} /></span></Link>)}</div>
    </section>
    <section className="forest-lab-teaser container"><div className="forest-lab-teaser-photo" aria-hidden="true" /><div className="forest-lab-teaser-copy"><Eyebrow><span className="index-number">04 /</span>Take the scenic route</Eyebrow><h2>A small forest.<br /><span className="serif-word">A little wonder.</span></h2><p>Meet the living landscape behind this portfolio. Change the light, stir the leaves, and follow the fireflies.</p><ActionLink href="/playground" primary>Step into the Forest Lab</ActionLink></div><Link href="/playground" className="forest-lab-portal" aria-label="Explore the interactive Forest Lab"><span className="forest-portal-ring"><LeafMark /></span><span className="mono">ENTER THE CLEARING<ArrowUpRight size={22} /></span><div><span><Wind size={14} />Wind</span><span><Sparkles size={14} />Fireflies</span></div></Link></section>
    <CallToAction />
  </>;
}
