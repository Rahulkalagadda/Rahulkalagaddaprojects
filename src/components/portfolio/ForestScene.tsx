"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionSettings } from "./MotionProvider";

export type ForestLight = "moonlight" | "sunrise";
interface ForestSceneProps {
  variant?: "hero" | "lab";
  light?: ForestLight;
  wind?: number;
  fireflies?: boolean;
  mist?: boolean;
  running?: boolean;
  userMotion?: boolean;
  resetKey?: number;
}

/** A self-hosted, textured glTF forest. The photograph remains visible before WebGL is ready. */
export function ForestScene({ variant = "hero", light = "moonlight", wind = 0.8, fireflies = true, mist = true, running = true, userMotion = false, resetKey = 0 }: ForestSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const sync = useRef<(() => void) | null>(null);
  const { enabled } = useMotionSettings();
  const options = useRef({ light, wind, fireflies, mist, running, userMotion, resetKey, enabled });
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");
  const [models, setModels] = useState(0);
  useEffect(() => {
    options.current = { light, wind, fireflies, mist, running, userMotion, resetKey, enabled };
    sync.current?.();
  }, [light, wind, fireflies, mist, running, userMotion, resetKey, enabled]);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let started = false;
    let disposeScene: (() => void) | undefined;
    const initialize = async () => {
      const [THREE, { GLTFLoader }, { OrbitControls }, { MeshoptDecoder }] = await Promise.all([
        import("three"), import("three/examples/jsm/loaders/GLTFLoader.js"), import("three/examples/jsm/controls/OrbitControls.js"), import("three/examples/jsm/libs/meshopt_decoder.module.js"),
      ]);
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      const small = window.innerWidth < 700;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1 : 1.4));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", variant === "lab" ? "Interactive realistic 3D forest. Drag or use arrow keys to look around. Press Home to reset the view." : "Moonlit three-dimensional pine trees, ferns, mossy rocks, and drifting fireflies.");
      canvas.tabIndex = variant === "lab" ? 0 : -1;
      canvas.style.touchAction = "pan-y";
      element.appendChild(canvas);
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x10291e, 0.04);
      const camera = new THREE.PerspectiveCamera(small ? 48 : 40, 1, 0.1, 65);
      const homePosition = new THREE.Vector3(0, variant === "hero" ? 3.4 : 3.9, variant === "hero" ? 11.8 : 13.2);
      const target = new THREE.Vector3(0, 2.1, -0.7);
      camera.position.copy(homePosition);
      const controls = new OrbitControls(camera, canvas);
      controls.target.copy(target);
      controls.enabled = variant === "lab";
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = false;
      controls.rotateSpeed = 0.4;
      controls.minAzimuthAngle = -0.6;
      controls.maxAzimuthAngle = 0.6;
      controls.minPolarAngle = 0.8;
      controls.maxPolarAngle = 1.5;
      controls.update();
      const hemisphere = new THREE.HemisphereLight(0xb5d8ee, 0x24432a, 1.65);
      const moon = new THREE.DirectionalLight(0xbedcff, 2.7);
      moon.position.set(-3, 9, 5);
      const rim = new THREE.DirectionalLight(0xbdffb7, 1.8);
      rim.position.set(5, 6, -4);
      scene.add(hemisphere, moon, rim);
      const trees: { object: InstanceType<typeof THREE.Group>; phase: number; lean: number }[] = [];
      const resources = new Set<InstanceType<typeof THREE.Object3D>>();
      const ground = new THREE.Mesh(new THREE.CircleGeometry(11, 48), new THREE.MeshStandardMaterial({ color: 0x122d19, roughness: 1, transparent: true, opacity: variant === "hero" ? 0.24 : 0.7, depthWrite: false }));
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(0, -0.035, -1);
      scene.add(ground); resources.add(ground);
      let frame = 0;
      let visible = true;
      let lostContext = false;
      let previousTime = 0;
      let lastRenderTime = 0;
      let elapsed = 0;
      let scroll = 0;
      let currentScroll = 0;
      let currentReset = options.current.resetKey;
      const pointer = { x: 0, y: 0 };
      const render = () => { if (!disposed && !lostContext) renderer.render(scene, camera); };
      const canAnimate = () => !disposed && !lostContext && visible && !document.hidden && options.current.running && (options.current.enabled || options.current.userMotion);

      // A soft circular glow, rather than square point sprites, gives the fireflies their light.
      const flyCount = small ? 24 : 48;
      const flyPositions = new Float32Array(flyCount * 3);
      const flyPhase = new Float32Array(flyCount);
      for (let i = 0; i < flyCount; i++) {
        flyPositions[i * 3] = Math.sin(i * 2.399) * (2.5 + i % 4);
        flyPositions[i * 3 + 1] = 0.5 + (i % 9) * 0.36;
        flyPositions[i * 3 + 2] = -5 + (i % 7) * 1.4;
        flyPhase[i] = i * 1.7;
      }
      const flyGeometry = new THREE.BufferGeometry();
      flyGeometry.setAttribute("position", new THREE.BufferAttribute(flyPositions, 3));
      flyGeometry.setAttribute("phase", new THREE.BufferAttribute(flyPhase, 1));
      const flyMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { time: { value: 0 }, strength: { value: 1 } },
        vertexShader: `attribute float phase; uniform float time; varying float glow; void main(){ vec3 p=position; p.x+=sin(time*.22+phase)*.24; p.y+=sin(time*.35+phase)*.16; glow=.4+.6*pow(.5+.5*sin(time*.7+phase),2.); vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=clamp(85./-mv.z,3.,15.); gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `uniform float strength; varying float glow; void main(){ float d=length(gl_PointCoord-.5)*2.; float a=pow(max(0.,1.-d),3.)*glow*strength; gl_FragColor=vec4(0.87,1.,0.48,a); }`,
      });
      const flies = new THREE.Points(flyGeometry, flyMaterial);
      flies.renderOrder = 5;
      scene.add(flies); resources.add(flies);

      // Low-opacity mist lives in the scene at several depths, so camera movement reveals parallax.
      const mistGroup = new THREE.Group();
      const mistMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { time: { value: 0 }, tint: { value: new THREE.Color(0x9bbeb1) } },
        vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec2 vUv; uniform float time; uniform vec3 tint; void main(){ float edge=sin(vUv.y*3.14159)*pow(sin(vUv.x*3.14159),2.); float wave=.5+.5*sin(vUv.x*18.+time*.06+sin(vUv.y*8.)); gl_FragColor=vec4(tint,edge*(.035+wave*.035)); }`,
      });
      for (let i = 0; i < 3; i++) {
        const sheet = new THREE.Mesh(new THREE.PlaneGeometry(20, 3.5), mistMaterial);
        sheet.position.set(i % 2 ? -2 : 1, 1.1 + i * 0.15, -6 + i * 3.2);
        mistGroup.add(sheet);
      }
      scene.add(mistGroup); resources.add(mistGroup);
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, -0.16); leafShape.bezierCurveTo(-0.18, -0.03, -0.12, 0.14, 0, 0.24); leafShape.bezierCurveTo(0.12, 0.1, 0.16, -0.05, 0, -0.16);
      const leafGeometry = new THREE.ShapeGeometry(leafShape, 6);
      const leaves = new THREE.Group();
      for (let i = 0; i < (small ? 7 : 13); i++) {
        const leaf = new THREE.Mesh(leafGeometry, new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xa8b75f : 0x5b7a39, side: THREE.DoubleSide, roughness: 0.85 }));
        leaf.scale.setScalar(0.5 + (i % 3) * 0.16);
        leaf.userData.phase = i * 2.39;
        leaves.add(leaf);
      }
      scene.add(leaves); resources.add(leaves);
      const updateLeaves = () => leaves.children.forEach((leaf, i) => {
        const phase = leaf.userData.phase as number;
        leaf.position.set(Math.sin(phase) * 5.6 + Math.sin(elapsed * 0.2 + phase) * options.current.wind * 0.7, 6.8 - ((elapsed * 0.22 + i * 0.6) % 6.5), -1 + (i % 5) * 0.8);
        leaf.rotation.set(elapsed * 0.24 + phase, Math.sin(elapsed * 0.4 + phase) * 1.4, phase + elapsed * 0.16);
      });
      updateLeaves();
      const tick = (time: number) => {
        frame = 0;
        if (!canAnimate()) return;
        const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
        previousTime = time;
        elapsed += dt;
        trees.forEach(({ object, phase, lean }) => { object.rotation.z = lean + Math.sin(elapsed * 0.62 + phase) * 0.013 * options.current.wind; });
        flyMaterial.uniforms.time.value = elapsed;
        mistMaterial.uniforms.time.value = elapsed;
        updateLeaves();
        if (variant === "hero") {
          const follow = 1 - Math.exp(-dt * 3);
          currentScroll = THREE.MathUtils.lerp(currentScroll, scroll, follow);
          camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.26, follow);
          camera.position.y = THREE.MathUtils.lerp(camera.position.y, homePosition.y + pointer.y * 0.13 + currentScroll * 0.25, follow);
          camera.position.z = THREE.MathUtils.lerp(camera.position.z, homePosition.z - currentScroll * 0.65, follow);
          camera.lookAt(target);
          element.style.setProperty("--forest-scroll", String(currentScroll));
          element.style.setProperty("--forest-pointer-x", `${pointer.x * 7}px`);
          element.style.setProperty("--forest-pointer-y", `${pointer.y * 5}px`);
        }
        // Bound GPU work so page scrolling keeps its own animation budget.
        if (time - lastRenderTime >= 1000 / 30) { render(); lastRenderTime = time; }
        frame = requestAnimationFrame(tick);
      };
      const wake = () => {
        render();
        if (canAnimate() && !frame) { previousTime = 0; frame = requestAnimationFrame(tick); }
        else if (!canAnimate() && frame) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; }
      };
      const apply = () => {
        const dawn = options.current.light === "sunrise";
        hemisphere.color.setHex(dawn ? 0xffe4b0 : 0xb5d8ee);
        hemisphere.intensity = dawn ? 2.15 : 1.65;
        moon.color.setHex(dawn ? 0xffbd72 : 0xbedcff);
        moon.intensity = dawn ? 3.4 : 2.7;
        rim.color.setHex(dawn ? 0xcbe398 : 0xbdffb7);
        mistMaterial.uniforms.tint.value.setHex(dawn ? 0xdfc89f : 0x9bbeb1);
        flyMaterial.uniforms.strength.value = dawn ? 0.6 : 1;
        flies.visible = options.current.fireflies;
        mistGroup.visible = options.current.mist;
        if (currentReset !== options.current.resetKey) {
          currentReset = options.current.resetKey;
          camera.position.copy(homePosition); controls.target.copy(target); controls.update();
        }
        wake();
      };
      sync.current = apply;
      const resize = () => {
        const width = element.clientWidth, height = element.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height; camera.updateProjectionMatrix(); wake();
      };
      const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(element);
      const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; wake(); }, { threshold: 0.01 }); visibility.observe(element);
      const onVisibility = () => wake();
      const onScroll = () => { const rect = element.getBoundingClientRect(); scroll = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1))); };
      const onPointer = (event: PointerEvent) => {
        if (variant !== "hero" || event.pointerType === "touch" || !options.current.enabled) return;
        const rect = element.getBoundingClientRect();
        pointer.x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
        pointer.y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      };
      const onKey = (event: KeyboardEvent) => {
        if (variant !== "lab" || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "Home") { camera.position.copy(homePosition); controls.target.copy(target); }
        else if (event.key === "ArrowLeft" || event.key === "ArrowRight") camera.position.sub(target).applyAxisAngle(new THREE.Vector3(0, 1, 0), event.key === "ArrowLeft" ? -0.08 : 0.08).add(target);
        else camera.position.y = Math.max(2.5, Math.min(8, camera.position.y + (event.key === "ArrowUp" ? 0.3 : -0.3)));
        controls.update(); render();
      };
      const lost = (event: Event) => { event.preventDefault(); lostContext = true; if (frame) cancelAnimationFrame(frame); frame = 0; setState("fallback"); };
      const restored = () => { lostContext = false; setState("ready"); wake(); };
      canvas.addEventListener("keydown", onKey);
      canvas.addEventListener("webglcontextlost", lost);
      canvas.addEventListener("webglcontextrestored", restored);
      controls.addEventListener("change", render);
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointermove", onPointer, { passive: true });
      const free = (root: InstanceType<typeof THREE.Object3D>) => {
        const geometries = new Set<InstanceType<typeof THREE.BufferGeometry>>();
        const materials = new Set<InstanceType<typeof THREE.Material>>();
        const textures = new Set<InstanceType<typeof THREE.Texture>>();
        root.traverse(object => {
          if (!(object instanceof THREE.Mesh || object instanceof THREE.Points)) return;
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => {
            materials.add(material);
            Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); });
          });
        });
        geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); textures.forEach(texture => texture.dispose());
      };
      disposeScene = () => {
        if (frame) cancelAnimationFrame(frame);
        sync.current = null;
        visibility.disconnect(); sizeObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onPointer);
        canvas.removeEventListener("keydown", onKey); canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
        controls.removeEventListener("change", render); controls.dispose();
        free(scene); resources.forEach(root => { if (!root.parent) free(root); });
        renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
      };
      resize(); apply();
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      const loaded = await Promise.allSettled([loader.loadAsync("/forest/pine.glb"), loader.loadAsync("/forest/fern.glb"), loader.loadAsync("/forest/moss-rock.glb")]);
      if (disposed) { loaded.forEach(result => { if (result.status === "fulfilled") free(result.value.scene); }); return; }
      const normalized = (root: InstanceType<typeof THREE.Group>, height: number) => {
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        root.position.set(-center.x, -box.min.y, -center.z);
        const pivot = new THREE.Group(); pivot.add(root); pivot.scale.setScalar(height / Math.max(size.y, 0.01));
        return pivot;
      };
      loaded.forEach((result, modelIndex) => {
        if (result.status !== "fulfilled") return;
        const model = result.value.scene;
        resources.add(model);
        const placements = modelIndex === 0
          ? (variant === "hero" ? [[5.6, 0, 0, 7.5], [-6.5, 0, -0.5, 7.8], [3.6, 0, -5.2, 7], [-4.2, 0, -6.5, 6.5]] : [[-4.9, 0, 0, 7.4], [4.6, 0, -1, 8.2], [-3.7, 0, -4.7, 7.2], [3.3, 0, -5, 6.8], [-0.8, 0, -8, 6.5]])
          : modelIndex === 1 ? [[-4.4, 0, 3.6, 0.85], [4.1, 0, 3.7, 0.9], [2.4, 0, 2.8, 0.6], [-2.6, 0, 1.8, 0.62], [4.8, 0, -2, 0.8]]
          : [[-3.5, 0, 2.7, 0.5], [3.1, 0, 2.2, 0.55]];
        placements.forEach(([x, y, z, height], i) => {
          const object = normalized(model.clone(true), height);
          object.position.set(x, y, z);
          object.rotation.y = i * 1.79;
          scene.add(object);
          if (modelIndex !== 2) trees.push({ object, phase: i * 2.4, lean: 0 });
        });
      });
      const loadedCount = loaded.filter(result => result.status === "fulfilled").length;
      setModels(loadedCount); setState(loadedCount ? "ready" : "fallback");
      wake();
    };
    const lazy = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !started) {
        started = true; lazy.disconnect();
        initialize().catch(() => { disposeScene?.(); if (!disposed) setState("fallback"); });
      }
    }, { rootMargin: "200px" });
    lazy.observe(element);
    return () => { disposed = true; lazy.disconnect(); disposeScene?.(); };
  }, [variant]);

  return <div ref={host} className={"forest-scene forest-scene-" + variant} data-scene-state={state} data-scene-variant={variant} data-models-loaded={models} data-light={light}>
    <div className="forest-photo" aria-hidden="true" />
    <div className="forest-atmosphere" aria-hidden="true" />
    {state === "fallback" && variant === "lab" && <p className="forest-fallback" role="status">The forest is in still mode. Interactive 3D needs WebGL in your browser.</p>}
  </div>;
}
