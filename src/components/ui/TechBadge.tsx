import React from "react";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  label: string;
  variant?: "default" | "amber" | "outline" | "active";
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  label,
  variant = "default",
  size = "sm",
  className,
  onClick,
}) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-mono transition-colors duration-150 select-none",
        size === "sm" ? "text-[11px] px-2 py-0.5 rounded" : "text-xs px-2.5 py-1 rounded-md",
        variant === "default" &&
          "bg-[#161616] text-[#A3A3A0] border border-[#222222] hover:border-[#333333] hover:text-foreground",
        variant === "amber" &&
          "bg-amber/10 text-amber border border-amber/30 hover:border-amber hover:bg-amber/15",
        variant === "active" &&
          "bg-amber text-[#0A0A0A] font-medium border border-amber",
        variant === "outline" &&
          "bg-transparent text-muted border border-[#262626] hover:text-foreground hover:border-[#383838]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {label}
    </span>
  );
};
