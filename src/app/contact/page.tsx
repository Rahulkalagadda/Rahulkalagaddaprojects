import type { Metadata } from "next";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import { PageIntro } from "@/components/portfolio/Primitives";
import { ContactForm } from "@/components/portfolio/ContactForm";
import { person } from "@/data/portfolio";
export const metadata: Metadata = { title: "Contact", description: "Start a conversation with Rahul Kalagadda about AI engineering, software development, a role, or a collaboration." };
export default function ContactPage() {
  return <><PageIntro number="05" label="Every project starts somewhere" title="An idea. A hello." italic="A possibility." text="Have a project to build, a role to discuss, or a question about the work? I'd like to hear what you have in mind." />
    <section className="container contact-layout"><div className="contact-direct"><span className="eyebrow"><span className="status-dot" />Open to conversations</span><h2>Good things start<br /><span className="serif-word">with a hello.</span></h2><a className="contact-email" href={"mailto:"+person.email}>{person.email}<ArrowUpRight size={22}/></a><div className="contact-links"><a href={person.github} target="_blank" rel="noopener noreferrer"><Github size={19}/><span>GitHub<small>The code behind the work</small></span><ArrowUpRight size={21}/></a><a href={person.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={19}/><span>LinkedIn<small>Let&apos;s connect</small></span><ArrowUpRight size={21}/></a></div><div className="contact-location"><MapPin size={18}/><div><span>{person.location}</span><small>India Standard Time · UTC +05:30</small></div></div><div className="contact-orbit" aria-hidden="true"><span/><span/><span/><i/></div></div><ContactForm /></section></>;
}
