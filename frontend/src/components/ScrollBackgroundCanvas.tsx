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

interface WaterDroplet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: [number, number, number];
  huePhase: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: [number, number, number];
  speed: number;
}

const GLYPHS = ['∑', '∫', 'π', '</>', '⚛', 'λ', 'Δ', '∞'];

const WATER_COLORS: Array<[number, number, number]> = [
  [14, 165, 233],  // Cerulean Sky
  [99, 102, 241],  // Deep Indigo
  [20, 184, 166],  // Aqua Teal
  [139, 92, 246],  // Iris Violet
  [56, 189, 248],  // Cyan Splash
  [16, 185, 129]   // Seafoam Mint
];

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
 * Interactive Light-Theme Scroll + Fluid Water Pointer Background Engine:
 * - Multi-color liquid watercolor trail + concentric water surface ripples on mouse movement & click
 * - Buoyant constellation nodes + floating glyphs that part gently around the cursor wake
 * - Color-shifting aurora wave ribbons & ambient section gradients across scroll depth
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

    // Fluid pointer state
    const pointer = {
      x: width * 0.5,
      y: height * 0.4,
      smoothX: width * 0.5,
      smoothY: height * 0.4,
      active: false,
      lastSpawnX: width * 0.5,
      lastSpawnY: height * 0.4,
      lastRippleAt: 0,
      colorStep: 0
    };

    const droplets: WaterDroplet[] = [];
    const ripples: WaterRipple[] = [];

    const pickNextWaterColor = (): [number, number, number] => {
      pointer.colorStep = (pointer.colorStep + 1) % WATER_COLORS.length;
      return WATER_COLORS[pointer.colorStep];
    };

    const spawnWaterWake = (x: number, y: number, dx: number, dy: number, forceRipple = false) => {
      const color = pickNextWaterColor();
      const speed = Math.hypot(dx, dy);

      if (droplets.length >= 52) droplets.shift();
      droplets.push({
        x,
        y,
        vx: Math.max(-2.6, Math.min(2.6, dx * 0.085)) + (Math.random() - 0.5) * 0.5,
        vy: Math.max(-2.6, Math.min(2.6, dy * 0.085)) + (Math.random() - 0.5) * 0.5,
        radius: 30 + Math.min(20, speed * 0.35),
        maxRadius: 130 + Math.min(85, speed * 1.2),
        alpha: 0.42,
        color,
        huePhase: Math.random() * Math.PI * 2
      });

      const now = performance.now();
      if (forceRipple || (speed > 3 && now - pointer.lastRippleAt > 80)) {
        pointer.lastRippleAt = now;
        if (ripples.length >= 22) ripples.shift();
        ripples.push({
          x,
          y,
          radius: 8,
          maxRadius: forceRipple ? 190 : 120 + Math.min(60, speed * 1.15),
          alpha: forceRipple ? 0.58 : 0.42,
          color,
          speed: forceRipple ? 2.8 : 2.2
        });
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const prevX = pointer.x;
      const prevY = pointer.y;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;

      const moveDist = Math.hypot(pointer.x - pointer.lastSpawnX, pointer.y - pointer.lastSpawnY);
      if (moveDist >= 10) {
        spawnWaterWake(pointer.x, pointer.y, pointer.x - prevX, pointer.y - prevY, false);
        pointer.lastSpawnX = pointer.x;
        pointer.lastSpawnY = pointer.y;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      // Layered triple water splash ripple on click
      spawnWaterWake(e.clientX, e.clientY, 0, 0, true);
      const splashColor = pickNextWaterColor();
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 2,
        maxRadius: 130,
        alpha: 0.44,
        color: splashColor,
        speed: 2.2
      });
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });

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

      // Smoothly interpolate scroll metrics & pointer position
      const cur = smoothScrollRef.current;
      const tgt = targetScrollRef.current;
      cur.progress += (tgt.progress - cur.progress) * 0.1;
      cur.scrollY += (tgt.scrollY - cur.scrollY) * 0.1;
      cur.velocity += (tgt.velocity - cur.velocity) * 0.14;
      tgt.velocity *= 0.88;

      pointer.smoothX += (pointer.x - pointer.smoothX) * 0.16;
      pointer.smoothY += (pointer.y - pointer.smoothY) * 0.16;

      if (frameCount % 2 === 0) {
        setScroll({ progress: cur.progress, scrollY: cur.scrollY, velocity: cur.velocity });
      }

      if (ctx && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        const p = cur.progress;
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

        // 1. Live Fluid Watercolor Pointer Trail Blobs
        for (let i = droplets.length - 1; i >= 0; i--) {
          const d = droplets[i];
          d.x += d.vx + Math.sin(time * 2.2 + d.huePhase) * 0.35;
          d.y += d.vy + Math.cos(time * 1.9 + d.huePhase) * 0.35;
          d.vx *= 0.96;
          d.vy *= 0.96;
          d.radius += (d.maxRadius - d.radius) * 0.045 + 0.6;
          d.alpha *= 0.962;

          if (d.alpha < 0.012 || d.radius >= d.maxRadius) {
            droplets.splice(i, 1);
            continue;
          }

          const [r, g, b] = d.color;
          const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${(d.alpha * 0.72).toFixed(3)})`);
          grad.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, ${(d.alpha * 0.32).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Subtle continuous liquid glow right beneath pointer when hovering
        if (pointer.active) {
          const hoverColor = WATER_COLORS[Math.floor(time * 0.6) % WATER_COLORS.length];
          const [hr, hg, hb] = hoverColor;
          const auraR = 95 + Math.sin(time * 3) * 10;
          const hoverGrad = ctx.createRadialGradient(
            pointer.smoothX,
            pointer.smoothY,
            0,
            pointer.smoothX,
            pointer.smoothY,
            auraR
          );
          hoverGrad.addColorStop(0, `rgba(${hr}, ${hg}, ${hb}, 0.22)`);
          hoverGrad.addColorStop(0.6, `rgba(${hr}, ${hg}, ${hb}, 0.08)`);
          hoverGrad.addColorStop(1, `rgba(${hr}, ${hg}, ${hb}, 0)`);
          ctx.fillStyle = hoverGrad;
          ctx.beginPath();
          ctx.arc(pointer.smoothX, pointer.smoothY, auraR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Expanding Concentric Water Surface Ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rp = ripples[i];
          rp.radius += rp.speed;
          rp.alpha *= 0.952;

          if (rp.alpha < 0.015 || rp.radius >= rp.maxRadius) {
            ripples.splice(i, 1);
            continue;
          }

          const [r, g, b] = rp.color;
          // Outer primary crest
          ctx.beginPath();
          ctx.arc(rp.x, rp.y, rp.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${rp.alpha.toFixed(3)})`;
          ctx.lineWidth = Math.max(0.8, 2.4 * (1 - rp.radius / rp.maxRadius));
          ctx.stroke();

          // Inner secondary harmonic ring
          if (rp.radius > 22) {
            ctx.beginPath();
            ctx.arc(rp.x, rp.y, rp.radius * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(rp.alpha * 0.5).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // 3. Flowing Multi-Band Aurora Sine Waves across section transitions
        for (let band = 0; band < 3; band++) {
          ctx.beginPath();
          const baseY = height * (0.28 + band * 0.25) + Math.sin(p * Math.PI * 2 + band) * 45;
          const amp = 34 + band * 14 + Math.min(26, Math.abs(cur.velocity) * 1.1);
          const freq = 0.0028 + band * 0.0009;
          const phase = time * (0.65 + band * 0.22) + p * (6 + band * 3);

          ctx.moveTo(0, baseY);
          for (let x = 0; x <= width; x += 24) {
            const distFromPointer = pointer.active
              ? Math.max(0, 1 - Math.hypot(x - pointer.smoothX, baseY - pointer.smoothY) / 260)
              : 0;
            const waterLift = Math.sin(time * 4 - x * 0.03) * distFromPointer * 18;
            const y =
              baseY +
              waterLift +
              Math.sin(x * freq + phase) * amp +
              Math.cos(x * freq * 0.55 - phase * 0.8) * (amp * 0.45);
            ctx.lineTo(x, y);
          }

          ctx.strokeStyle = band % 2 === 0 ? primary : secondary;
          ctx.globalAlpha = 0.14 - band * 0.025;
          ctx.lineWidth = 2.2;
          ctx.stroke();

          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          ctx.globalAlpha = 0.024;
          ctx.fillStyle = band % 2 === 0 ? primary : secondary;
          ctx.fill();
        }

        // 4. Knowledge Constellation Nodes pushed gently by Water Wake
        const scrollShiftY = -cur.velocity * 0.22;
        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          if (pointer.active) {
            const dx = pt.x - pointer.smoothX;
            const dy = pt.y - pointer.smoothY;
            const d = Math.hypot(dx, dy);
            if (d > 1 && d < 140) {
              const force = (1 - d / 140) * 0.55;
              pt.x += (dx / d) * force;
              pt.y += (dy / d) * force;
            }
          }

          pt.x += pt.vx + Math.sin(time + pt.phase) * 0.15;
          pt.y += pt.vy + scrollShiftY;

          if (pt.x < -30) pt.x = width + 30;
          if (pt.x > width + 30) pt.x = -30;
          if (pt.y < -30) pt.y = height + 30;
          if (pt.y > height + 30) pt.y = -30;
        }

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
              ctx.globalAlpha = (1 - dist / maxDist) * 0.16;
              ctx.stroke();
            }
          }
        }

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
            ctx.globalAlpha = 0.25;
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
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const p = scroll.progress;
  const activeChapterIdx = SECTION_LABELS.reduce(
    (best, sec, idx) => (p >= sec.at - 0.08 ? idx : best),
    0
  );

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

      {/* Isolated Foreground-Underlay Stack */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
      >
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

        {/* Interactive Water Ripple, Fluid Watercolor Trail & Constellation Canvas */}
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
