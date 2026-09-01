"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { triggerConfetti } from "@/lib/confetti";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent) => {
    triggerConfetti(0.9, 0.1);
    toggleTheme();
  };

  const isLight = theme === "light";

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-md border text-xs font-mono transition-all duration-200 active:scale-95",
        isLight
          ? "bg-[#F3F4F6] border-[#D1D5DB] text-[#1F2937] hover:border-amber hover:text-amber"
          : "bg-[#141414] border-[#262626] text-muted hover:border-amber/40 hover:text-foreground",
        className
      )}
      aria-label={`Switch to ${isLight ? "Dark" : "Light"} mode`}
      title={`Switch to ${isLight ? "Dark" : "Light"} mode`}
    >
      {isLight ? (
        <Sun className="w-3.5 h-3.5 text-amber animate-in spin-in-180 duration-200" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-amber animate-in spin-in-180 duration-200" />
      )}
      {showLabel && (
        <span className="hidden sm:inline text-[11px]">
          {isLight ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
};
