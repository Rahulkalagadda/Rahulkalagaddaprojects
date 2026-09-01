"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowDown, FileText, ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { profileData } from "@/data/profile";
import { ParticleFallback } from "./ParticleFallback";
import { TypewriterHeadline } from "./TypewriterHeadline";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { triggerConfetti } from "@/lib/confetti";

// Lazy-load Three.js particle canvas on client-side only
const DynamicParticleNetwork = dynamic(
  () =>
    import("./ParticleNetwork").then((mod) => mod.ParticleNetwork),
  {
    ssr: false,
    loading: () => <ParticleFallback />,
  }
);

interface HeroProps {
  onOpenResumeModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResumeModal }) => {
  const prefersReducedMotion = useReducedMotion();

  const handleScrollToProjects = () => {
    triggerConfetti(0.3, 0.4);
    const el = document.getElementById("projects");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResumeClick = () => {
    triggerConfetti(0.5, 0.5);
    onOpenResumeModal();
  };

  return (
    <section
      id="hero"
      className="relative pt-10 pb-16 md:pt-16 md:pb-24 bg-tech-grid"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Clean, High-Impact Bio */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-hairline text-foreground/80">
                <MapPin className="w-3 h-3 text-amber" />
                <span>{profileData.location}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Available for AI Engineering</span>
              </div>
            </div>

            {/* Dynamic Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-mono text-foreground">
                {profileData.name}
              </h1>

              {/* Dynamic Typewriter Role */}
              <TypewriterHeadline />

              <p className="text-base sm:text-lg text-muted font-normal leading-relaxed pt-1 max-w-xl">
                {profileData.subheading}
              </p>
            </div>

            {/* Core Value Statement - Concise & Impactful */}
            <p className="text-sm text-foreground/80 max-w-lg leading-relaxed font-sans">
              Specializing in deterministic LLM policy guardrails, sub-second hybrid RAG retrieval with Qdrant & FAISS, and high-throughput FastAPI backends.
            </p>

            {/* Visual Impact Metric Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {profileData.stats.map((st, i) => (
                <div
                  key={i}
                  onClick={
                    i === 0
                      ? handleScrollToProjects
                      : i === 2
                      ? () => {
                          const el = document.getElementById("education");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      : undefined
                  }
                  className="px-3.5 py-1.5 rounded-full bg-surface/80 border border-hairline text-xs font-mono text-foreground/90 cursor-pointer hover:border-amber/60 hover:text-amber transition-all hover:scale-105"
                >
                  <span className="text-amber font-bold mr-1">✦</span>
                  <span>{st.label}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleScrollToProjects}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber text-[#0A0A0A] font-mono text-xs sm:text-sm font-bold hover:bg-amber-hover transition-all hover:scale-105 shadow-md active:scale-95"
              >
                <span>Explore Systems</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={handleResumeClick}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface border border-hairline text-foreground font-mono text-xs sm:text-sm hover:border-amber/60 hover:text-amber transition-all hover:scale-105 active:scale-95"
              >
                <FileText className="w-4 h-4 text-amber" />
                <span>Resume CV</span>
              </button>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono text-muted hover:text-foreground transition-colors"
              >
                <span>Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Three.js Particle Mesh */}
          <div className="lg:col-span-5 h-[320px] sm:h-[380px] w-full">
            {prefersReducedMotion ? (
              <ParticleFallback />
            ) : (
              <div className="w-full h-full">
                <div className="hidden sm:block w-full h-full">
                  <DynamicParticleNetwork />
                </div>
                <div className="sm:hidden w-full h-full">
                  <ParticleFallback />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
