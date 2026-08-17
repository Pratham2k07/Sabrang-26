'use client';

import { useRef, useEffect } from 'react';

export interface LightfallProps {
  colors?: string[];
  backgroundColor?: string;
  speed?: number;
  streakCount?: number;
  streakWidth?: number;
  streakLength?: number;
  glow?: number;
  density?: number;
  twinkle?: number;
  zoom?: number;
  backgroundGlow?: number;
  opacity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface LightStreak {
  x: number;
  y: number;
  length: number;
  speed: number;
  width: number;
  color: string;
  alpha: number;
  phase: number;
}

export default function Lightfall({
  colors = ['#FF5500', '#00D2FF', '#FF007F', '#7C3AED', '#FFB700'],
  backgroundColor = '#030008',
  speed = 1,
  streakCount = 12,
  streakWidth = 1,
  streakLength = 1.4,
  glow = 1,
  density = 1,
  twinkle = 1,
  zoom = 1,
  backgroundGlow = 1,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 1,
  mouseRadius = 0.5,
  className = '',
  style = {},
}: LightfallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  const propsRef = useRef({
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
  });

  useEffect(() => {
    propsRef.current = {
      colors,
      backgroundColor,
      speed,
      streakCount,
      streakWidth,
      streakLength,
      glow,
      density,
      twinkle,
      zoom,
      backgroundGlow,
      opacity,
      mouseInteraction,
      mouseStrength,
      mouseRadius,
    };
  }, [
    colors,
    backgroundColor,
    speed,
    streakCount,
    streakWidth,
    streakLength,
    glow,
    density,
    twinkle,
    zoom,
    backgroundGlow,
    opacity,
    mouseInteraction,
    mouseStrength,
    mouseRadius,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Initialize Lightfall Streaks across full vertical span (-0.2 to 1.4)
    const totalStreaks = Math.floor(streakCount * 8 * density);
    const streaks: LightStreak[] = Array.from({ length: totalStreaks }, (_, i) => ({
      x: Math.random(),
      y: Math.random() * 1.6 - 0.2, // Distributed across top, middle, and bottom
      length: (0.2 + Math.random() * 0.4) * streakLength,
      speed: (0.0018 + Math.random() * 0.0035) * speed,
      width: (1.2 + Math.random() * 2.8) * streakWidth,
      color: colors[i % colors.length],
      alpha: Math.random() * 0.55 + 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!propsRef.current.mouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mouseRef.current.targetX = (e.clientX - rect.left) * scaleX;
      mouseRef.current.targetY = (e.clientY - rect.top) * scaleY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const render = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const p = propsRef.current;

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;

      // Clear background
      ctx.fillStyle = p.backgroundColor;
      ctx.fillRect(0, 0, w, h);

      // Render Ambient Radial Background Glows evenly across entire canvas
      if (p.backgroundGlow > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        p.colors.forEach((c, idx) => {
          const gx = (0.15 + idx * 0.2 + Math.sin(t * 0.3 + idx) * 0.06) * w;
          const gy = (0.2 + idx * 0.15 + Math.cos(t * 0.25 + idx) * 0.08) * h;
          const gr = (0.5 * Math.min(w, h)) * p.backgroundGlow;

          const gGrad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
          gGrad.addColorStop(0, `${c}28`);
          gGrad.addColorStop(0.6, `${c}0B`);
          gGrad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = gGrad;
          ctx.beginPath();
          ctx.arc(gx, gy, gr, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // Render Lightfall Streaks over full height
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      streaks.forEach((s) => {
        s.y += s.speed * p.speed;
        if (s.y > 1.4) {
          s.y = -s.length - 0.1;
          s.x = Math.random();
        }

        let sx = s.x * w;
        let sy = s.y * h;
        const slen = s.length * h * p.zoom;

        if (p.mouseInteraction && mouseRef.current.x > 0) {
          const dx = sx - mouseRef.current.x;
          const dy = sy - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = w * p.mouseRadius;

          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 30 * p.mouseStrength;
            sx += (dx / dist) * force;
          }
        }

        const currentAlpha = (s.alpha + Math.sin(t * 2.5 + s.phase) * 0.2 * p.twinkle) * p.opacity;
        if (currentAlpha <= 0) return;

        const streakGrad = ctx.createLinearGradient(sx, sy - slen, sx, sy);
        streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        streakGrad.addColorStop(0.5, `${s.color}44`);
        streakGrad.addColorStop(0.9, `${s.color}DD`);
        streakGrad.addColorStop(1, '#ffffff');

        ctx.fillStyle = streakGrad;
        const sw = s.width * p.zoom * dpr;

        ctx.beginPath();
        ctx.fillRect(sx - sw / 2, sy - slen, sw, slen);
      });

      ctx.restore();

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      style={{ opacity, ...style }}
    />
  );
}
