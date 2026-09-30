"use client";

import { useEffect, useRef, useState } from "react";
export type SculptureShape = "knot" | "orbit" | "sphere";
export type SculptureFinish = "chrome" | "cobalt" | "pearl";
interface SceneProps {
  shape?: SculptureShape;
  finish?: SculptureFinish;
  speed?: number;
  running?: boolean;
  userMotion?: boolean;
  resetKey?: number;
  interactive?: boolean;
  className?: string;
}

export function Scene({
  shape = "knot", finish = "chrome", speed = 1, running = true,
  userMotion = false, resetKey = 0, interactive = true, className = "",
}: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const sync = useRef<(() => void) | null>(null);
  const options = useRef({ shape, finish, speed, running, userMotion, resetKey });
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    options.current = { shape, finish, speed, running, userMotion, resetKey };
    sync.current?.();
  }, [shape, finish, speed, running, userMotion, resetKey]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let disposeScene: (() => void) | undefined;
    const initialize = async () => {
      const [THREE, { RoomEnvironment }, { OrbitControls }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
        import("three/examples/jsm/controls/OrbitControls.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
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
      let frame = 0;
      let visible = true;
      let previousTime = 0;
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
      const createGeometry = (kind: SculptureShape) => {
        if (kind === "orbit") return new THREE.TorusGeometry(1.28, 0.42, 32, 160);
        if (kind === "sphere") return new THREE.IcosahedronGeometry(1.65, 3);
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
      const controls = new OrbitControls(camera, canvas);
      controls.enabled = interactive;
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = false;
      controls.rotateSpeed = 0.55;
      const canAnimate = () => visible && !document.hidden && options.current.running && (!motion.matches || options.current.userMotion);
      const render = () => { if (!disposed) renderer.render(scene, camera); };
      const tick = (time: number) => {
        frame = 0;
        if (disposed) return;
        const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.06) : 0;
        previousTime = time;
        if (canAnimate()) {
          group.rotation.y += dt * options.current.speed * 0.24;
          group.rotation.x += dt * options.current.speed * 0.035;
          satellites.rotation.z -= dt * options.current.speed * 0.12;
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
      const resize = () => {
        if (disposed) return;
        const width = Math.max(element.clientWidth, 1);
        const height = Math.max(element.clientHeight, 1);
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = camera.aspect < 0.8 ? 8 : 6.8;
        camera.updateProjectionMatrix();
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
          material.color.set(currentFinish === "cobalt" ? 0x284aff : currentFinish === "pearl" ? 0xf0e8d8 : 0xdce1ec);
          material.metalness = currentFinish === "pearl" ? 0.15 : 1;
          material.roughness = currentFinish === "pearl" ? 0.25 : currentFinish === "cobalt" ? 0.2 : 0.16;
        }
        if (currentReset !== options.current.resetKey) {
          currentReset = options.current.resetKey;
          group.rotation.set(0, 0, 0);
          sculpture.rotation.set(0.3, -0.45, 0.28);
          satellites.rotation.set(0, 0, 0);
          controls.reset();
          resize();
        }
        wake();
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
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        if (!disposed) setState("fallback");
      };
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
        sculpture.geometry.dispose();
        material.dispose();
        satelliteGeometry.dispose();
        satelliteMaterial.dispose();
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
    initialize().catch(() => {
      if (!disposed) {
        disposeScene?.();
        setState("fallback");
      }
    });
    return () => {
      disposed = true;
      disposeScene?.();
      sync.current = null;
    };
  }, [interactive]);

  return <div className={"scene-wrapper " + className} data-scene-state={state}>
    <div className="scene-host" ref={host} />
    {state !== "ready" && <div className="scene-fallback" aria-label="Sculptural orbital illustration">
      <span /><span /><span /><i />
    </div>}
    {state === "fallback" && <p className="scene-fallback-caption">Sculpture preview · 3D is unavailable on this device.</p>}
  </div>;
}
