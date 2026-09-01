import React from "react";
import { cn } from "@/lib/utils";

interface StatChipProps {
  label: string;
  sub?: string;
  className?: string;
  onClick?: () => void;
}

export const StatChip: React.FC<StatChipProps> = ({
  label,
  sub,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-amber/40 bg-surface/80 text-amber font-mono text-xs tracking-tight transition-colors duration-150",
        onClick && "cursor-pointer hover:border-amber hover:bg-amber/10",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block" />
      <span className="font-semibold text-amber">{label}</span>
      {sub && <span className="text-muted text-[11px] font-normal">| {sub}</span>}
    </div>
  );
};
