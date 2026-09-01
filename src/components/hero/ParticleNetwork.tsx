"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../theme/ThemeProvider";

interface ParticleNetworkProps {
  className?: string;
}

export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 340;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particles Setup (38 nodes)
    const particleCount = 38;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];
    const colors = new Float32Array(particleCount * 3);

    const isLight = theme === "light";

    // Adaptive color palette based on theme
    const amberColor = new THREE.Color(isLight ? "#D97706" : "#F2A623");
    const mutedColor = new THREE.Color(isLight ? "#4B5563" : "#8E8E8A");
    const darkMutedColor = new THREE.Color(isLight ? "#9CA3AF" : "#4A4A47");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.008,
      });

      // 1 out of 6 is amber, others are muted
      const chosenColor =
        i % 6 === 0 ? amberColor : i % 3 === 0 ? mutedColor : darkMutedColor;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Custom circular particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? "#111827" : "#ffffff";
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: isLight ? 0.95 : 0.9,
      alphaTest: 0.1,
    });

    const pointCloud = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointCloud);

    // Lines Setup
    const maxLineSegments = particleCount * particleCount;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineColors = new Float32Array(maxLineSegments * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3).setUsage(
        THREE.DynamicDrawUsage
      )
    );
    linesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    );

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: isLight ? 0.75 : 0.65,
      blending: isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    const lineSegments = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(lineSegments);

    // Mouse Interaction
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const connectionDist = 6.2;
    const mouseInfluenceRadius = 7.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate point cloud subtly
      pointCloud.rotation.y += 0.001;
      lineSegments.rotation.y = pointCloud.rotation.y;

      const posAttr = pointsGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      let lineIndex = 0;

      // Update particle positions and line connections
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position update
        posArray[i3] += velocities[i].x;
        posArray[i3 + 1] += velocities[i].y;
        posArray[i3 + 2] += velocities[i].z;

        // Boundary bounce
        if (posArray[i3] > 11 || posArray[i3] < -11) velocities[i].x *= -1;
        if (posArray[i3 + 1] > 8 || posArray[i3 + 1] < -8) velocities[i].y *= -1;
        if (posArray[i3 + 2] > 5 || posArray[i3 + 2] < -5) velocities[i].z *= -1;

        // Cursor proximity reaction
        const dx = posArray[i3] - mouse.x * 10;
        const dy = posArray[i3 + 1] - mouse.y * 8;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        if (distToMouse < mouseInfluenceRadius) {
          const force = (1 - distToMouse / mouseInfluenceRadius) * 0.03;
          posArray[i3] += dx * force;
          posArray[i3 + 1] += dy * force;
        }

        // Connect with nearby particles
        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3;
          const pdist = Math.sqrt(
            (posArray[i3] - posArray[j3]) ** 2 +
              (posArray[i3 + 1] - posArray[j3 + 1]) ** 2 +
              (posArray[i3 + 2] - posArray[j3 + 2]) ** 2
          );

          if (pdist < connectionDist) {
            const alpha = 1.0 - pdist / connectionDist;
            const isSpecial = i % 6 === 0 || j % 6 === 0;

            const lPos = linePositions;
            const lCol = lineColors;

            // Start point
            lPos[lineIndex * 6] = posArray[i3];
            lPos[lineIndex * 6 + 1] = posArray[i3 + 1];
            lPos[lineIndex * 6 + 2] = posArray[i3 + 2];

            // End point
            lPos[lineIndex * 6 + 3] = posArray[j3];
            lPos[lineIndex * 6 + 4] = posArray[j3 + 1];
            lPos[lineIndex * 6 + 5] = posArray[j3 + 2];

            // Color
            if (isSpecial) {
              lCol[lineIndex * 6] = (isLight ? 0.85 : 0.95) * alpha;
              lCol[lineIndex * 6 + 1] = (isLight ? 0.45 : 0.65) * alpha;
              lCol[lineIndex * 6 + 2] = (isLight ? 0.02 : 0.14) * alpha;

              lCol[lineIndex * 6 + 3] = (isLight ? 0.85 : 0.95) * alpha;
              lCol[lineIndex * 6 + 4] = (isLight ? 0.45 : 0.65) * alpha;
              lCol[lineIndex * 6 + 5] = (isLight ? 0.02 : 0.14) * alpha;
            } else {
              const grey = isLight ? (0.6 - 0.3 * alpha) : (0.25 * alpha);
              lCol[lineIndex * 6] = grey;
              lCol[lineIndex * 6 + 1] = grey;
              lCol[lineIndex * 6 + 2] = grey;

              lCol[lineIndex * 6 + 3] = grey;
              lCol[lineIndex * 6 + 4] = grey;
              lCol[lineIndex * 6 + 5] = grey;
            }

            lineIndex++;
          }
        }
      }

      posAttr.needsUpdate = true;
      linesGeometry.setDrawRange(0, lineIndex * 2);
      linesGeometry.attributes.position.needsUpdate = true;
      linesGeometry.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[340px] relative overflow-hidden rounded-lg border border-[#1E1E1E] bg-[#0A0A0A]/90 ${
        className || ""
      }`}
    >
      <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 text-[10px] font-mono text-muted/80 bg-[#121212]/80 px-2 py-0.5 rounded border border-[#222222]">
        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
        <span>THREE.JS // RAG_GRAPH_ACTIVE</span>
      </div>
      <div className="absolute bottom-3 left-4 z-10 text-[10px] font-mono text-muted-dark">
        <span>Cursor Proximity Reactivity Enabled</span>
      </div>
    </div>
  );
};
