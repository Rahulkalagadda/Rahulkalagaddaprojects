"use client";

import React from "react";
import { skillCategories } from "@/data/skills";
import { TechBadge } from "../ui/TechBadge";

export const SkillsMatrix: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skillCategories.map((category) => (
        <div
          key={category.id}
          className="border border-[#1E1E1E] rounded-lg bg-[#0E0E0E] p-5 space-y-4 hover:border-[#2C2C2C] transition-colors"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber">
                {category.shortName}
              </span>
              <span className="text-[10px] font-mono text-muted-dark">
                {category.skills.length} skills
              </span>
            </div>
            <h4 className="text-sm font-semibold text-foreground">
              {category.name}
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              {category.description}
            </p>
          </div>

          <div className="pt-2 border-t border-[#1A1A1A] flex flex-wrap gap-1.5">
            {category.skills.map((skill) => (
              <TechBadge key={skill} label={skill} variant="default" size="sm" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
