"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Pause, Sparkles } from "lucide-react";

interface MotionSettings {
  enabled: boolean;
  ready: boolean;
  systemReduced: boolean;
  toggle: () => void;
}

const MotionContext = createContext<MotionSettings>({ enabled: false, ready: false, systemReduced: false, toggle: () => {} });

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [systemReduced, setSystemReduced] = useState(false);
  const [userReduced, setUserReduced] = useState(false);
  const enabled = ready && !systemReduced && !userReduced;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setSystemReduced(media.matches);
    update();
    try { setUserReduced(localStorage.getItem("rk-motion") === "reduced"); } catch { /* Preferences are optional. */ }
    setReady(true);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.effects = enabled ? "on" : "off";
  }, [enabled]);

  const toggle = () => {
    const next = !userReduced;
    setUserReduced(next);
    try { localStorage.setItem("rk-motion", next ? "reduced" : "full"); } catch { /* Changes still apply to this visit. */ }
  };

  return <MotionContext.Provider value={{ enabled, ready, systemReduced, toggle }}>{children}</MotionContext.Provider>;
}

export function useMotionSettings() { return useContext(MotionContext); }

export function MotionToggle() {
  const { enabled, ready, systemReduced, toggle } = useMotionSettings();
  const label = systemReduced ? "Visual effects paused by device preference" : enabled ? "Pause visual effects" : "Enable visual effects";
  return <button className="icon-button motion-toggle" onClick={toggle} disabled={!ready || systemReduced} aria-label={label} aria-pressed={!enabled} title={label}>
    {enabled ? <Sparkles size={17} /> : <Pause size={17} />}
  </button>;
}
