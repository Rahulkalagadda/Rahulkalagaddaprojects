"use client";

import React, { useState } from "react";
import { FolderGit2, Terminal, Layers, Globe, Sparkles } from "lucide-react";
import { projectsData } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { DeploymentsGallery } from "./DeploymentsGallery";
import { LivePipelineSimulator } from "../interactive/LivePipelineSimulator";
import { TechBadge } from "../ui/TechBadge";

export const ProjectsSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filters = [
    { id: "all", label: "All Deep Dives (3)" },
    { id: "rag", label: "LLM & RAG Systems" },
    { id: "healthcare", label: "Healthcare & OCR" },
    { id: "clinical", label: "Deterministic & SDT" },
  ];

  const filteredProjects = projectsData.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "rag") return p.id === "datastraw-cx" || p.id === "sevasetu";
    if (selectedFilter === "healthcare") return p.id === "sevasetu";
    if (selectedFilter === "clinical") return p.id === "cognitive-assessment";
    return true;
  });

  return (
    <section id="projects" className="py-16 md:py-24 border-b border-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E1E1E] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>PRODUCTION_CASE_STUDIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
              Featured AI Systems
            </h2>
            <p className="text-sm text-muted max-w-2xl font-sans">
              Architecting mission-critical AI products with deterministic guardrails,
              low-latency hybrid vector retrieval, and zero-trust multi-tenancy.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-1.5 pt-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  selectedFilter === f.id
                    ? "bg-amber text-[#0A0A0A] font-medium border-amber"
                    : "bg-[#141414] text-muted border-[#222222] hover:border-[#333333] hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Case Studies List */}
        <div className="space-y-12">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>

        {/* Interactive AI Systems & RAG Simulator (Engaging Curiosity Sandbox) */}
        <LivePipelineSimulator />

        {/* 11 Live Client Deployments & SaaS Systems Gallery */}
        <DeploymentsGallery />
      </div>
    </section>
  );
};
