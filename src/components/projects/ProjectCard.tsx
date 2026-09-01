"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ProjectCaseStudy } from "@/data/projects";
import { TechBadge } from "../ui/TechBadge";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectCaseStudy;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);

  return (
    <article
      id={`project-${project.id}`}
      className="rounded-2xl bg-surface/40 border border-hairline p-6 sm:p-8 space-y-6 transition-all duration-200 hover:border-hairline-hover hover:bg-surface/60"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="text-amber font-bold">SYSTEM_0{index + 1}</span>
            <span>·</span>
            <span className="text-muted-dark font-medium">{project.domain}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
            {project.name}
          </h3>
          <p className="text-sm text-muted font-normal pt-0.5">
            {project.tagline}
          </p>
        </div>

        {/* Live Link Button */}
        <div className="shrink-0 pt-1">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber/10 border border-amber/30 text-amber font-mono text-xs font-semibold hover:bg-amber hover:text-[#0A0A0A] transition-all hover:scale-105"
          >
            <span>Live Demo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Tech Badges */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <TechBadge key={tag} label={tag} variant="default" size="sm" />
        ))}
      </div>

      {/* Metric Highlight Chips (Clean, floating, non-boxy) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {project.stats.map((st, i) => (
          <div
            key={i}
            className="px-4 py-3 rounded-xl bg-surface-subtle/80 border border-hairline/60 font-mono space-y-0.5"
          >
            <div className="text-lg sm:text-xl font-bold text-amber tracking-tight">
              {st.value}
            </div>
            <div className="text-[11px] text-muted font-sans leading-tight">
              {st.label}
            </div>
          </div>
        ))}
      </div>

      {/* Executive Highlight */}
      <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans border-l-2 border-amber pl-3.5 py-0.5">
        {project.summary}
      </p>

      {/* Architecture Diagram Visualization */}
      <ArchitectureDiagram
        title={project.architecture.title}
        description={project.architecture.description}
        nodes={project.architecture.nodes}
        flows={project.architecture.flows}
        projectId={project.id}
      />

      {/* Expandable Engineering Deep Dive (Clean Drawer) */}
      <div className="pt-2">
        <button
          onClick={() => setIsDeepDiveOpen(!isDeepDiveOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-subtle/50 hover:bg-surface-subtle border border-hairline/60 text-xs font-mono text-muted hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber" />
            <span>
              {isDeepDiveOpen
                ? "Hide Implementation Breakdown"
                : "View Key Engineering & Guardrail Decisions"}
            </span>
          </div>
          {isDeepDiveOpen ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>

        {isDeepDiveOpen && (
          <div className="mt-3 p-5 rounded-xl bg-surface-subtle/80 border border-hairline space-y-4 animate-in fade-in duration-150 text-xs">
            {/* Key Accomplishments */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber">
                Core Systems Engineering:
              </span>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-amber text-foreground/90 font-sans leading-relaxed">
                {project.whatIBuilt.flatMap((g) => g.items).slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Architecture Decisions */}
            <div className="space-y-2 pt-2 border-t border-hairline/60">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber">
                Deterministic Decision Safeguards:
              </span>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-amber text-foreground/90 font-sans leading-relaxed">
                {project.approach.keyDecisions.slice(0, 3).map((dec, idx) => (
                  <li key={idx}>{dec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
