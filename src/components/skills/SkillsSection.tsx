"use client";

import React, { useState } from "react";
import { Cpu, Cloud, Network, LayoutGrid } from "lucide-react";
import { InteractiveSkillCloud } from "./InteractiveSkillCloud";
import { InteractiveNodeGraph } from "./InteractiveNodeGraph";
import { SkillsMatrix } from "./SkillsMatrix";
import { cn } from "@/lib/utils";

export const SkillsSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<"cloud" | "graph" | "matrix">("cloud");

  return (
    <section id="skills" className="py-16 md:py-24 border-b border-hairline/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline/50 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber">
              <Cpu className="w-3.5 h-3.5" />
              <span>SKILLS_&_CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
              Interactive Skill Cloud
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-xl font-sans">
              Interact with the 3D rotating skill sphere, cluster clouds, and production engineering verification.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-full border border-hairline bg-surface">
            <button
              onClick={() => setViewMode("cloud")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono transition-all",
                viewMode === "cloud"
                  ? "bg-amber text-[#0A0A0A] font-bold shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>3D Cloud</span>
            </button>
            <button
              onClick={() => setViewMode("graph")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono transition-all",
                viewMode === "graph"
                  ? "bg-amber text-[#0A0A0A] font-bold shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Graph</span>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono transition-all",
                viewMode === "matrix"
                  ? "bg-amber text-[#0A0A0A] font-bold shadow-sm"
                  : "text-muted hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Matrix</span>
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === "cloud" && <InteractiveSkillCloud />}
        {viewMode === "graph" && <InteractiveNodeGraph />}
        {viewMode === "matrix" && <SkillsMatrix />}
      </div>
    </section>
  );
};
