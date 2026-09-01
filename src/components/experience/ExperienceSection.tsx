"use client";

import React from "react";
import { Briefcase, Terminal } from "lucide-react";
import { experienceData } from "@/data/experience";
import { TimelineItem } from "./TimelineItem";

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 border-b border-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1E1E1E] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CAREER_TRAJECTORY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
              Work Experience
            </h2>
            <p className="text-sm text-muted max-w-2xl">
              Proven track record in driving AI systems engineering, managing agile intern teams,
              and delivering 10+ high-impact client products.
            </p>
          </div>

          <div className="text-xs font-mono text-muted-dark shrink-0">
            <span>May 2026 — Nov 2024</span>
          </div>
        </div>

        {/* Timeline Container with vertical amber line */}
        <div className="relative border-l border-amber/30 ml-2 sm:ml-4 pl-0 space-y-0">
          {experienceData.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              isFirst={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
