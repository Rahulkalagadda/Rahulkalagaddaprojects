"use client";

import { useState } from "react";
import { Copy, Download, Printer } from "lucide-react";
import { disciplines, journey, person, projects } from "@/data/portfolio";

export function ResumeActions() {
  const [status, setStatus] = useState("");
  const text = [
    "# " + person.name,
    person.roles.join(" · "),
    person.location,
    "Email: " + person.email,
    "GitHub: " + person.github,
    "LinkedIn: " + person.linkedin,
    "",
    "## Profile",
    person.intro,
    "",
    "## Experience",
    ...journey.flatMap(item => ["### " + item.role + " | " + item.company, item.period, item.text, ""]),
    "## Selected projects",
    ...projects.flatMap(project => ["### " + project.name + " (" + project.status + ")", project.description, "Technologies: " + project.tech.join(", "), "Source: " + project.repo, ""]),
    "## Skills",
    ...disciplines.map(item => item.title + ": " + item.skills.join(", ")),
    "",
    "## Education",
    "Bachelor of Computer Applications",
    "Chhatrapati Shivaji Maharaj University, Navi Mumbai · 2023–2026",
  ].join("\n");
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setStatus("Résumé copied as Markdown."); }
    catch { setStatus("Copy is unavailable. Use Download text, or select the résumé on this page."); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = "Rahul-Kalagadda-Resume.md"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Résumé text download prepared.");
  };
  return <div className="resume-actions"><div className="action-row"><button className="pill-button button-primary" onClick={() => window.print()}><Printer size={16} />Print / Save PDF</button><button className="pill-button button-outline" onClick={download}><Download size={16} />Download text</button><button className="icon-button" onClick={copy} aria-label="Copy résumé as Markdown"><Copy size={17} /></button></div><p role="status">{status}</p></div>;
}
