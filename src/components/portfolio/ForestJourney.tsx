"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionSettings } from "./MotionProvider";

/** A native sticky scene: scroll position is the film's playhead, in either direction. */
export function ForestJourney({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { enabled } = useMotionSettings();
  const [saveData, setSaveData] = useState(false);
  const [filmState, setFilmState] = useState<"poster" | "loading" | "ready" | "fallback">("poster");
  const moving = enabled && !saveData;

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setSaveData(Boolean(connection?.saveData));
  }, []);

  useEffect(() => {
    const element = root.current;
    const film = video.current;
    if (!element || !film) return;
    if (!moving) {
      element.style.setProperty("--journey-progress", "0");
      setFilmState("poster");
      return;
    }
    let frame = 0;
    let visible = true;
    let requested = false;
    let disposed = false;
    let desiredTime = 0;
    let headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 83;
    const stage = element.querySelector<HTMLElement>(".forest-hero")!;
    element.style.setProperty("--journey-header", `${headerHeight}px`);

    // Keep only the most recent scroll target while the decoder finishes a seek.
    const seek = () => {
      if (disposed || !visible || document.hidden || film.seeking || film.readyState < 1 || !Number.isFinite(film.duration)) return;
      const next = Math.min(film.duration - 1 / 24, Math.max(0, desiredTime));
      if (Math.abs(film.currentTime - next) >= 1 / 30) film.currentTime = next;
    };
    const update = () => {
      frame = 0;
      if (disposed || document.hidden) return;
      const span = Math.max(1, element.offsetHeight - stage.offsetHeight);
      const progress = Math.max(0, Math.min(1, (headerHeight - element.getBoundingClientRect().top) / span));
      element.style.setProperty("--journey-progress", String(progress));
      element.dataset.journeyProgress = progress.toFixed(3);
      if (Number.isFinite(film.duration)) desiredTime = progress * Math.max(0, film.duration - 1 / 24);
      seek();
    };
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
    const ready = () => { if (!disposed) setFilmState("ready"); schedule(); };
    const failed = () => { if (!disposed) setFilmState("fallback"); };
    const load = () => {
      if (requested || disposed || document.hidden) return;
      requested = true;
      setFilmState("loading");
      film.src = window.innerWidth <= 820 ? "/forest/forest-journey-mobile.mp4" : "/forest/forest-journey.mp4";
      film.preload = "auto";
      film.load();
    };
    const resize = () => {
      headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 83;
      element.style.setProperty("--journey-header", `${headerHeight}px`);
      schedule();
    };
    const visibilityChanged = () => { if (!document.hidden) { if (visible) load(); schedule(); } };
    film.addEventListener("loadedmetadata", schedule);
    film.addEventListener("loadeddata", ready);
    film.addEventListener("seeked", seek);
    film.addEventListener("error", failed);
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { load(); schedule(); }
    }, { rootMargin: "100px" });
    observer.observe(element);
    const size = new ResizeObserver(resize);
    size.observe(element);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", visibilityChanged);
    schedule();
    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect(); size.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibilityChanged);
      film.removeEventListener("loadedmetadata", schedule);
      film.removeEventListener("loadeddata", ready);
      film.removeEventListener("seeked", seek);
      film.removeEventListener("error", failed);
      film.pause();
      film.removeAttribute("src");
      film.load();
    };
  }, [moving]);

  return <section ref={root} className="forest-journey" data-journey-motion={moving ? "on" : "off"} data-film-state={filmState}>
    <div className="forest-hero forest-hero-journey">
      <video ref={video} className="forest-journey-film" muted playsInline preload="none" poster="/forest/forest-clearing.webp" aria-hidden="true" tabIndex={-1} />
      {children}
      <div className="forest-journey-indicator" aria-hidden="true"><span>INTO THE FOREST</span><i><b /></i><span>SCROLL TO EXPLORE</span></div>
    </div>
  </section>;
}
