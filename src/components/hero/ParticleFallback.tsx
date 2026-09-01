"use client";

import React from "react";

export const ParticleFallback: React.FC = () => {
  // Static developer-grade node lattice schematic for mobile / reduced-motion
  return (
    <div className="w-full h-full min-h-[320px] flex items-center justify-center relative p-4 border border-[#1E1E1E] rounded-lg bg-[#0C0C0C]">
      <svg
        className="w-full h-full max-h-[300px]"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Connecting lines */}
        <line x1="60" y1="80" x2="160" y2="60" stroke="#262626" strokeWidth="1" />
        <line x1="160" y1="60" x2="280" y2="90" stroke="#262626" strokeWidth="1" />
        <line x1="280" y1="90" x2="340" y2="170" stroke="#262626" strokeWidth="1" />
        <line x1="160" y1="60" x2="200" y2="150" stroke="#F2A623" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
        <line x1="60" y1="80" x2="100" y2="200" stroke="#262626" strokeWidth="1" />
        <line x1="100" y1="200" x2="200" y2="150" stroke="#262626" strokeWidth="1" />
        <line x1="200" y1="150" x2="300" y2="220" stroke="#262626" strokeWidth="1" />
        <line x1="300" y1="220" x2="340" y2="170" stroke="#262626" strokeWidth="1" />
        <line x1="200" y1="150" x2="280" y2="90" stroke="#F2A623" strokeWidth="1" opacity="0.4" />
        <line x1="100" y1="200" x2="220" y2="260" stroke="#262626" strokeWidth="1" />
        <line x1="220" y1="260" x2="300" y2="220" stroke="#262626" strokeWidth="1" />

        {/* Nodes */}
        <circle cx="60" cy="80" r="3" fill="#5A5A57" />
        <circle cx="160" cy="60" r="3.5" fill="#8E8E8A" />
        <circle cx="280" cy="90" r="3" fill="#5A5A57" />
        <circle cx="340" cy="170" r="3.5" fill="#8E8E8A" />
        <circle cx="100" cy="200" r="3" fill="#5A5A57" />
        <circle cx="220" cy="260" r="3" fill="#5A5A57" />
        <circle cx="300" cy="220" r="3.5" fill="#8E8E8A" />

        {/* Active Central Node */}
        <circle cx="200" cy="150" r="5" fill="#F2A623" />
        <circle cx="200" cy="150" r="10" stroke="#F2A623" strokeWidth="1" opacity="0.3" />

        {/* Node Labels in Monospace */}
        <text x="200" y="130" textAnchor="middle" fill="#F2A623" fontSize="9" fontFamily="monospace">
          RAG_GATEWAY
        </text>
        <text x="160" y="48" textAnchor="middle" fill="#8E8E8A" fontSize="8" fontFamily="monospace">
          QDRANT_HYBRID
        </text>
        <text x="340" y="190" textAnchor="middle" fill="#8E8E8A" fontSize="8" fontFamily="monospace">
          GROQ_INFERENCE
        </text>
        <text x="100" y="218" textAnchor="middle" fill="#8E8E8A" fontSize="8" fontFamily="monospace">
          POLICY_ENGINE
        </text>
      </svg>
      <div className="absolute bottom-3 left-4 text-[10px] font-mono text-muted">
        <span>ARCH://node-lattice-v2.0</span>
      </div>
    </div>
  );
};
