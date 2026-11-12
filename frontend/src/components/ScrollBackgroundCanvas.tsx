'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollMetrics {
  progress: number;
  scrollY: number;
  velocity: number;
}

interface KnowledgeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  glyph?: string;
  phase: number;
}

const GLYPHS = ['∑', '∫', 'π', '</>', '⚛', 'λ', 'Δ', '∞'];

const SECTION_LABELS = [
  { id: 'hero', label: 'Overview', at: 0 },
  { id: 'workflow', label: 'How It Works', at: 0.22 },
  { id: 'streams', label: 'Streams', at: 0.44 },
  { id: 'compare', label: 'Focus Mode', at: 0.64 },
  { id: 'lectures', label: 'Lectures', at: 0.84 }
];

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): string {
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Rich Light-Theme Scroll-Reactive Background Engine:
 * - Animated HTML5 canvas with connected knowledge constellation, floating glyphs, & flowing aurora wave ribbons
 * - Color-shifting ambient section washes as the learner scrolls from section to section
 * - Scroll progress indicator + floating section chapter rail (desktop)
 */
export function ScrollBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scroll, setScroll] = useState<ScrollMetrics>({ progress: 0, scrollY: 0, velocity: 0 });

  const targetScrollRef = useRef<ScrollMetrics>({ progress: 0, scrollY: 0, velocity: 0 });
  const smoothScrollRef = useRef<ScrollMetrics>({ progress: 0, scrollY: 0, velocity: 0 });
  const lastYRef = useRef(0);

  useEffect(() => {
    const updateTarget = () => {
      const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const y = window.scrollY || 0;
      const delta = y - lastYRef.current;
      lastYRef.current = y;
      targetScrollRef.current = {
        progress: Math.min(1, Math.max(0, y / docHeight)),
        scrollY: y,
        velocity: Math.max(-45, Math.min(45, delta))
      };
    };

    updateTarget();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize floating knowledge particles & symbols
    const particleCount = width < 768 ? 22 : 40;
    const particles: KnowledgeParticle[] = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.35,
      radius: i % 5 === 0 ? 4 : 2.2 + Math.random() * 1.5,
      glyph: i % 5 === 0 ? GLYPHS[i % GLYPHS.length] : undefined,
      phase: Math.random() * Math.PI * 2
    }));

    let frameCount = 0;
    let rafId = 0;
    let time = 0;

    const render = () => {
      time += 0.016;
      frameCount += 1;

      // Smoothly interpolate scroll progress & decay scroll velocity
      const cur = smoothScrollRef.current;
      const tgt = targetScrollRef.current;
      cur.progress += (tgt.progress - cur.progress) * 0.1;
      cur.scrollY += (tgt.scrollY - cur.scrollY) * 0.1;
      cur.velocity += (tgt.velocity - cur.velocity) * 0.14;
      tgt.velocity *= 0.88;

      if (frameCount % 2 === 0) {
        setScroll({ progress: cur.progress, scrollY: cur.scrollY, velocity: cur.velocity });
      }

      if (ctx && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        const p = cur.progress;
        // Shift primary palette cleanly across sections:
        // Indigo -> Emerald/Teal -> Violet -> Sky -> Warm Amber/Indigo
        const palette: Array<[number, number, number]> = [
          [79, 70, 229],  // Indigo
          [14, 165, 233], // Sky
          [16, 185, 129], // Emerald
          [124, 58, 237], // Violet
          [245, 158, 11]  // Amber
        ];
        const scaled = p * (palette.length - 1);
        const idx = Math.min(palette.length - 2, Math.floor(scaled));
        const localT = scaled - idx;
        const primary = lerpColor(palette[idx], palette[idx + 1], localT);
        const secondary = lerpColor(palette[(idx + 1) % palette.length], palette[(idx + 2) % palette.length], localT);

        // 1. Flowing multi-band aurora sine waves that ripple faster during section scrolls
        for (let band = 0; band < 3; band++) {
          ctx.beginPath();
          const baseY = height * (0.28 + band * 0.25) + Math.sin(p * Math.PI * 2 + band) * 45;
          const amp = 34 + band * 14 + Math.min(26, Math.abs(cur.velocity) * 1.1);
          const freq = 0.0028 + band * 0.0009;
          const phase = time * (0.65 + band * 0.22) + p * (6 + band * 3);

          ctx.moveTo(0, baseY);
          for (let x = 0; x <= width; x += 24) {
            const y =
              baseY +
              Math.sin(x * freq + phase) * amp +
              Math.cos(x * freq * 0.55 - phase * 0.8) * (amp * 0.45);
            ctx.lineTo(x, y);
          }

          ctx.strokeStyle = band % 2 === 0 ? primary : secondary;
          ctx.globalAlpha = 0.14 - band * 0.025;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Soft fill ribbon beneath each wave
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.globalAlpha = 0.028;
          ctx.fillStyle = band % 2 === 0 ? primary : secondary;
          ctx.fill();
        }

        // 2. Knowledge constellation nodes + connecting mesh + educational glyphs
        const scrollShiftY = -cur.velocity * 0.22;
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          pt.x += pt.vx + Math.sin(time + pt.phase) * 0.15;
          pt.y += pt.vy + scrollShiftY;

          if (pt.x < -30) pt.x = width + 30;
          if (pt.x > width + 30) pt.x = -30;
          if (pt.y < -30) pt.y = height + 30;
          if (pt.y > height + 30) pt.y = -30;
        }

        // Draw connecting edges between close nodes
        const maxDist = width < 768 ? 115 : 155;
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < maxDist) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = primary;
              ctx.globalAlpha = (1 - dist / maxDist) * 0.18;
              ctx.stroke();
            }
          }
        }

        // Draw particles & academic symbols
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          if (pt.glyph) {
            ctx.font = '600 14px ui-monospace, SFMono-Regular, Menlo, monospace';
            ctx.fillStyle = i % 2 === 0 ? primary : secondary;
            ctx.globalAlpha = 0.28 + Math.sin(time * 1.4 + pt.phase) * 0.08;
            ctx.fillText(pt.glyph, pt.x - 6, pt.y + 5);
          } else {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
            ctx.fillStyle = i % 2 === 0 ? primary : secondary;
            ctx.globalAlpha = 0.26;
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const p = scroll.progress;
  const activeChapterIdx = SECTION_LABELS.reduce(
    (best, sec, idx) => (p >= sec.at - 0.08 ? idx : best),
    0
  );

  // Smooth CSS pastel orbs shifting loudly enough to feel visibly alive behind white cards
  const orb1Bg =
    p < 0.28
      ? 'rgba(129, 140, 248, 0.34)'
      : p < 0.56
        ? 'rgba(45, 212, 191, 0.30)'
        : p < 0.8
          ? 'rgba(167, 139, 250, 0.32)'
          : 'rgba(99, 102, 241, 0.34)';

  const orb2Bg =
    p < 0.32
      ? 'rgba(56, 189, 248, 0.32)'
      : p < 0.66
        ? 'rgba(129, 140, 248, 0.32)'
        : 'rgba(251, 191, 36, 0.26)';

  return (
    <>
      {/* Top Section Reading Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 z-[60] pointer-events-none"
        style={{ width: `${Math.max(3, p * 100)}%` }}
      />

      {/* Isolated Foreground-Underlay Stack (renders ABOVE body's bg-slate-50 and BELOW page z-10 content) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      >
        {/* Soft Shifting Mesh Orbs */}
        <div
          className="absolute w-[560px] h-[560px] rounded-full blur-3xl will-change-transform transition-colors duration-500"
          style={{
            left: `${(-6 + Math.sin(p * Math.PI * 2) * 18).toFixed(1)}%`,
            top: `${(-8 + p * 68).toFixed(1)}%`,
            background: orb1Bg,
            transform: `scale(${(1 + Math.sin(p * Math.PI) * 0.22).toFixed(3)})`
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl will-change-transform transition-colors duration-500"
          style={{
            right: `${(-8 + Math.cos(p * Math.PI * 1.6) * 16).toFixed(1)}%`,
            top: `${(18 + p * 54).toFixed(1)}%`,
            background: orb2Bg,
            transform: `scale(${(0.95 + Math.cos(p * Math.PI) * 0.18).toFixed(3)})`
          }}
        />

        {/* Animated Constellation & Aurora Wave Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Desktop Scroll Section Indicator Pill */}
      <div
        aria-hidden="true"
        className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5 bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 shadow-sm"
      >
        {SECTION_LABELS.map((sec, idx) => {
          const isActive = idx === activeChapterIdx;
          return (
            <div key={sec.id} className="flex items-center justify-end gap-2">
              <span
                className={`text-[11px] font-semibold transition-all duration-300 ${
                  isActive ? 'text-indigo-700 opacity-100 translate-x-0' : 'text-slate-400 opacity-70'
                }`}
              >
                {sec.label}
              </span>
              <span
                className={`rounded-full transition-all duration-300 ${
                  isActive ? 'w-2.5 h-2.5 bg-indigo-600 ring-4 ring-indigo-100' : 'w-2 h-2 bg-slate-300'
                }`}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
