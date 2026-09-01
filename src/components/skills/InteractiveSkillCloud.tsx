"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Brain,
  Database,
  Server,
  Layout,
  Wrench,
  Sparkles,
  Zap,
  Globe,
  CheckCircle2,
  Maximize2,
  Cloud,
  Rotate3d,
} from "lucide-react";
import { skillCategories, SkillCategory } from "@/data/skills";
import { useTheme } from "../theme/ThemeProvider";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface SkillItem {
  name: string;
  category: string;
  categoryId: string;
  icon: React.ReactNode;
  level: "Mastery" | "Advanced" | "Proficient";
  detail: string;
  projectUse: string;
}

const ALL_SKILLS: SkillItem[] = [
  // AI & RAG
  {
    name: "RAG Architectures",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Brain className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Hybrid dense + sparse retrieval, multi-tenant vector partitioning, and reranking pipelines.",
    projectUse: "Datastraw CX & SevaSetu Health AI",
  },
  {
    name: "Deterministic Guardrails",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Zap className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Zero-hallucination deterministic escalation engines and strict JSON schema validation.",
    projectUse: "Datastraw CX Policy Engine",
  },
  {
    name: "LangChain",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Brain className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "Composable chains, output parsers, fallback strategies, and retrieval augmentation.",
    projectUse: "SevaSetu & Datastraw CX",
  },
  {
    name: "Groq LLaMA 3.3",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Sparkles className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Sub-second streaming token inference, low-latency reasoning, and prompt engineering.",
    projectUse: "Core LLM Inference across all platforms",
  },
  {
    name: "FAISS",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Database className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "High-density local clinical vector index with <45ms cosine similarity nearest neighbor search.",
    projectUse: "SevaSetu Medical Triage",
  },
  {
    name: "Tesseract OCR",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Brain className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "Automated medical slip, bill, and laboratory report text extraction with vernacular parsing.",
    projectUse: "SevaSetu Lab Slip Parser",
  },

  // Databases & Vector
  {
    name: "Qdrant",
    category: "Databases",
    categoryId: "databases",
    icon: <Database className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "High-performance vector database with payload-based multi-tenant security filters.",
    projectUse: "Datastraw CX Knowledge Store",
  },
  {
    name: "Supabase PGVector",
    category: "Databases",
    categoryId: "databases",
    icon: <Database className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "PostgreSQL with row-level security (RLS) guaranteeing strict tenant data isolation.",
    projectUse: "Datastraw CX & Web CRM",
  },
  {
    name: "PostgreSQL",
    category: "Databases",
    categoryId: "databases",
    icon: <Database className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "ACID transactions, relational schema design, indexed query optimization, and connection pooling.",
    projectUse: "EstateFlow CRM & Mitticool",
  },
  {
    name: "Redis",
    category: "Databases",
    categoryId: "databases",
    icon: <Zap className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "Distributed token bucket rate-limiting, session state stores, and low-latency cache layers.",
    projectUse: "API Rate Limiter & Chat Caches",
  },

  // Backend & Systems
  {
    name: "FastAPI",
    category: "Backend",
    categoryId: "backend",
    icon: <Server className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Asynchronous Python RESTful APIs, Pydantic type validation, and OpenAPI documentation.",
    projectUse: "AI Gateway & Policy Microservices",
  },
  {
    name: "Python",
    category: "Backend",
    categoryId: "backend",
    icon: <Server className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Asyncio, NumPy psychometrics, Signal Detection Theory mathematical modeling.",
    projectUse: "Cognitive Assessment Platform & AI Engine",
  },
  {
    name: "Next.js App Router",
    category: "Backend",
    categoryId: "backend",
    icon: <Server className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "React Server Components, edge API routes, streaming SSR, and Next.js 14 architecture.",
    projectUse: "11+ Production Web Deployments",
  },
  {
    name: "TypeScript",
    category: "Backend",
    categoryId: "backend",
    icon: <Server className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Strict end-to-end typing, robust interface schemas, and resilient client architectures.",
    projectUse: "Full-Stack Development Stack",
  },
  {
    name: "Node.js",
    category: "Backend",
    categoryId: "backend",
    icon: <Server className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "Event-driven asynchronous microservices, background job queues, and webhook dispatchers.",
    projectUse: "Web CRM & Backend Services",
  },

  // Frontend & 3D
  {
    name: "Three.js",
    category: "Frontend",
    categoryId: "frontend",
    icon: <Layout className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "WebGL particle networks, 3D buffer geometry calculations, and cursor proximity reactions.",
    projectUse: "Hero Interactive Particle Canvas & Portfolio",
  },
  {
    name: "GSAP & ScrollTrigger",
    category: "Frontend",
    categoryId: "frontend",
    icon: <Layout className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "ScrollTrigger kinetic animations, continuous timelines, and responsive micro-interactions.",
    projectUse: "GSAP Cocktails & Architecture Reveal Flows",
  },
  {
    name: "React",
    category: "Frontend",
    categoryId: "frontend",
    icon: <Layout className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "State machines, custom hooks, and 11 millisecond-precision neuropsychological testing tasks.",
    projectUse: "Cognitive Assessment & SaaS Storefronts",
  },
  {
    name: "Tailwind CSS",
    category: "Frontend",
    categoryId: "frontend",
    icon: <Layout className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Custom design systems, CSS variables, dark/light synchronizations, and mobile responsive layouts.",
    projectUse: "Design System Architecture",
  },

  // DevOps & Cloud
  {
    name: "Docker",
    category: "DevOps",
    categoryId: "devops",
    icon: <Wrench className="w-3.5 h-3.5" />,
    level: "Advanced",
    detail: "Multi-stage container builds, minimal runtime images, and isolated local development environments.",
    projectUse: "Microservice Containerization",
  },
  {
    name: "Vercel",
    category: "DevOps",
    categoryId: "devops",
    icon: <Globe className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Production edge deployments, automated CI/CD branch previews, and global serverless functions.",
    projectUse: "All 11 Production Client Systems",
  },
  {
    name: "Git & GitHub",
    category: "DevOps",
    categoryId: "devops",
    icon: <Wrench className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Version control, automated GitHub Actions CI/CD workflows, pull request reviews, and releases.",
    projectUse: "Source Code Management",
  },
  {
    name: "Signal Detection Theory (SDT)",
    category: "AI Systems",
    categoryId: "ai-systems",
    icon: <Brain className="w-3.5 h-3.5" />,
    level: "Mastery",
    detail: "Mathematical quantification of perceptual sensitivity (d') and response bias (c) in clinical tasks.",
    projectUse: "Cognitive Assessment Platform",
  },
];

export const InteractiveSkillCloud: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedSkill, setSelectedSkill] = useState<SkillItem>(ALL_SKILLS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Filter skills based on selected category
  const filteredSkills = useMemo(() => {
    if (activeCategory === "all") return ALL_SKILLS;
    return ALL_SKILLS.filter((s) => s.categoryId === activeCategory);
  }, [activeCategory]);

  // 3D Sphere Tag Cloud Math
  const [tagsState, setTagsState] = useState<
    Array<{
      skill: SkillItem;
      x: number;
      y: number;
      z: number;
      scale: number;
      alpha: number;
    }>
  >([]);

  const rotationRef = useRef({ rx: 0.003, ry: 0.005 });
  const mouseRef = useRef({ x: 0, y: 0 });

  // Initialize 3D Spherical positions
  useEffect(() => {
    const count = filteredSkills.length;
    const radius = 175;

    const initialTags = filteredSkills.map((skill, i) => {
      // Golden Spiral distribution on sphere surface
      const phi = Math.acos(-1 + (2 * i + 1) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      return {
        skill,
        x,
        y,
        z,
        scale: 1,
        alpha: 1,
      };
    });

    setTagsState(initialTags);
  }, [filteredSkills]);

  // Animation Loop for 3D Sphere Rotation
  useEffect(() => {
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isRotating) return;

      const sinX = Math.sin(rotationRef.current.rx);
      const cosX = Math.cos(rotationRef.current.rx);
      const sinY = Math.sin(rotationRef.current.ry);
      const cosY = Math.cos(rotationRef.current.ry);

      setTagsState((prevTags) =>
        prevTags.map((tag) => {
          // Rotate around Y axis
          const x1 = tag.x * cosY - tag.z * sinY;
          const z1 = tag.z * cosY + tag.x * sinY;

          // Rotate around X axis
          const y1 = tag.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + tag.y * sinX;

          const radius = 180;
          // Scale based on Z depth (-radius to +radius)
          const scale = Math.max(0.65, (z2 + radius * 1.5) / (radius * 2.5));
          const alpha = Math.max(0.35, (z2 + radius) / (radius * 2));

          return {
            ...tag,
            x: x1,
            y: y1,
            z: z2,
            scale,
            alpha,
          };
        })
      );
    };

    animate();
    return () => cancelAnimationFrame(animId);
  }, [isRotating]);

  // Mouse interaction to steer 3D rotation speed
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);

    rotationRef.current = {
      rx: -dy * 0.008,
      ry: dx * 0.008,
    };
  };

  const handleSkillClick = (skill: SkillItem) => {
    setSelectedSkill(skill);
    triggerConfetti(0.5, 0.7);
  };

  return (
    <div className="rounded-2xl bg-surface/50 border border-hairline p-5 sm:p-7 space-y-6 relative overflow-hidden">
      {/* Top Header & Cloud Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline/60 pb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveCategory("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border flex items-center gap-1.5",
              activeCategory === "all"
                ? "bg-amber text-[#0A0A0A] font-bold border-amber shadow-sm"
                : "bg-surface text-muted border-hairline hover:text-foreground hover:border-hairline-hover"
            )}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>All Skills Cloud ({ALL_SKILLS.length})</span>
          </button>

          {skillCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-mono transition-all border flex items-center gap-1.5",
                activeCategory === cat.id
                  ? "bg-amber text-[#0A0A0A] font-bold border-amber shadow-sm"
                  : "bg-surface text-muted border-hairline hover:text-foreground hover:border-hairline-hover"
              )}
            >
              <span>{cat.shortName}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="p-1.5 px-3 rounded-full bg-surface border border-hairline text-xs font-mono text-muted hover:text-foreground flex items-center gap-1.5 transition-all"
            title="Toggle 3D Rotation"
          >
            <Rotate3d className={cn("w-3.5 h-3.5 text-amber", isRotating && "animate-spin")} />
            <span>{isRotating ? "Pause Orbit" : "Resume Orbit"}</span>
          </button>
        </div>
      </div>

      {/* 3D Interactive Floating Cloud Sphere */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full h-[380px] sm:h-[450px] relative flex items-center justify-center select-none overflow-hidden"
      >
        {/* Ambient background glow ring */}
        <div className="absolute w-72 h-72 rounded-full bg-amber/5 blur-3xl pointer-events-none" />

        {/* Central 3D Anchor Core Pill */}
        <div className="absolute z-10 pointer-events-none flex flex-col items-center justify-center p-3 rounded-full bg-surface/80 border border-amber/30 backdrop-blur-md shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse mb-1" />
          <span className="text-[10px] font-mono font-bold text-amber tracking-tight">
            RAHUL // CORE
          </span>
        </div>

        {/* 3D Floating Skill Tags */}
        <div className="relative w-full h-full flex items-center justify-center">
          {tagsState.map((tag, idx) => {
            const isSelected = selectedSkill.name === tag.skill.name;

            return (
              <button
                key={idx}
                onClick={() => handleSkillClick(tag.skill)}
                onMouseEnter={() => {
                  setSelectedSkill(tag.skill);
                }}
                style={{
                  transform: `translate3d(${tag.x}px, ${tag.y}px, ${tag.z}px) scale(${tag.scale})`,
                  opacity: tag.alpha,
                  zIndex: Math.round((tag.z + 200) * 10),
                }}
                className={cn(
                  "absolute px-3 py-1.5 rounded-full text-xs font-mono transition-transform duration-75 cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-sm border",
                  isSelected
                    ? "bg-amber text-[#0A0A0A] border-amber font-bold ring-2 ring-amber/50 scale-110 shadow-lg"
                    : isLight
                    ? "bg-white text-slate-800 border-slate-200 hover:border-amber hover:text-amber"
                    : "bg-[#141414] text-foreground/90 border-[#262626] hover:border-amber/60 hover:text-amber"
                )}
              >
                <span className={isSelected ? "text-[#0A0A0A]" : "text-amber"}>
                  {tag.skill.icon}
                </span>
                <span>{tag.skill.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Organic Skill Clusters Below Sphere */}
      <div className="pt-2 border-t border-hairline/60 space-y-2.5">
        <div className="text-[11px] font-mono text-muted uppercase tracking-wider font-semibold">
          Organic Skill Cloud Grid (Click any skill to inspect):
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredSkills.map((sk) => {
            const isSelected = selectedSkill.name === sk.name;

            return (
              <button
                key={sk.name}
                onClick={() => handleSkillClick(sk)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-mono transition-all flex items-center gap-1.5 border",
                  isSelected
                    ? "bg-amber text-[#0A0A0A] border-amber font-bold shadow-sm scale-105"
                    : "bg-surface-subtle text-muted border-hairline hover:border-hairline-hover hover:text-foreground"
                )}
              >
                <span className={isSelected ? "text-[#0A0A0A]" : "text-amber"}>
                  {sk.icon}
                </span>
                <span>{sk.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Skill Inspector Spotlight Card */}
      {selectedSkill && (
        <div className="p-4 sm:p-5 rounded-xl bg-surface border border-amber/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 animate-in fade-in duration-150">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber/10 border border-amber/30 text-amber font-mono text-[10px] font-bold">
                {selectedSkill.category}
              </span>
              <h4 className="font-mono text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
                <span className="text-amber">{selectedSkill.icon}</span>
                <span>{selectedSkill.name}</span>
              </h4>
              <span className="text-[11px] font-mono text-emerald-500 font-semibold">
                ● {selectedSkill.level}
              </span>
            </div>

            <p className="text-xs text-foreground/90 font-sans leading-relaxed">
              {selectedSkill.detail}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-surface-subtle border border-hairline/60 shrink-0 font-mono text-xs space-y-0.5 sm:text-right">
            <div className="text-[10px] text-muted-dark uppercase">Production Deployment:</div>
            <div className="text-amber font-semibold text-[11px]">
              {selectedSkill.projectUse}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
