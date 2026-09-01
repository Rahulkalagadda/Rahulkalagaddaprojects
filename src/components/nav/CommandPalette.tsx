"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  FolderGit2,
  Briefcase,
  Cpu,
  GraduationCap,
  Mail,
  FileText,
  Github,
  Linkedin,
  Phone,
  ArrowRight,
  Sparkles,
  Globe,
  Sun,
  Moon,
  ExternalLink,
  X,
} from "lucide-react";
import { profileData } from "@/data/profile";
import { projectsData, clientDeploymentsData } from "@/data/projects";
import { experienceData } from "@/data/experience";
import { useTheme } from "../theme/ThemeProvider";
import { copyToClipboard } from "@/lib/utils";
import { useToast } from "../ui/Toast";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Case Studies" | "Deployments" | "Experience" | "Theme" | "Actions";
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenResumeModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenResumeModal,
}) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { theme, toggleTheme, setTheme } = useTheme();

  const handleScrollTo = (id: string) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const commandItems: CommandItem[] = [
    // Theme Controls
    {
      id: "action-toggle-theme",
      title: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      category: "Theme",
      description: `Toggle theme (currently ${theme})`,
      icon: theme === "dark" ? <Sun className="w-4 h-4 text-amber" /> : <Moon className="w-4 h-4 text-amber" />,
      action: () => {
        toggleTheme();
        toast(`Theme switched to ${theme === "dark" ? "Light" : "Dark"} Mode!`);
        onClose();
      },
    },

    // Navigation
    {
      id: "nav-hero",
      title: "Home / Overview",
      category: "Navigation",
      description: "Jump to portfolio top & intro",
      icon: <Sparkles className="w-4 h-4 text-amber" />,
      action: () => handleScrollTo("hero"),
    },
    {
      id: "nav-projects",
      title: "Featured AI Systems",
      category: "Navigation",
      description: "Case studies with architecture diagrams",
      icon: <FolderGit2 className="w-4 h-4 text-amber" />,
      action: () => handleScrollTo("projects"),
    },
    {
      id: "nav-experience",
      title: "Work Experience",
      category: "Navigation",
      description: "Engineering timeline & accomplishments",
      icon: <Briefcase className="w-4 h-4 text-amber" />,
      action: () => handleScrollTo("experience"),
    },
    {
      id: "nav-skills",
      title: "Technical Skills",
      category: "Navigation",
      description: "Interactive node graph & skill matrix",
      icon: <Cpu className="w-4 h-4 text-amber" />,
      action: () => handleScrollTo("skills"),
    },
    {
      id: "nav-education",
      title: "Education & Hackathons",
      category: "Navigation",
      description: "BCA 8.74 CGPA & SIH 2nd Rank",
      icon: <GraduationCap className="w-4 h-4 text-amber" />,
      action: () => handleScrollTo("education"),
    },
    {
      id: "nav-contact",
      title: "Contact & Inquiries",
      category: "Navigation",
      description: "Direct messaging & links",
      icon: <Mail className="w-4 h-4 text-amber" />,
      action: () => handleScrollTo("contact"),
    },

    // Featured Case Studies
    ...projectsData.map((p) => ({
      id: `proj-${p.id}`,
      title: p.name,
      category: "Case Studies" as const,
      description: p.tagline,
      icon: <FolderGit2 className="w-4 h-4 text-muted" />,
      action: () => handleScrollTo(`project-${p.id}`),
    })),

    // Live Client Deployments & SaaS
    ...clientDeploymentsData.map((d) => ({
      id: `deploy-${d.id}`,
      title: d.name,
      category: "Deployments" as const,
      description: `${d.domain} (${d.tags.slice(0, 3).join(", ")})`,
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      action: () => {
        window.open(d.liveUrl, "_blank");
        onClose();
      },
    })),

    // Experience
    ...experienceData.map((e) => ({
      id: `exp-${e.id}`,
      title: `${e.role} — ${e.company}`,
      category: "Experience" as const,
      description: `${e.period} · ${e.highlightMetric || ""}`,
      icon: <Briefcase className="w-4 h-4 text-muted" />,
      action: () => handleScrollTo("experience"),
    })),

    // Actions
    {
      id: "action-resume",
      title: "View / Print Resume",
      category: "Actions",
      description: "Open full CV in viewer",
      icon: <FileText className="w-4 h-4 text-amber" />,
      action: () => {
        onClose();
        onOpenResumeModal();
      },
    },
    {
      id: "action-copy-email",
      title: `Copy Email (${profileData.email})`,
      category: "Actions",
      description: "Copy to clipboard",
      icon: <Mail className="w-4 h-4 text-muted" />,
      action: async () => {
        await copyToClipboard(profileData.email);
        toast(`Email copied: ${profileData.email}`);
        onClose();
      },
    },
    {
      id: "action-copy-phone",
      title: `Copy Phone (${profileData.phone})`,
      category: "Actions",
      description: "Copy phone number",
      icon: <Phone className="w-4 h-4 text-muted" />,
      action: async () => {
        await copyToClipboard(profileData.phone);
        toast(`Phone copied: ${profileData.phone}`);
        onClose();
      },
    },
    {
      id: "action-github",
      title: "Open GitHub Profile",
      category: "Actions",
      description: "github.com/Rahulkalagadda",
      icon: <Github className="w-4 h-4 text-muted" />,
      action: () => {
        window.open(profileData.github, "_blank");
        onClose();
      },
    },
    {
      id: "action-linkedin",
      title: "Open LinkedIn Profile",
      category: "Actions",
      description: "linkedin.com/in/rahul-kalagadda",
      icon: <Linkedin className="w-4 h-4 text-muted" />,
      action: () => {
        window.open(profileData.linkedin, "_blank");
        onClose();
      },
    },
  ];

  const filteredItems = commandItems.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcut ⌘K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          setQuery("");
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="bg-[#0E0E0E] border border-[#242424] rounded-lg w-full max-w-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1E1E1E] bg-[#121212]">
          <Search className="w-4 h-4 text-amber shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, theme, projects, or sections..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted/60 text-xs sm:text-sm font-mono focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted hover:text-foreground text-xs font-mono"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-muted hover:text-foreground text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-muted">
              No matching commands or projects found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-100 font-mono text-xs ${
                    isSelected
                      ? "bg-[#1C1C1C] text-foreground border border-amber/30"
                      : "text-muted hover:text-foreground border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{item.icon}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-semibold text-foreground">
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="truncate text-[11px] text-muted">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] text-muted-dark px-1.5 py-0.5 rounded bg-[#161616] border border-[#222222]">
                      {item.category}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-amber" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#1E1E1E] bg-[#101010] flex items-center justify-between text-[11px] font-mono text-muted">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-[10px]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-[10px]">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>
          <div>
            <kbd className="px-1 py-0.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded text-[10px]">
              ESC
            </kbd>{" "}
            Close
          </div>
        </div>
      </div>
    </div>
  );
};
