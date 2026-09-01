"use client";

import React from "react";
import { GraduationCap, Award, BookOpen, Trophy } from "lucide-react";
import { educationData, achievementsData } from "@/data/education";

export const EducationAchievements: React.FC = () => {
  return (
    <section id="education" className="py-16 md:py-24 border-b border-[#1E1E1E]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="border-b border-[#1E1E1E] pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ACADEMIC_FOUNDATION_&_HONORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Education & Achievements
          </h2>
          <p className="text-sm text-muted max-w-2xl">
            Formal computer science education coupled with national hackathon recognition and extensive open-source engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Education Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber border-b border-[#1E1E1E] pb-2">
              <BookOpen className="w-4 h-4" />
              <span>Formal Education</span>
            </div>

            <div className="space-y-4">
              {educationData.map((edu, idx) => (
                <div
                  key={idx}
                  className="border border-[#1E1E1E] rounded-lg bg-[#0E0E0E] p-5 space-y-2 hover:border-[#2C2C2C] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-sm font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber px-2 py-0.5 rounded bg-amber/10 border border-amber/30 shrink-0">
                      {edu.scoreHighlight}
                    </span>
                  </div>
                  <div className="text-xs text-muted font-sans">
                    {edu.institution}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-dark pt-1 border-t border-[#181818]">
                    <span>{edu.location}</span>
                    <span>{edu.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber border-b border-[#1E1E1E] pb-2">
              <Trophy className="w-4 h-4" />
              <span>Hackathons & Key Milestones</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievementsData.map((ach, idx) => (
                <div
                  key={idx}
                  className="border border-[#1E1E1E] rounded-lg bg-[#0E0E0E] p-5 space-y-2.5 hover:border-[#2C2C2C] transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#161616] border border-[#242424] text-amber">
                        {ach.tag}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-mono font-bold text-foreground leading-snug">
                      {ach.title}
                    </h4>
                    <p className="text-[11px] font-mono text-muted-dark">
                      {ach.subtitle}
                    </p>
                    <p className="text-xs text-muted leading-relaxed font-sans">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
