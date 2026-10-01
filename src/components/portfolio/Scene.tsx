"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionSettings } from "./MotionProvider";
export type SculptureShape = "knot" | "orbit" | "sphere" | "helix";
export type SculptureFinish = "chrome" | "cobalt" | "pearl" | "iridescent";
interface SceneProps {
  shape?: SculptureShape;
  finish?: SculptureFinish;
  speed?: number;
  running?: boolean;
  userMotion?: boolean;
  resetKey?: number;
  interactive?: boolean;
  variant?: "hero" | "studio" | "preview";
  className?: string;
}

export function Scene({
  shape = "knot", finish = "chrome", speed = 1, running = true,
  userMotion = false, resetKey = 0, interactive = true, variant = "studio", className = "",
}: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const sync = useRef<(() => void) | null>(null);
  const { enabled } = useMotionSettings();
  const options = useRef({ shape, finish, speed, running, userMotion, resetKey, motionEnabled: enabled });
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    options.current = { shape, finish, speed, running, userMotion, resetKey, motionEnabled: enabled };
    sync.current?.();
  }, [shape, finish, speed, running, userMotion, resetKey, enabled]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let started = false;
    let disposeScene: (() => void) | undefined;
    const initialize = async () => {
      const [THREE, { RoomEnvironment }, { OrbitControls }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
        import("three/examples/jsm/controls/OrbitControls.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, variant === "preview" ? 1.25 : 1.65));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      const canvas = renderer.domElement;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", interactive
        ? "Interactive 3D sculpture. Drag or use arrow keys to rotate. Press Home to reset."
        : "Reflective three-dimensional chrome sculpture.");
      canvas.tabIndex = interactive ? 0 : -1;
      element.appendChild(canvas);
      disposeScene = () => { renderer.dispose(); renderer.forceContextLoss(); canvas.remove(); };
      let lostContext = false;
      let frame = 0;
      let visible = true;
      let previousTime = 0;
      let scrollProgress = 0;
      let previousScroll = 0;
      let heroStart = 0;
      let heroHeight = 1;
      const pointer = { x: 0, y: 0 };
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      let currentShape = options.current.shape;
      let currentFinish = options.current.finish;
      let currentReset = options.current.resetKey;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
      camera.position.set(0, 0.12, 6.8);
      const environmentScene = new RoomEnvironment();
      const generator = new THREE.PMREMGenerator(renderer);
      const environment = generator.fromScene(environmentScene, 0.04);
      scene.environment = environment.texture;
      environmentScene.dispose();
      generator.dispose();
      const light = new THREE.DirectionalLight(0xcfd8ff, 3);
      light.position.set(4, 4, 3);
      scene.add(light, new THREE.AmbientLight(0xffffff, 0.55));
      const blueLight = new THREE.DirectionalLight(0x3d5afe, 2.5);
      blueLight.position.set(-3, -2, 1);
      scene.add(blueLight);
      class Helix extends THREE.Curve<InstanceType<typeof THREE.Vector3>> {
        constructor() { super(); }
        getPoint(t: number, target = new THREE.Vector3()) {
          const angle = t * Math.PI * 5;
          return target.set(Math.cos(angle) * 1.03, (t - 0.5) * 3.1, Math.sin(angle) * 1.03);
        }
      }
      const createGeometry = (kind: SculptureShape) => {
        if (kind === "orbit") return new THREE.TorusGeometry(1.28, 0.42, 32, 160);
        if (kind === "sphere") return new THREE.IcosahedronGeometry(1.65, 3);
        if (kind === "helix") return new THREE.TubeGeometry(new Helix(), 160, 0.22, 20, false);
        return new THREE.TorusKnotGeometry(1.13, 0.34, 168, 28, 2, 3);
      };
      const material = new THREE.MeshPhysicalMaterial({ color: 0xdce1ec, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.5 });
      const sculpture = new THREE.Mesh(createGeometry(currentShape), material);
      sculpture.rotation.set(0.3, -0.45, 0.28);
      const group = new THREE.Group();
      group.add(sculpture);
      scene.add(group);
      const satelliteMaterial = new THREE.MeshStandardMaterial({ color: 0x4868ff, metalness: 0.65, roughness: 0.2 });
      const satelliteGeometry = new THREE.SphereGeometry(0.09, 20, 16);
      const satellites = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
        const angle = i * Math.PI * 2 / 3;
        satellite.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 1.8, -0.3);
        satellites.add(satellite);
      }
      scene.add(satellites);
      const orbitGeometry = new THREE.TorusGeometry(2.05, 0.008, 6, 144);
      const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x6983ff, transparent: true, opacity: 0.23, depthWrite: false });
      const orbitals = new THREE.Group();
      if (variant !== "studio") {
        for (let i = 0; i < 2; i++) {
          const ring = new THREE.Mesh(orbitGeometry, orbitMaterial);
          ring.rotation.set(i === 0 ? 0.8 : -0.65, i === 0 ? 0.3 : 0.7, i * 0.9);
          orbitals.add(ring);
        }
        orbitals.position.z = -0.35;
        scene.add(orbitals);
      }
      const dustGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(36 * 3);
      for (let i = 0; i < 36; i++) {
        const angle = i * 2.399963;
        const radius = 1.8 + (i % 7) * 0.14;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.72;
        positions[i * 3 + 2] = -1.25 - (i % 4) * 0.2;
      }
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0x91a6ff, size: 0.022, transparent: true, opacity: 0.5, depthWrite: false });
      const dust = new THREE.Points(dustGeometry, dustMaterial);
      if (variant === "hero") scene.add(dust);
      const controls = new OrbitControls(camera, canvas);
      controls.enabled = interactive;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = false;
      canvas.style.touchAction = "pan-y";
      controls.rotateSpeed = 0.55;
      const canAnimate = () => !lostContext && visible && !document.hidden && options.current.running && (!motion.matches || options.current.userMotion) && (options.current.motionEnabled || options.current.userMotion);
      const render = () => { if (!disposed && !lostContext) renderer.render(scene, camera); };
      const tick = (time: number) => {
        frame = 0;
        if (disposed) return;
        const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.06) : 0;
        previousTime = time;
        if (canAnimate()) {
          group.rotation.y += dt * options.current.speed * 0.24;
          group.rotation.x += dt * options.current.speed * 0.035;
          if (variant === "hero") {
            const follow = 1 - Math.exp(-dt * 4);
            const nextScroll = THREE.MathUtils.lerp(previousScroll, scrollProgress, follow);
            group.rotation.y += (nextScroll - previousScroll) * 0.85;
            group.rotation.x += (nextScroll - previousScroll) * 0.2;
            previousScroll = nextScroll;
            group.position.x = THREE.MathUtils.lerp(group.position.x, pointer.x * 0.13, follow);
            group.position.y = THREE.MathUtils.lerp(group.position.y, pointer.y * 0.1 - nextScroll * 0.12, follow);
            group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, 1 - nextScroll * 0.09, follow));
            dust.rotation.z -= dt * 0.018;
          }
          satellites.rotation.z -= dt * options.current.speed * 0.12;
          orbitals.rotation.z += dt * options.current.speed * 0.04;
          render();
          frame = requestAnimationFrame(tick);
        }
      };
      const wake = () => {
        if (disposed) return;
        render();
        if (canAnimate() && !frame) {
          previousTime = 0;
          frame = requestAnimationFrame(tick);
        } else if (!canAnimate() && frame) {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      };
      const onScroll = () => {
        scrollProgress = Math.max(0, Math.min(1, (window.scrollY - heroStart) / heroHeight));
      };
      const resize = () => {
        if (disposed) return;
        const width = Math.max(element.clientWidth, 1);
        const height = Math.max(element.clientHeight, 1);
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = camera.aspect < 1 ? 8 / camera.aspect : variant === "hero" ? 7.3 : 7;
        camera.updateProjectionMatrix();
        const hero = element.closest<HTMLElement>(".hero");
        if (hero) {
          heroStart = hero.getBoundingClientRect().top + window.scrollY;
          heroHeight = hero.offsetHeight;
          onScroll();
        }
        wake();
      };
      const update = () => {
        if (currentShape !== options.current.shape) {
          sculpture.geometry.dispose();
          sculpture.geometry = createGeometry(options.current.shape);
          currentShape = options.current.shape;
        }
        if (currentFinish !== options.current.finish) {
          currentFinish = options.current.finish;
          material.color.set(currentFinish === "cobalt" ? 0x284aff : currentFinish === "pearl" ? 0xf0e8d8 : currentFinish === "iridescent" ? 0xd4d9f5 : 0xdce1ec);
          material.metalness = currentFinish === "pearl" ? 0.15 : currentFinish === "iridescent" ? 0.82 : 1;
          material.roughness = currentFinish === "pearl" ? 0.25 : currentFinish === "cobalt" ? 0.2 : 0.16;
          material.iridescence = currentFinish === "iridescent" ? 1 : 0;
          material.iridescenceIOR = 1.3;
          material.iridescenceThicknessRange = [120, 500];
          material.needsUpdate = true;
        }
        if (currentReset !== options.current.resetKey) {
          currentReset = options.current.resetKey;
          group.rotation.set(0, 0, 0);
          group.position.set(0, 0, 0);
          group.scale.setScalar(1);
          previousScroll = 0;
          pointer.x = 0; pointer.y = 0;
          sculpture.rotation.set(0.3, -0.45, 0.28);
          satellites.rotation.set(0, 0, 0);
          orbitals.rotation.set(0, 0, 0);
          controls.reset();
          resize();
        }
        wake();
        canvas.setAttribute("aria-label", interactive
          ? "Interactive " + currentFinish + " " + currentShape + " sculpture. Drag or use arrow keys to rotate. Press Home to reset."
          : currentFinish + " " + currentShape + " sculpture.");
      };
      // Apply an initial finish even when the component starts in a custom mode.
      currentFinish = "" as SculptureFinish;
      sync.current = update;
      const onKey = (event: KeyboardEvent) => {
        if (!interactive) return;
        const delta = 0.12;
        if (event.key === "ArrowLeft") group.rotation.y -= delta;
        else if (event.key === "ArrowRight") group.rotation.y += delta;
        else if (event.key === "ArrowUp") group.rotation.x -= delta;
        else if (event.key === "ArrowDown") group.rotation.x += delta;
        else if (event.key === "Home") {
          group.rotation.set(0, 0, 0);
          controls.reset();
        } else return;
        event.preventDefault();
        render();
      };
      const onLost = (event: Event) => {
        event.preventDefault();
        lostContext = true;
        canvas.tabIndex = -1;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        if (!disposed) setState("fallback");
      };
      const onPointer = (event: PointerEvent) => {
        if (variant !== "hero" || !finePointer.matches || !options.current.motionEnabled) return;
        const bounds = element.getBoundingClientRect();
        pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        pointer.y = (0.5 - (event.clientY - bounds.top) / bounds.height) * 2;
      };
      const onLeave = () => { pointer.x = 0; pointer.y = 0; };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      const intersection = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? true;
        wake();
      }, { threshold: 0.01 });
      intersection.observe(element);
      controls.addEventListener("change", render);
      canvas.addEventListener("keydown", onKey);
      canvas.addEventListener("webglcontextlost", onLost);
      document.addEventListener("visibilitychange", wake);
      motion.addEventListener("change", wake);
      element.addEventListener("pointermove", onPointer);
      element.addEventListener("pointerleave", onLeave);
      if (variant === "hero") window.addEventListener("scroll", onScroll, { passive: true });
      disposeScene = () => {
        if (frame) cancelAnimationFrame(frame);
        observer.disconnect();
        intersection.disconnect();
        controls.removeEventListener("change", render);
        controls.dispose();
        canvas.removeEventListener("keydown", onKey);
        canvas.removeEventListener("webglcontextlost", onLost);
        document.removeEventListener("visibilitychange", wake);
        motion.removeEventListener("change", wake);
        element.removeEventListener("pointermove", onPointer);
        element.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", onScroll);
        sculpture.geometry.dispose();
        material.dispose();
        satelliteGeometry.dispose();
        satelliteMaterial.dispose();
        orbitGeometry.dispose(); orbitMaterial.dispose();
        dustGeometry.dispose(); dustMaterial.dispose();
        environment.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
        sync.current = null;
      };
      update();
      resize();
      setState("ready");
    };
    const lazy = new IntersectionObserver(entries => {
      if (!started && entries.some(entry => entry.isIntersecting)) {
        started = true;
        lazy.disconnect();
        initialize().catch(() => {
          if (!disposed) { disposeScene?.(); setState("fallback"); }
        });
      }
    }, { rootMargin: "180px" });
    lazy.observe(element);
    return () => {
      disposed = true;
      lazy.disconnect();
      disposeScene?.();
      sync.current = null;
    };
  }, [interactive, variant]);

  return <div className={"scene-wrapper " + className} data-scene-state={state} data-scene-variant={variant}>
    <div className="scene-host" ref={host} />
    {state !== "ready" && <div className="scene-fallback" aria-label="Sculptural orbital illustration">
      <span /><span /><span /><i />
    </div>}
    {state === "fallback" && <p className="scene-fallback-caption">Sculpture preview · 3D is unavailable on this device.</p>}
  </div>;
}
