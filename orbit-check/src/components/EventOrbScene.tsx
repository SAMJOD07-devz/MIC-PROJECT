"use client";

import React, { useEffect, useRef, useState } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  speed: number;
  orbitRadius: number;
  angle: number;
}

export function EventOrbScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasWebGLSupport, setHasWebGLSupport] = useState(true);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setHasWebGLSupport(false);
      return;
    }

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize 3D Constellation Nodes
    const nodes: Node3D[] = [];
    const colors = ["#06B6D4", "#3B82F6", "#6366F1", "#8B5CF6", "#10B981"];
    const nodeCount = 18;

    for (let i = 0; i < nodeCount; i++) {
      const orbitRadius = 40 + (i * 9);
      nodes.push({
        x: 0,
        y: 0,
        z: (Math.random() - 0.5) * 100,
        radius: Math.random() * 2.5 + 1.5,
        color: colors[i % colors.length],
        speed: (Math.random() * 0.008 + 0.004) * (i % 2 === 0 ? 1 : -1),
        orbitRadius,
        angle: (i * Math.PI * 2) / nodeCount,
      });
    }

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Central Luminous Core Orb
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        5,
        centerX,
        centerY,
        75
      );
      gradient.addColorStop(0, "rgba(6, 182, 212, 0.9)");
      gradient.addColorStop(0.4, "rgba(99, 102, 241, 0.4)");
      gradient.addColorStop(1, "rgba(15, 23, 42, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, 75, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw Orbital Ring 1
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 90, 35, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.25)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Draw Orbital Ring 2
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, 120, 50, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99, 102, 241, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Orbiting Event Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!isReducedMotion) {
          node.angle += node.speed;
        }

        const x = centerX + Math.cos(node.angle) * node.orbitRadius;
        const y = centerY + Math.sin(node.angle) * (node.orbitRadius * 0.45);

        // Draw connecting line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(6, 182, 212, 0.08)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Node Glow
        ctx.beginPath();
        ctx.arc(x, y, node.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.2;
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Node Core
        ctx.beginPath();
        ctx.arc(x, y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
      }

      if (!isReducedMotion) {
        rotationAngle += 0.005;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isReducedMotion]);

  if (!hasWebGLSupport) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-900/20 via-indigo-950/40 to-slate-950 border border-cyan-500/20">
        <div className="h-24 w-24 rounded-full bg-cyan-500/20 blur-xl"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 sm:h-72 flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 backdrop-blur-md">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-4 flex items-center gap-2 text-[10px] font-semibold text-cyan-400 uppercase tracking-widest bg-slate-900/80 px-2.5 py-1 rounded-full border border-cyan-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        Live Event Network Mesh
      </div>
    </div>
  );
}
