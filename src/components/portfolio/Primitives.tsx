import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { person } from "@/data/portfolio";

export function Eyebrow({ children, dot = false }: { children: React.ReactNode; dot?: boolean }) {
  return <p className="eyebrow">{dot && <span className="status-dot" aria-hidden="true" />}{children}</p>;
}

export function PageIntro({ number, label, title, italic, text, children }: {
  number: string; label: string; title: string; italic?: string; text: string; children?: React.ReactNode;
}) {
  return <section className="page-intro container">
    <Eyebrow><span className="index-number">{number}</span>{label}</Eyebrow>
    <div className="intro-grid">
      <h1>{title}{italic && <><br /><span className="serif-word">{italic}</span></>}</h1>
      <div className="intro-aside"><p>{text}</p>{children}</div>
    </div>
  </section>;
}

export function ActionLink({ href, children, primary = false, external = false, down = false, className = "" }: {
  href: string; children: React.ReactNode; primary?: boolean; external?: boolean; down?: boolean; className?: string;
}) {
  const content = <><span>{children}</span><span className="button-icon">{down ? <ArrowDown size={17} /> : external ? <ArrowUpRight size={17} /> : <ArrowRight size={17} />}</span></>;
  const classes = "pill-button " + (primary ? "button-primary " : "button-outline ") + className;
  if (external || href.startsWith("mailto:") || href.startsWith("#")) {
    return <a href={href} className={classes} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{content}</a>;
  }
  return <Link href={href} className={classes}>{content}</Link>;
}

export function CallToAction() {
  return <section className="container cta-section">
    <div className="cta-orbit" aria-hidden="true"><span /><span /><span /></div>
    <div className="cta-content">
      <Eyebrow>Have something in mind?</Eyebrow>
      <h2>Let&apos;s build<br /><span className="serif-word">what&apos;s next.</span></h2>
      <ActionLink href="/contact" primary>Start a conversation</ActionLink>
    </div>
    <span className="cta-coordinate mono" aria-hidden="true">IDEA → SYSTEM → EXPERIENCE</span>
  </section>;
}

export function SourceLink({ href = person.github, label = "View GitHub" }: { href?: string; label?: string }) {
  return <a className="text-link" href={href} target="_blank" rel="noopener noreferrer"><Github size={16} /><span>{label}</span><ArrowUpRight size={15} /></a>;
}
