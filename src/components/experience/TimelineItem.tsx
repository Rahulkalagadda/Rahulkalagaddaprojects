"use client";

import React, { useState } from "react";
import { MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { ExperienceItem as ExperienceType } from "@/data/experience";
import { TechBadge } from "../ui/TechBadge";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  item: ExperienceType;
  isFirst: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ item, isFirst }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(item.isCurrent || isFirst);

  return (
    <div className="relative pl-7 sm:pl-9 pb-8 group last:pb-1">
      {/* Glowing Circular Node Marker */}
      <div
        className={cn(
          "absolute left-[-5px] top-2 w-3 h-3 rounded-full border-2 transition-all duration-200 z-10",
          item.isCurrent
            ? "bg-amber border-amber shadow-[0_0_8px_rgba(242,166,35,0.4)]"
            : "bg-surface border-muted group-hover:border-amber"
        )}
      />

      {/* Main Experience Card */}
      <div
        className={cn(
          "rounded-2xl p-5 sm:p-6 transition-all duration-200 border",
          item.isCurrent
            ? "bg-surface/80 border-amber/40 shadow-sm"
            : "bg-surface/40 border-hairline hover:border-hairline-hover hover:bg-surface/60"
        )}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-bold text-foreground">
                {item.role}
              </span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-medium",
                    item.isCurrent
                      ? "bg-amber/10 text-amber border-amber/30"
                      : "bg-surface-subtle text-muted border-hairline"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-mono text-muted">
              <span className="text-foreground/90 font-medium">
                {item.company}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-dark" />
                {item.location}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 text-amber">
                <Calendar className="w-3 h-3" />
                {item.period}
              </span>
            </div>
          </div>

          {/* Metric Pill & Expand Toggle */}
          <div className="flex items-center gap-2 pt-1 sm:pt-0">
            {item.highlightMetric && (
              <div className="px-3 py-1 rounded-full bg-amber/10 border border-amber/30 text-amber font-mono text-[11px] font-bold whitespace-nowrap">
                {item.highlightMetric}
              </div>
            )}
            {!item.isCurrent && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-full hover:bg-surface-subtle text-muted hover:text-foreground text-xs font-mono transition-colors"
                aria-label={isExpanded ? "Collapse role" : "Expand role"}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs sm:text-sm text-foreground/80 mt-2.5 leading-relaxed font-sans">
          {item.summary}
        </p>

        {/* Detailed Bullets (Visible when expanded or current) */}
        {isExpanded && (
          <div className="mt-3.5 pt-3.5 border-t border-hairline/60 space-y-3 animate-in fade-in duration-150">
            <ul className="space-y-2 text-xs text-foreground/90 leading-relaxed list-disc pl-4 marker:text-amber font-sans">
              {item.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>

            {/* Skills Used */}
            <div className="pt-2 flex flex-wrap gap-1 items-center">
              {item.skillsUsed.map((sk) => (
                <TechBadge key={sk} label={sk} variant="outline" size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
