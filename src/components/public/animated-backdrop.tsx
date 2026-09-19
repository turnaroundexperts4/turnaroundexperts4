"use client";

import { useEffect, useRef } from "react";

/**
 * TAE animated background.
 * A subtle network of nodes representing interconnected businesses/systems.
 * Reacts gently to cursor + scroll. Degrades on prefers-reduced-motion.
 */
export function AnimatedBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const state = {
      mouse: { x: -9999, y: -9999, active: false },
      scroll: 0,
      width: 0,
      height: 0,
      nodes: [] as {
        x: number;
        y: number;
        vx: number;
        vy: number;
        r: number;
        baseR: number;
      }[],
    };

    function resize() {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      state.width = rect.width;
      state.height = rect.height;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = rect.width * rect.height;
      const target = reduce ? 0 : Math.min(80, Math.max(28, Math.floor(area / 22000)));
      state.nodes = new Array(target).fill(0).map(() => spawnNode(rect.width, rect.height));
    }

    function spawnNode(w: number, h: number) {
      const r = 1.1 + Math.random() * 1.6;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r,
        baseR: r,
      };
    }

    function tick() {
      if (!ctx) return;
      const { width: w, height: h, nodes, mouse } = state;
      ctx.clearRect(0, 0, w, h);

      // Soft navy gradient wash
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "rgba(15, 23, 42, 0.0)");
      g.addColorStop(1, "rgba(15, 23, 42, 0.18)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      if (reduce) {
        return;
      }

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy + state.scroll * 0.005;
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;

        // Mouse interactivity
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) {
            const dist = Math.sqrt(d2) || 1;
            const force = (160 - dist) / 160;
            n.vx += -(dx / dist) * force * 0.02;
            n.vy += -(dy / dist) * force * 0.02;
            n.r = n.baseR + force * 0.8;
          } else {
            n.r = n.baseR;
          }
        }
        // Clamp velocity
        n.vx = Math.max(-0.4, Math.min(0.4, n.vx));
        n.vy = Math.max(-0.4, Math.min(0.4, n.vy));
      }

      // Draw connections
      const maxDist = Math.min(180, Math.max(110, w * 0.12));
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.16;
            ctx.strokeStyle = `rgba(200, 211, 234, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(226, 232, 240, 0.65)";
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    function onMouseMove(e: MouseEvent) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
      state.mouse.active = true;
    }
    function onMouseLeave() {
      state.mouse.active = false;
    }
    function onScroll() {
      state.scroll = window.scrollY * 0.1;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, transparent 0%, transparent 40%, rgba(15,23,42,0.45) 100%)",
        }}
      />
    </div>
  );
}
