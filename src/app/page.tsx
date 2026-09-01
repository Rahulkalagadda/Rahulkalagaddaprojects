"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/nav/Header";
import { CommandPalette } from "@/components/nav/CommandPalette";
import { Hero } from "@/components/hero/Hero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { ExperienceSection } from "@/components/experience/ExperienceSection";
import { SkillsSection } from "@/components/skills/SkillsSection";
import { EducationAchievements } from "@/components/education/EducationAchievements";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/contact/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default function Home() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Global key listener for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-amber selection:text-[#0A0A0A]">
          {/* Sticky Header Nav with Dark/Light Toggle */}
          <Header
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenResumeModal={() => setResumeModalOpen(true)}
          />

          {/* Main Content Sections */}
          <main className="flex-1">
            {/* Hero Section */}
            <Hero onOpenResumeModal={() => setResumeModalOpen(true)} />

            {/* Project Case Studies & Deployments Gallery */}
            <ProjectsSection />

            {/* Experience Timeline */}
            <ExperienceSection />

            {/* Skills Interactive Topology */}
            <SkillsSection />

            {/* Education & Achievements */}
            <EducationAchievements />

            {/* Contact Section */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer />

          {/* Command Palette Modal (Cmd+K) */}
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            onOpenResumeModal={() => setResumeModalOpen(true)}
          />

          {/* Verified Resume Modal */}
          <ResumeModal
            isOpen={resumeModalOpen}
            onClose={() => setResumeModalOpen(false)}
          />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
