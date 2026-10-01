import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Braces, Cpu, Layers, MapPin } from "lucide-react";
import { Scene } from "@/components/portfolio/Scene";
import { ActionLink, CallToAction, Eyebrow, SourceLink } from "@/components/portfolio/Primitives";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { disciplines, person, projects } from "@/data/portfolio";

export default function Home() {
  return <>
    <section className="hero container">
      <div className="hero-top"><Eyebrow dot>Rahul Kalagadda · Creative engineering</Eyebrow><span className="mono hero-location"><MapPin size={12} />INDIA / UTC +05:30</span></div>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1>Engineering<br />beyond the<br /><span className="serif-word">ordinary</span><span className="hero-period">.</span></h1>
          <p className="hero-description">Intelligent systems. Thoughtful software.<br />Digital experiences with a little more dimension.</p>
          <div className="action-row"><ActionLink href="/projects" primary>Explore my work</ActionLink><ActionLink href="/about">Meet the engineer</ActionLink></div>
        </div>
        <div className="hero-sculpture">
          <span className="hero-orbit orbit-a" aria-hidden="true" />
          <span className="object-label mono">FIG. 01 / IDEAS IN MOTION</span>
          <Scene variant="hero" />
          <span className="sculpture-note mono"><span className="tiny-cross">+</span>DRAG TO EXPLORE</span>
          <span className="sculpture-coordinate mono" aria-hidden="true">X 0.24<br />Y 1.08<br />Z ∞</span>
        </div>
      </div>
      <div className="hero-bottom"><div className="role-list">{person.roles.map((role, i) => <span key={role}><i aria-hidden="true">0{i + 1}</i>{role}</span>)}</div><a href="#selected-work" className="scroll-cue"><span>SCROLL TO DISCOVER</span><ArrowDownRight size={23} /></a></div>
    </section>
    <div className="discipline-strip"><div className="container"><span>Intelligence</span><i>✳</i><span>Engineering</span><i>✳</i><span>Imagination</span><i>✳</i><span>Built into every detail</span></div></div>
    <section id="selected-work" className="container section-pad">
      <div className="section-heading"><div><Eyebrow><span className="index-number">01</span>Selected work</Eyebrow><h2>Ideas, turned<br /><span className="serif-word">into something.</span></h2></div><div className="section-heading-aside"><p>A selection of AI systems, full-stack applications, and interface explorations. Each one solves a different piece of the puzzle.</p><SourceLink /></div></div>
      <div className="project-grid">{projects.slice(0, 4).map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
      <div className="section-footer"><span className="mono">A CLOSER LOOK AT THE THINKING BEHIND THE WORK.</span><ActionLink href="/projects">All {projects.length} projects</ActionLink></div>
    </section>
    <section className="container about-preview section-pad">
      <div className="about-sculpture-card"><div className="initials-sculpture" aria-hidden="true">rk<span>.</span></div><span className="mono">ONE ENGINEER / MANY PERSPECTIVES</span><div className="about-card-caption"><span>{person.name}</span><ArrowUpRight size={26} /></div></div>
      <div className="about-preview-copy"><Eyebrow><span className="index-number">02</span>The person behind the code</Eyebrow><h2>Curious by nature.<br /><span className="serif-word">Engineer by choice.</span></h2><p>{person.intro}</p><p>My work lives where AI, engineering, and product meet. I care about how a system works and how it feels to use.</p><ActionLink href="/about">A little more about me</ActionLink></div>
    </section>
    <section className="container section-pad expertise-preview">
      <div className="section-heading"><div><Eyebrow><span className="index-number">03</span>What I bring to the table</Eyebrow><h2>Different disciplines.<br /><span className="serif-word">One connected view.</span></h2></div><ActionLink href="/expertise">Explore my expertise</ActionLink></div>
      <div className="discipline-cards">{disciplines.map((discipline, index) => <Link href={"/expertise#" + discipline.number} className="discipline-card" key={discipline.number}><div className="discipline-card-top"><span className="mono">{discipline.number}</span>{index === 0 ? <Cpu size={29} strokeWidth={1.2} /> : index === 1 ? <Layers size={29} strokeWidth={1.2} /> : <Braces size={29} strokeWidth={1.2} />}</div><h3>{discipline.title}</h3><p>{discipline.text}</p><span className="discipline-card-bottom mono">EXPLORE<ArrowUpRight size={19} /></span></Link>)}</div>
    </section>
    <section className="container playground-teaser"><div><Eyebrow><span className="index-number">04</span>A little room to play</Eyebrow><h2>Curiosity looks good<br /><span className="serif-word">in three dimensions.</span></h2><p>Step into the playground. Change the geometry, explore the materials, and make the sculpture your own.</p><ActionLink href="/playground" primary>Enter the playground</ActionLink></div><Link href="/playground" className="teaser-object" aria-label="Open the interactive 3D playground"><Scene variant="preview" shape="orbit" finish="cobalt" speed={0.65} interactive={false} /><b className="teaser-arrow"><ArrowUpRight size={27} /></b></Link></section>
    <CallToAction />
  </>;
}

