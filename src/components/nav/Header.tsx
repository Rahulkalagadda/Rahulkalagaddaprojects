"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Command, Menu, X, FileText, ArrowUpRight, FolderGit2, Sparkles, Mail } from "lucide-react";
import { profileData } from "@/data/profile";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { ThemeToggle } from "../theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { triggerConfetti } from "@/lib/confetti";

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenResumeModal: () => void;
}

const NAV_LINKS = [
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Education", href: "#education", id: "education" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onOpenResumeModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useScrollSpy(
    NAV_LINKS.map((l) => l.id),
    120
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-200 border-b",
          isScrolled
            ? "bg-[#0A0A0A]/95 backdrop-blur-md border-[#1E1E1E] py-3"
            : "bg-[#0A0A0A] border-transparent py-4"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Left: RK Logo Mark */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              onClick={() => triggerConfetti(0.1, 0.1)}
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-md bg-[#161616] border border-[#262626] group-hover:border-amber/60 flex items-center justify-center font-mono text-xs font-bold text-foreground transition-all duration-150 group-hover:scale-105">
                <span className="text-amber">R</span>K
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-semibold tracking-tight text-foreground group-hover:text-amber transition-colors">
                  RAHUL KALAGADDA
                </span>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span className="hidden sm:inline">AI Engineer · Systems</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 border border-[#1E1E1E] bg-[#111111]/80 rounded-md p-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-mono transition-all duration-150",
                    isActive
                      ? "bg-[#1E1E1E] text-amber font-medium shadow-sm"
                      : "text-muted hover:text-foreground hover:bg-[#161616]"
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Actions (Theme Toggle + Cmd+K + Resume) */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Mode Toggle */}
            <ThemeToggle />

            {/* Command Palette Trigger */}
            <button
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#222222] bg-[#141414] hover:border-amber/40 hover:bg-[#1A1A1A] text-muted hover:text-foreground transition-all duration-150 text-xs font-mono active:scale-95"
              aria-label="Open Command Palette (Cmd+K)"
            >
              <Command className="w-3.5 h-3.5 text-amber" />
              <span className="hidden sm:inline text-[11px]">Command</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#1F1F1F] border border-[#2A2A2A] text-muted">
                ⌘K
              </kbd>
            </button>

            {/* Resume Trigger */}
            <button
              onClick={() => {
                triggerConfetti(0.8, 0.1);
                onOpenResumeModal();
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-amber/30 text-amber hover:bg-amber/10 hover:border-amber transition-all duration-150 text-xs font-mono font-medium active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>CV</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md border border-[#222222] bg-[#141414] text-muted hover:text-foreground active:scale-95"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1E1E1E] bg-[#0D0D0D] px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-md font-mono text-xs transition-colors",
                  activeSection === link.id
                    ? "bg-[#1E1E1E] text-amber font-semibold"
                    : "text-muted hover:text-foreground hover:bg-[#161616]"
                )}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[#1E1E1E] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerConfetti(0.5, 0.5);
                  onOpenResumeModal();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md border border-amber/40 text-amber bg-amber/5 text-xs font-mono font-semibold"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Resume (PDF / Markdown)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Quick Action Pill on Mobile for 1-Thumb Reachability */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#121212]/95 backdrop-blur-md border border-[#262626] rounded-full px-3 py-2 shadow-2xl flex items-center gap-2 font-mono text-xs text-muted">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C1C1C] text-amber border border-amber/30 active:scale-95"
        >
          <Command className="w-3.5 h-3.5" />
          <span>⌘K</span>
        </button>

        <a
          href="#projects"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-foreground hover:bg-[#1A1A1A]"
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Projects</span>
        </a>

        <ThemeToggle className="rounded-full py-1 px-2 border-none" />

        <a
          href="#contact"
          className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:text-foreground hover:bg-[#1A1A1A]"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact</span>
        </a>
      </div>
    </>
  );
};
