"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Github,
  Globe,
  Search,
  ArrowUpRight,
} from "lucide-react";
import { clientDeploymentsData } from "@/data/projects";
import { TechBadge } from "../ui/TechBadge";
import { cn } from "@/lib/utils";

export const DeploymentsGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Deployments (11)" },
    { id: "SaaS & CRM", label: "SaaS & CRM" },
    { id: "E-Commerce", label: "E-Commerce" },
    { id: "Creative & GSAP", label: "Creative & GSAP" },
    { id: "Enterprise & Travel", label: "Enterprise & Travel" },
  ];

  const filteredDeployments = clientDeploymentsData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pt-12 border-t border-hairline/60">
      {/* Gallery Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-hairline/50 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-amber font-semibold">
            <Globe className="w-3.5 h-3.5" />
            <span>DEPLOYED_CLIENT_SYSTEMS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
            Production Deployments Archive
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-xl font-sans">
            11 live SaaS products, enterprise applications, and interactive web tools shipped to production.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deployments..."
            className="w-full bg-surface-subtle border border-hairline focus:border-amber rounded-full pl-9 pr-3.5 py-1.5 text-xs font-mono text-foreground placeholder:text-muted/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-3.5 py-1 rounded-full text-xs font-mono transition-all",
              selectedCategory === cat.id
                ? "bg-amber text-[#0A0A0A] font-bold shadow-sm"
                : "bg-surface-subtle text-muted hover:text-foreground border border-hairline"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Deployments Streamlined Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {filteredDeployments.map((deployment) => (
          <div
            key={deployment.id}
            className="rounded-xl bg-surface/60 border border-hairline/70 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 transition-all duration-200 hover:border-hairline-hover hover:-translate-y-0.5 hover:shadow-md group"
          >
            <div className="space-y-2.5">
              {/* Card Meta & Status */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-surface-subtle border border-hairline text-muted">
                  {deployment.category}
                </span>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>

              {/* Title & Domain */}
              <div className="space-y-0.5">
                <h4 className="text-base font-bold font-mono text-foreground group-hover:text-amber transition-colors flex items-center justify-between">
                  <span>{deployment.name}</span>
                  <a
                    href={deployment.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-amber"
                    title="Open Live App"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </h4>
                <p className="text-[11px] font-mono text-muted-dark leading-tight">
                  {deployment.domain}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-muted leading-relaxed font-sans line-clamp-2">
                {deployment.description}
              </p>
            </div>

            {/* Bottom Actions & Tech Tags */}
            <div className="pt-2.5 border-t border-hairline/50 space-y-2.5">
              <div className="flex flex-wrap gap-1">
                {deployment.tags.slice(0, 3).map((tag) => (
                  <TechBadge key={tag} label={tag} variant="outline" size="sm" />
                ))}
              </div>

              <div className="flex items-center justify-between pt-0.5 font-mono text-xs">
                <a
                  href={deployment.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-amber hover:underline text-[11px] font-semibold"
                >
                  <span>Visit App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {deployment.githubUrl ? (
                  <a
                    href={deployment.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted hover:text-foreground text-[11px]"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-muted-dark font-mono">
                    Client SaaS
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDeployments.length === 0 && (
        <div className="p-8 text-center text-xs font-mono text-muted rounded-xl bg-surface-subtle border border-hairline">
          No deployed systems found matching &quot;{searchQuery}&quot;.
        </div>
      )}
    </div>
  );
};
