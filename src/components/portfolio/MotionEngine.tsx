"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { useMotionSettings } from "./MotionProvider";

const revealSelector = [
  ".forest-hero-top", ".forest-hero-copy > *", ".forest-hero-bottom", ".forest-story-copy > *", ".section-heading > *", ".project-card",
  ".about-preview-copy > *", ".discipline-card", ".page-intro > .eyebrow", ".intro-grid > *",
  ".journey-row", ".expertise-row", ".principles-grid > article", ".pipeline-panel", ".case-meta",
  ".case-story > div", ".architecture-node", ".case-scope > div", ".contact-direct > *",
  ".contact-form-panel", ".education-card", ".next-project", ".cta-content > *",
].join(",");

export function MotionEngine({ blocked }: { blocked: boolean }) {
  const pathname = usePathname();
  const { enabled } = useMotionSettings();
  const scroller = useRef<Lenis | null>(null);
  const blockedRef = useRef(blocked);

  useEffect(() => {
    blockedRef.current = blocked;
    if (blocked) scroller.current?.stop();
    else scroller.current?.start();
  }, [blocked]);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let progressFrame = 0;
    const updateProgress = () => {
      progressFrame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
      document.documentElement.style.setProperty("--scroll-progress", String(progress));
    };
    const onProgress = () => { if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress); };
    window.addEventListener("scroll", onProgress, { passive: true });
    window.addEventListener("resize", onProgress, { passive: true });
    updateProgress();
    document.documentElement.dataset.scrolling = "native";

    if (enabled && pathname !== "/resume") {
      const initialize = async () => {
        const [{ default: LenisClass }, { gsap }, { ScrollTrigger }] = await Promise.all([
          import("lenis"), import("gsap"), import("gsap/dist/ScrollTrigger"),
        ]);
        if (cancelled) return;
        const main = document.getElementById("main-content");
        if (!main) return;
        gsap.registerPlugin(ScrollTrigger);
        const lenis = new LenisClass({
          lerp: 0.085, smoothWheel: true, syncTouch: false, autoRaf: false,
          respectReducedMotion: true, stopInertiaOnNavigate: true,
          anchors: true,
          prevent: node => node.hasAttribute("data-lenis-prevent"),
        });
        scroller.current = lenis;
        document.documentElement.dataset.scrolling = "smooth";
        if (blockedRef.current) lenis.stop();
        const tick = (time: number) => { if (!document.hidden) lenis.raf(time * 1000); };
        const onScroll = () => { ScrollTrigger.update(); onProgress(); };
        lenis.on("scroll", onScroll);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        const tweens = new Map<HTMLElement, gsap.core.Tween>();
        const pointerCleanups: (() => void)[] = [];
        let refreshFrame = 0;
        const refresh = () => {
          if (cancelled || refreshFrame) return;
          refreshFrame = requestAnimationFrame(() => {
            refreshFrame = 0;
            lenis.resize();
            ScrollTrigger.refresh();
            updateProgress();
          });
        };

        const boundCards = new WeakSet<HTMLElement>();
        const boundButtons = new WeakSet<HTMLElement>();
        const bindInteractions = () => {
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            main.querySelectorAll<HTMLElement>(".project-image-link").forEach(card => {
              if (boundCards.has(card)) return;
              boundCards.add(card);
              const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.55, ease: "power3.out" });
              const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.55, ease: "power3.out" });
              gsap.set(card, { transformPerspective: 1100, transformOrigin: "50% 50%" });
              const move = (event: PointerEvent) => {
                const rect = card.getBoundingClientRect();
                rotateX((0.5 - (event.clientY - rect.top) / rect.height) * 6);
                rotateY(((event.clientX - rect.left) / rect.width - 0.5) * 7);
              };
              const leave = () => { rotateX(0); rotateY(0); };
              card.addEventListener("pointermove", move);
              card.addEventListener("pointerleave", leave);
              card.addEventListener("blur", leave);
              pointerCleanups.push(() => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); card.removeEventListener("blur", leave); });
            });
            main.querySelectorAll<HTMLElement>(".pill-button").forEach(button => {
              if (boundButtons.has(button)) return;
              boundButtons.add(button);
              const icon = button.querySelector<HTMLElement>(".button-icon");
              if (!icon) return;
              const x = gsap.quickTo(icon, "x", { duration: 0.35, ease: "power3.out" });
              const y = gsap.quickTo(icon, "y", { duration: 0.35, ease: "power3.out" });
              const move = (event: PointerEvent) => {
                const rect = button.getBoundingClientRect();
                x(((event.clientX - rect.left) / rect.width - 0.5) * 7);
                y(((event.clientY - rect.top) / rect.height - 0.5) * 7);
              };
              const leave = () => { x(0); y(0); };
              button.addEventListener("pointermove", move);
              button.addEventListener("pointerleave", leave);
              pointerCleanups.push(() => { button.removeEventListener("pointermove", move); button.removeEventListener("pointerleave", leave); });
            });
          }
        };

        const context = gsap.context(() => {
          const candidates = Array.from(main.querySelectorAll<HTMLElement>(revealSelector));
          const targets = candidates.filter(element => !element.parentElement?.closest(revealSelector));
          targets.forEach((element, index) => {
            const bounds = element.getBoundingClientRect();
            if (bounds.bottom < 0) return;
            const inView = bounds.top < window.innerHeight * 0.94;
            const tween = gsap.fromTo(element, { opacity: 0, y: element.matches(".project-card") ? 44 : 26 }, {
              opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
              delay: inView ? Math.min(index * 0.065, 0.22) : element.matches(".project-card") ? (index % 2) * 0.09 : 0,
              clearProps: "opacity,transform",
              ...(!inView ? { scrollTrigger: { trigger: element, start: "top 93%", once: true } } : {}),
            });
            tweens.set(element, tween);
          });

          const heroCopy = main.querySelector(".forest-hero-copy");
          if (heroCopy && window.matchMedia("(min-width: 821px)").matches) {
            gsap.to(heroCopy, { y: -32, ease: "none", scrollTrigger: { trigger: ".forest-hero", start: "top top", end: "bottom top", scrub: 0.8 } });
          }
          const forestPhoto = main.querySelector(".forest-story-photo");
          if (forestPhoto) gsap.fromTo(forestPhoto, { y: -20 }, { y: 20, ease: "none", scrollTrigger: { trigger: ".forest-story-image", start: "top bottom", end: "bottom top", scrub: 0.9 } });
          const initials = main.querySelector(".initials-sculpture");
          if (initials) gsap.fromTo(initials, { y: -12 }, { y: 20, ease: "none", scrollTrigger: { trigger: ".about-sculpture-card", start: "top bottom", end: "bottom top", scrub: 0.9 } });

          bindInteractions();
        }, main);

        const onFocus = (event: FocusEvent) => {
          if (!(event.target instanceof HTMLElement)) return;
          const target = event.target;
          tweens.forEach((tween, element) => {
            if (element.contains(target)) { tween.progress(1); tween.scrollTrigger?.kill(); }
          });
          const bounds = target.getBoundingClientRect();
          if (target === main || bounds.top < 80 || bounds.bottom > window.innerHeight) {
            lenis.scrollTo(target, { immediate: true });
          }
        };
        main.addEventListener("focusin", onFocus);
        const mutation = new MutationObserver(() => { refresh(); context.add(bindInteractions); });
        mutation.observe(main, { childList: true, subtree: true });
        const resize = new ResizeObserver(refresh);
        resize.observe(main);
        refresh();
        document.fonts.ready.then(() => { if (!cancelled) refresh(); });
        cleanup = () => {
          mutation.disconnect(); resize.disconnect();
          if (refreshFrame) cancelAnimationFrame(refreshFrame);
          main.removeEventListener("focusin", onFocus);
          pointerCleanups.forEach(remove => remove());
          context.revert();
          gsap.ticker.remove(tick);
          lenis.off("scroll", onScroll);
          lenis.destroy();
          scroller.current = null;
          document.documentElement.dataset.scrolling = "native";
        };
      };
      initialize().catch(() => {
        cleanup?.();
        // Content and native scrolling remain available if motion cannot initialize.
        document.documentElement.dataset.scrolling = "native";
      });
    }

    return () => {
      cancelled = true;
      cleanup?.();
      if (progressFrame) cancelAnimationFrame(progressFrame);
      window.removeEventListener("scroll", onProgress);
      window.removeEventListener("resize", onProgress);
    };
  }, [enabled, pathname]);

  return null;
}
