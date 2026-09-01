"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Brain,
  Database,
  Server,
  Layout,
  Wrench,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  Activity,
  Maximize2,
  Info,
} from "lucide-react";
import { skillCategories, SkillCategory } from "@/data/skills";
import { useTheme } from "../theme/ThemeProvider";
import { cn } from "@/lib/utils";

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  type: "center" | "category" | "leaf";
  categoryId?: string;
  categoryName?: string;
  icon?: React.ReactNode;
  skillDetail?: string;
}

interface GraphEdge {
  from: GraphNode;
  to: GraphNode;
  categoryId: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "ai-systems": <Brain className="w-3.5 h-3.5" />,
  "databases": <Database className="w-3.5 h-3.5" />,
  "backend": <Server className="w-3.5 h-3.5" />,
  "frontend": <Layout className="w-3.5 h-3.5" />,
  "devops": <Wrench className="w-3.5 h-3.5" />,
};

const SKILL_DETAILS: Record<string, string> = {
  "RAG Systems": "Engineered hybrid vector search + metadata filtering across Qdrant & FAISS.",
  "LangChain": "Chaining deterministic routing, output parsers, and custom policy guardrails.",
  "Groq LLaMA 3.3": "High-throughput streaming LLM inference with deterministic fallback prompts.",
  "FAISS": "Local clinical embedding index with <45ms cosine similarity lookup.",
  "Tesseract OCR": "Automated medical slip & bill extraction with vernacular preprocessing.",
  "Qdrant": "Hybrid sparse + dense vector embeddings with multi-tenant payload isolation.",
  "Supabase / PGVector": "PostgreSQL with row-level security (RLS) ensuring strict multi-tenant privacy.",
  "PostgreSQL": "Relational data modeling, ACID transactions, and sub-10ms indexed queries.",
  "Redis": "In-memory caching, token rate limiters, and real-time session stores.",
  "FastAPI": "High-concurrency async Python endpoints with Pydantic deterministic validation.",
  "Next.js App Router": "Server components, streaming SSR, and edge API route integration.",
  "Python": "Asyncio, NumPy psychometrics, Signal Detection Theory scoring models.",
  "TypeScript": "End-to-end type safety across API schemas, components, and telemetry payloads.",
  "Node.js": "Event-driven microservices, background queues, and webhook ingestion.",
  "Tailwind CSS": "Custom design tokens, hairline developer styling, and fluid responsive layouts.",
  "Three.js": "Custom WebGL particle graph simulations with cursor proximity physics.",
  "GSAP": "ScrollTrigger timeline animations, kinetic text, and coordinated micro-reveals.",
  "React": "State machines, custom hooks, and 11 neuropsychological testing engines.",
  "Docker": "Containerized microservices with multi-stage minimal runtime builds.",
  "Vercel": "Edge deployments, preview environments, and global CDN delivery.",
  "Git & GitHub": "CI/CD automated testing pipelines, branching workflows, and repo releases.",
};

export const InteractiveNodeGraph: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>("RAG Systems");
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Compute graph coordinates (viewBox 940 x 600)
  const { nodes, edges } = useMemo(() => {
    const centerX = 470;
    const centerY = 300;
    const catDistance = 160;
    const leafDistance = 95;

    const centerNode: GraphNode = {
      id: "center-rahul",
      label: "RAHUL // CORE",
      x: centerX,
      y: centerY,
      r: 36,
      type: "center",
      skillDetail: "Full-Stack AI Systems Architecture, Deterministic Guardrails & High-Throughput Backends.",
    };

    const allNodes: GraphNode[] = [centerNode];
    const allEdges: GraphEdge[] = [];

    const categoriesCount = skillCategories.length;

    skillCategories.forEach((cat, i) => {
      // Angle for category node (starting top-center)
      const angle = (i * 2 * Math.PI) / categoriesCount - Math.PI / 2;
      const catX = centerX + Math.cos(angle) * catDistance;
      const catY = centerY + Math.sin(angle) * catDistance;

      const catNode: GraphNode = {
        id: `cat-${cat.id}`,
        label: cat.shortName,
        x: catX,
        y: catY,
        r: 26,
        type: "category",
        categoryId: cat.id,
        categoryName: cat.name,
        icon: CATEGORY_ICONS[cat.id] || <Layers className="w-3.5 h-3.5" />,
        skillDetail: cat.description,
      };

      allNodes.push(catNode);
      allEdges.push({
        from: centerNode,
        to: catNode,
        categoryId: cat.id,
      });

      // Top 4 skills per category
      const topSkills = cat.skills.slice(0, 4);
      const leafCount = topSkills.length;
      const spreadAngle = 0.95; // fan out

      topSkills.forEach((skill, j) => {
        const leafAngle =
          angle - spreadAngle / 2 + (j / (leafCount - 1 || 1)) * spreadAngle;
        const leafX = catX + Math.cos(leafAngle) * leafDistance;
        const leafY = catY + Math.sin(leafAngle) * leafDistance;

        const leafNode: GraphNode = {
          id: `leaf-${cat.id}-${j}`,
          label: skill,
          x: leafX,
          y: leafY,
          r: 18,
          type: "leaf",
          categoryId: cat.id,
          categoryName: cat.name,
          skillDetail:
            SKILL_DETAILS[skill] ||
            `Core competency in ${cat.name} utilized across Rahul's production deployments.`,
        };

        allNodes.push(leafNode);
        allEdges.push({
          from: catNode,
          to: leafNode,
          categoryId: cat.id,
        });
      });
    });

    return { nodes: allNodes, edges: allEdges };
  }, []);

  const currentDisplayNode =
    hoveredNode ||
    nodes.find((n) => n.label === selectedSkill) ||
    nodes.find((n) => n.id === "center-rahul");

  return (
    <div className="rounded-2xl bg-surface/50 border border-hairline p-5 sm:p-7 space-y-5 relative overflow-hidden">
      {/* Header bar with Category Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline/60 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategoryId(null)}
            className={cn(
              "px-3.5 py-1 rounded-full text-xs font-mono transition-all border",
              activeCategoryId === null
                ? "bg-amber text-[#0A0A0A] font-bold border-amber shadow-sm"
                : "bg-surface text-muted border-hairline hover:text-foreground hover:border-hairline-hover"
            )}
          >
            All Clusters
          </button>
          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() =>
                setActiveCategoryId(
                  activeCategoryId === cat.id ? null : cat.id
                )
              }
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono transition-all border flex items-center gap-1.5",
                activeCategoryId === cat.id
                  ? "bg-amber text-[#0A0A0A] font-bold border-amber shadow-sm"
                  : "bg-surface text-muted border-hairline hover:text-foreground hover:border-hairline-hover"
              )}
            >
              <span className="opacity-80">{CATEGORY_ICONS[cat.id]}</span>
              <span>{cat.shortName}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-dark">
          <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
          <span>Interactive Topology Graph</span>
        </div>
      </div>

      {/* Interactive SVG Topology Mesh */}
      <div className="w-full h-[380px] sm:h-[480px] flex items-center justify-center relative select-none">
        <svg
          viewBox="0 0 940 600"
          className="w-full h-full max-h-[500px] overflow-visible"
        >
          <defs>
            {/* Center Radar Pulsing Glow */}
            <radialGradient id="centerPulse" cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={isLight ? "#D97706" : "#F2A623"}
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor={isLight ? "#D97706" : "#F2A623"}
                stopOpacity="0"
              />
            </radialGradient>

            {/* Glowing Laser Filter */}
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Radar background rings */}
          <circle
            cx="470"
            cy="300"
            r="160"
            fill="none"
            stroke={isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"}
            strokeDasharray="4 4"
          />
          <circle
            cx="470"
            cy="300"
            r="255"
            fill="none"
            stroke={isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)"}
            strokeDasharray="6 6"
          />

          {/* Animated Connecting Edges */}
          <g className="edges">
            {edges.map((edge, i) => {
              const isHighlight =
                activeCategoryId === null ||
                activeCategoryId === edge.categoryId;

              const strokeColor = isHighlight
                ? isLight
                  ? "#D97706"
                  : "#F2A623"
                : isLight
                ? "#E2E8F0"
                : "#1E1E1E";

              return (
                <line
                  key={i}
                  x1={edge.from.x}
                  y1={edge.from.y}
                  x2={edge.to.x}
                  y2={edge.to.y}
                  stroke={strokeColor}
                  strokeWidth={
                    isHighlight
                      ? edge.from.type === "center"
                        ? 2.2
                        : 1.4
                      : 1
                  }
                  strokeDasharray={
                    isHighlight && edge.from.type === "center" ? "none" : "3 3"
                  }
                  opacity={isHighlight ? (activeCategoryId ? 0.9 : 0.5) : 0.15}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isCenter = node.type === "center";
              const isCategory = node.type === "category";
              const isLeaf = node.type === "leaf";

              const isHighlight =
                activeCategoryId === null ||
                isCenter ||
                activeCategoryId === node.categoryId;

              const isSelected =
                selectedSkill === node.label || hoveredNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={cn(
                    "transition-all duration-200 cursor-pointer",
                    !isHighlight && "opacity-25"
                  )}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => {
                    setSelectedSkill(node.label);
                    if (node.categoryId) {
                      setActiveCategoryId(node.categoryId);
                    }
                  }}
                >
                  {/* Radar pulse for Center */}
                  {isCenter && (
                    <circle
                      r={node.r * 1.8}
                      fill="url(#centerPulse)"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle Surface */}
                  <circle
                    r={node.r}
                    fill={
                      isCenter
                        ? isLight
                          ? "#D97706"
                          : "#F2A623"
                        : isCategory
                        ? activeCategoryId === node.categoryId
                          ? isLight
                            ? "#D97706"
                            : "#F2A623"
                          : isLight
                          ? "#FFFFFF"
                          : "#161616"
                        : isSelected
                        ? isLight
                          ? "#FEF3C7"
                          : "#262012"
                        : isLight
                        ? "#F8FAFC"
                        : "#101010"
                    }
                    stroke={
                      isCenter
                        ? isLight
                          ? "#B45309"
                          : "#F2A623"
                        : isCategory
                        ? activeCategoryId === node.categoryId
                          ? isLight
                            ? "#D97706"
                            : "#F2A623"
                          : isLight
                          ? "#CBD5E1"
                          : "#2A2A2A"
                        : isSelected
                        ? isLight
                          ? "#D97706"
                          : "#F2A623"
                        : isLight
                        ? "#E2E8F0"
                        : "#202020"
                    }
                    strokeWidth={
                      isCenter || isSelected || (isCategory && activeCategoryId === node.categoryId)
                        ? 2
                        : 1
                    }
                    className="transition-all duration-150"
                  />

                  {/* Node Typography */}
                  {isCenter ? (
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.label}
                    </text>
                  ) : isCategory ? (
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fill={
                        activeCategoryId === node.categoryId
                          ? isLight
                            ? "#FFFFFF"
                            : "#0A0A0A"
                          : isLight
                          ? "#0F172A"
                          : "#F5F5F0"
                      }
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.label}
                    </text>
                  ) : (
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fill={
                        isSelected
                          ? isLight
                            ? "#92400E"
                            : "#F2A623"
                          : isHighlight
                          ? isLight
                            ? "#334155"
                            : "#A3A3A0"
                          : isLight
                          ? "#94A3B8"
                          : "#555555"
                      }
                      fontSize="8"
                      fontWeight={isSelected ? "bold" : "normal"}
                      fontFamily="monospace"
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Dynamic Floating Skill Spotlight Card */}
      {currentDisplayNode && (
        <div className="p-4 rounded-xl bg-surface border border-hairline/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber/10 border border-amber/30 text-amber font-mono text-[10px] font-bold">
                {currentDisplayNode.categoryName || "Core Engineering"}
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                {currentDisplayNode.label}
              </span>
            </div>
            <p className="text-xs text-muted font-sans leading-relaxed">
              {currentDisplayNode.skillDetail}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-1 rounded-lg bg-surface-subtle font-mono text-[11px] text-muted">
              <span className="text-emerald-500 font-bold mr-1">●</span>
              <span>Production Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
