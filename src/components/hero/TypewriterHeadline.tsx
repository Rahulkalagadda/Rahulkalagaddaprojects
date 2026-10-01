"use client";

import React, { useState, useEffect } from "react";

const ROLES = [
  "LLM & RAG Systems Engineer",
  "Deterministic Guardrails Architect",
  "High-Throughput Backend Specialist",
  "Signal Detection Theory Modeler",
  "Full-Stack AI Products Builder",
];

export const TypewriterHeadline: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(80);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        setText(currentRole.substring(0, text.length + 1));
        if (text.length + 1 === currentRole.length) {
          // Pause at full word
          setTypingSpeed(1800);
          setIsDeleting(true);
        } else {
          setTypingSpeed(60 + Math.random() * 30);
        }
      } else {
        // Deleting
        setText(currentRole.substring(0, text.length - 1));
        if (text.length - 1 === 0) {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
          setTypingSpeed(400);
        } else {
          setTypingSpeed(35);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, roleIndex, typingSpeed]);

  return (
    <div className="inline-flex items-center gap-1 text-sm sm:text-base lg:text-lg font-mono text-amber font-semibold min-h-[28px]">
      <span className="text-foreground/60 mr-1">{"// focus:"}</span>
      <span>{text}</span>
      <span className="w-2 h-4 bg-amber inline-block animate-pulse ml-0.5" />
    </div>
  );
};
