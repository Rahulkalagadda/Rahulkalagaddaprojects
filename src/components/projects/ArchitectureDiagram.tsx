"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Radio,
  Sparkles,
  Layers,
} from "lucide-react";
import { ArchitectureNode, ArchitectureFlow } from "@/data/projects";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ArchitectureDiagramProps {
  title: string;
  description: string;
  nodes: ArchitectureNode[];
  flows: ArchitectureFlow[];
  projectId: string;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  description,
  nodes,
  flows,
  projectId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const validNodes = nodesRef.current.filter(Boolean);
      if (validNodes.length > 0 && containerRef.current) {
        gsap.fromTo(
          validNodes,
          { opacity: 0, y: 15, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, nodes]);

  const getNodeIcon = (type: ArchitectureNode["type"]) => {
    switch (type) {
      case "input":
        return <Radio className="w-3.5 h-3.5 text-blue-400" />;
      case "gateway":
        return <Server className="w-3.5 h-3.5 text-emerald-400" />;
      case "engine":
        return <Cpu className="w-3.5 h-3.5 text-amber" />;
      case "database":
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case "security":
        return <ShieldCheck className="w-3.5 h-3.5 text-amber" />;
      case "output":
        return <Sparkles className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-muted" />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="rounded-xl bg-surface-subtle/70 p-4 sm:p-5 space-y-3.5 border border-hairline/60"
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-hairline/50">
        <div className="flex items-center gap-2 font-mono text-xs text-amber font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block animate-pulse" />
          <span>ARCHITECTURE // {projectId.toUpperCase()}</span>
        </div>
        <p className="text-xs text-muted max-w-lg font-sans">
          {description}
        </p>
      </div>

      {/* Dynamic Grid Layout for Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {nodes.map((node, index) => {
          const isSelected = activeNodeId === node.id;
          return (
            <div
              key={node.id}
              ref={(el) => {
                nodesRef.current[index] = el;
              }}
              onClick={() =>
                setActiveNodeId(activeNodeId === node.id ? null : node.id)
              }
              className={cn(
                "p-3 rounded-lg border transition-all duration-150 cursor-pointer relative",
                node.highlight
                  ? "border-amber/40 bg-surface hover:border-amber"
                  : "border-hairline bg-surface/50 hover:border-hairline-hover",
                isSelected && "border-amber ring-1 ring-amber/30 scale-[1.01]"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  {getNodeIcon(node.type)}
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                    {node.type}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-dark">
                  0{index + 1}
                </span>
              </div>

              <div className="space-y-0.5">
                <div
                  className={cn(
                    "text-xs font-mono font-semibold",
                    node.highlight ? "text-amber" : "text-foreground"
                  )}
                >
                  {node.label}
                </div>
                <div className="text-[11px] text-muted leading-tight">
                  {node.sublabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sequential Flow Stream */}
      <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-muted">
        <span className="text-amber font-semibold text-[10px]">FLOW:</span>
        {flows.map((flow, i) => (
          <React.Fragment key={i}>
            <span className="text-foreground/80">{flow.from}</span>
            <span className="text-amber">→</span>
            {i === flows.length - 1 && (
              <span className="text-foreground/80">{flow.to}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
