"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { Terminal, Github, Linkedin, Mail, ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#1E1E1E] bg-[#080808] py-8 font-mono text-xs text-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand and Location */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#141414] border border-[#242424] flex items-center justify-center text-[10px] font-bold text-amber">
              RK
            </div>
            <div>
              <span className="text-foreground font-semibold">
                Rahul Kalagadda
              </span>{" "}
              <span className="text-muted-dark">| {profileData.location}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-xs">
            <a
              href={profileData.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-amber transition-colors inline-flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-muted hover:text-amber transition-colors inline-flex items-center gap-1"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${profileData.email}`}
              className="text-muted hover:text-amber transition-colors inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
            <button
              onClick={scrollToTop}
              className="text-muted hover:text-foreground p-1 rounded hover:bg-[#161616] transition-colors ml-2"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom bar with required attribution */}
        <div className="pt-4 border-t border-[#161616] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-dark">
          <div>
            © {new Date().getFullYear()} Rahul Kalagadda. All rights reserved.
          </div>
          <div className="text-muted font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
            <span>Built with Stitch + Antigravity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
