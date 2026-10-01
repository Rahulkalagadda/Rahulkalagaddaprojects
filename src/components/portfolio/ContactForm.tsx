"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { person } from "@/data/portfolio";
import { buildContactDraft, contactMailto } from "@/lib/contact-draft";

export function ContactForm() {
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next = buildContactDraft({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      focus: String(data.get("focus") || "Project conversation"),
      message: String(data.get("message") || ""),
    });
    setDraft(next);
    setCopyStatus("");
    window.location.href = contactMailto(person.email, next);
  };
  const copy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText("To: " + person.email + "\nSubject: " + draft.subject + "\n\n" + draft.body);
      setCopyStatus("Email details copied.");
    } catch {
      setCopyStatus("Copy is unavailable. You can select the draft below or email Rahul directly.");
    }
  };
  return <div className="contact-form-panel">
    <div className="form-heading"><span className="eyebrow">A good place to start</span><h2>Tell me about<br /><span className="serif-word">your idea.</span></h2></div>
    <form onSubmit={submit}>
      <div className="form-row"><div className="form-field"><label htmlFor="contact-name">Your name</label><input id="contact-name" name="name" autoComplete="name" placeholder="What should I call you?" required maxLength={120} /></div><div className="form-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required maxLength={254} /></div></div>
      <div className="form-field"><label htmlFor="contact-focus">What are you thinking about?</label><select id="contact-focus" name="focus" defaultValue="AI engineering"><option>AI engineering</option><option>Software engineering</option><option>Web application development</option><option>Role or collaboration</option><option>Just saying hello</option></select></div>
      <div className="form-field"><label htmlFor="contact-message">A little about your idea</label><textarea id="contact-message" name="message" rows={5} required maxLength={4000} placeholder="The idea, the challenge, or the thing you want to build…" /></div>
      <div className="form-submit"><button type="submit" className="pill-button button-primary"><span>Prepare email</span><span className="button-icon"><ArrowUpRight size={18} /></span></button><p>Opens a draft in your email app.<br />You review and send it there.</p></div>
    </form>
    {draft && <div className="draft-feedback" role="status"><div><Check size={17} /><strong>Your email draft is ready.</strong></div><p>Send it from your mail app. If it did not open, use the link or copy the details below.</p><div className="draft-actions"><a href={contactMailto(person.email, draft)} className="text-link"><Mail size={15} />Open email draft<ArrowUpRight size={14} /></a><button className="text-link" onClick={copy}><Copy size={15} />Copy details</button></div>{copyStatus && <p>{copyStatus}</p>}<details><summary>View email draft</summary><pre>{"To: " + person.email + "\nSubject: " + draft.subject + "\n\n" + draft.body}</pre></details></div>}
  </div>;
}
