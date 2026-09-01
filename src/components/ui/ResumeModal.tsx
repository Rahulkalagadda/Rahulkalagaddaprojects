"use client";

import React, { useEffect } from "react";
import { X, Download, Copy, Printer, Check, ExternalLink, Terminal, Globe, Github } from "lucide-react";
import { profileData } from "@/data/profile";
import { experienceData } from "@/data/experience";
import { projectsData, clientDeploymentsData } from "@/data/projects";
import { skillCategories } from "@/data/skills";
import { educationData, achievementsData } from "@/data/education";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "./Toast";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = async () => {
    const resumeMd = `# ${profileData.name}
${profileData.subheading}
Email: ${profileData.email} | Phone: ${profileData.phone}
LinkedIn: ${profileData.linkedin} | GitHub: ${profileData.github}

## EXPERIENCE
${experienceData
  .map(
    (exp) => `### ${exp.role} | ${exp.company} (${exp.period})
${exp.bullets.map((b) => `- ${b}`).join("\n")}`
  )
  .join("\n\n")}

## FEATURED AI SYSTEMS
${projectsData
  .map(
    (p) => `### ${p.name} — ${p.tagline}
Tech: ${p.tags.join(", ")}
Live: ${p.liveUrl}
Summary: ${p.summary}`
  )
  .join("\n\n")}

## PRODUCTION CLIENT DEPLOYMENTS (11 Shipped Systems)
${clientDeploymentsData
  .map(
    (d) => `- ${d.name} (${d.domain}): ${d.liveUrl} ${d.githubUrl ? `| Code: ${d.githubUrl}` : ""}`
  )
  .join("\n")}

## EDUCATION
${educationData
  .map((e) => `- ${e.degree}, ${e.institution} (${e.period}) - ${e.grade}`)
  .join("\n")}
`;
    const success = await copyToClipboard(resumeMd);
    if (success) {
      setCopied(true);
      toast("Resume copied to clipboard as Markdown!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-[#0D0D0D] border border-[#222222] rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1E1E] bg-[#111111]">
          <div className="flex items-center gap-2 font-mono text-xs text-muted">
            <Terminal className="w-4 h-4 text-amber" />
            <span className="text-foreground font-semibold">
              resume_rahul_kalagadda.pdf
            </span>
            <span className="text-muted-dark hidden sm:inline">
              | Verified Curriculum Vitae
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-[#262626] bg-[#161616] text-[#A3A3A0] hover:text-foreground hover:border-[#383838] transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-amber" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Copy Markdown</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border border-amber/40 bg-amber text-[#0A0A0A] font-semibold hover:bg-amber-hover transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-muted hover:text-foreground hover:bg-[#1E1E1E] transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Resume Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 text-foreground/90 font-sans text-sm print:p-0 print:bg-white print:text-black">
          {/* Resume Header */}
          <div className="border-b border-[#1E1E1E] pb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
              RAHUL KALAGADDA
            </h1>
            <p className="text-amber font-mono text-xs sm:text-sm mt-1">
              AI Engineer | LLM & RAG Systems | Backend Engineering | Full-Stack AI Products
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs font-mono text-muted">
              <span>{profileData.phone}</span>
              <span>•</span>
              <a
                href={`mailto:${profileData.email}`}
                className="hover:text-amber underline-offset-2 hover:underline"
              >
                {profileData.email}
              </a>
              <span>•</span>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber underline-offset-2 hover:underline inline-flex items-center gap-0.5"
              >
                linkedin.com/in/rahul-kalagadda
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
              <span>•</span>
              <a
                href={profileData.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-amber underline-offset-2 hover:underline inline-flex items-center gap-0.5"
              >
                github.com/Rahulkalagadda
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-amber uppercase border-b border-[#1E1E1E] pb-1">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experienceData.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="font-semibold text-foreground">
                        {exp.role}
                      </span>{" "}
                      <span className="text-muted">| {exp.company}</span>
                    </div>
                    <div className="text-xs font-mono text-muted">
                      {exp.period} | {exp.location}
                    </div>
                  </div>
                  <ul className="list-disc list-outside pl-4 space-y-1.5 text-xs text-muted leading-relaxed">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="marker:text-amber/60">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* AI Projects */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-amber uppercase border-b border-[#1E1E1E] pb-1">
              AI Projects & Production Case Studies
            </h2>
            <div className="space-y-6">
              {projectsData.map((proj) => (
                <div key={proj.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span className="font-semibold text-foreground">
                        {proj.name}
                      </span>{" "}
                      <span className="text-muted text-xs">— {proj.tagline}</span>
                    </div>
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-amber hover:underline inline-flex items-center gap-1"
                    >
                      {proj.liveUrl.replace("https://", "")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-[11px] font-mono text-muted-dark">
                    {proj.tags.join(" · ")}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {proj.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Client Deployments & Live SaaS */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-amber uppercase border-b border-[#1E1E1E] pb-1">
              Production Client SaaS & Live Deployments (11 Systems)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {clientDeploymentsData.map((dep) => (
                <div key={dep.id} className="p-2.5 rounded border border-[#1E1E1E] bg-[#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold font-mono text-foreground">{dep.name}</span>
                    <a
                      href={dep.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber hover:underline text-[10px] font-mono inline-flex items-center gap-0.5"
                    >
                      Live <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <p className="text-[11px] text-muted line-clamp-2">{dep.description}</p>
                  <div className="text-[10px] font-mono text-muted-dark flex items-center justify-between pt-0.5">
                    <span>{dep.tags.slice(0, 3).join(" · ")}</span>
                    {dep.githubUrl && (
                      <a href={dep.githubUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-foreground">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="text-xs font-mono font-semibold tracking-wider text-amber uppercase border-b border-[#1E1E1E] pb-1">
                Education
              </h2>
              {educationData.map((edu, i) => (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="font-semibold text-foreground">{edu.degree}</div>
                  <div className="text-muted">{edu.institution}</div>
                  <div className="font-mono text-[11px] text-amber">
                    {edu.period} · {edu.grade}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-mono font-semibold tracking-wider text-amber uppercase border-b border-[#1E1E1E] pb-1">
                Achievements
              </h2>
              {achievementsData.slice(0, 3).map((ach, i) => (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="font-semibold text-foreground">{ach.title}</div>
                  <p className="text-[11px] text-muted leading-snug">
                    {ach.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-semibold tracking-wider text-amber uppercase border-b border-[#1E1E1E] pb-1">
              Technical Skills Matrix
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {skillCategories.map((cat) => (
                <div key={cat.id} className="space-y-0.5">
                  <span className="font-mono font-semibold text-foreground/80">
                    {cat.name}:
                  </span>{" "}
                  <span className="text-muted font-mono text-[11px]">
                    {cat.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-[#1E1E1E] bg-[#111111] flex items-center justify-between text-xs font-mono text-muted">
          <span>Press ESC or click outside to dismiss</span>
          <span className="text-amber">Rahul Kalagadda · Portfolio 2026</span>
        </div>
      </div>
    </div>
  );
};
