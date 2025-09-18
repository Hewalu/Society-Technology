'use client';

import React, { useRef, useEffect } from 'react';
import { ParticleColor } from '@/context/UserContext';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// interface ParticleColor {
//   name: string;     // z.B. "Rot"
//   rgb: string;      // z.B. "255,0,0"
//   ratio: number;    // z.B. 0.5 für 50%
// }

interface ParticleCanvasProps {
  points: number;
  diversity: number;
  colors: ParticleColor[];
  spread?: number;
  blur?: number;
  horizontalShift?: number;
  convergence?: number;
  sizeMultiplier?: number;
  centerOnScreen?: boolean;
  className?: string;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  points,
  diversity,
  colors,
  spread,
  blur,
  horizontalShift = 0,
  convergence = 1,
  sizeMultiplier = 1,
  centerOnScreen = false,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const shiftRef = useRef(horizontalShift);
  const initialConvergence = Math.min(Math.max(convergence, 0), 1);
  const convergenceRef = useRef(initialConvergence);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    shiftRef.current = horizontalShift;
  }, [horizontalShift]);

  useEffect(() => {
    const clamped = Math.min(Math.max(convergence, 0), 1);
    convergenceRef.current = clamped;
  }, [convergence]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const normalizedMultiplier = Math.max(sizeMultiplier, 1);

    const applyCanvasSize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = window.innerWidth * normalizedMultiplier;
      const height = window.innerHeight * normalizedMultiplier;

      canvasSizeRef.current = { width, height };
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (typeof ctx.resetTransform === 'function') {
        ctx.resetTransform();
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.scale(ratio, ratio);
    };

    applyCanvasSize();

    let particles: Particle[] = [];
    const center = {
      x: canvasSizeRef.current.width / 2 + shiftRef.current,
      y: canvasSizeRef.current.height / 2,
    };
    const syncCenter = (smooth = true) => {
      const targetX = canvasSizeRef.current.width / 2 + shiftRef.current;
      const targetY = canvasSizeRef.current.height / 2;

      if (!smooth) {
        center.x = targetX;
        center.y = targetY;
        return;
      }

      center.x += (targetX - center.x) * 0.08;
      center.y += (targetY - center.y) * 0.08;
    };
    const spreadFactor = typeof spread === 'number' ? Math.max(0.2, spread) : 1;
    const isDarkMode = resolvedTheme === 'dark';
    const backgroundColor = isDarkMode ? '#050914' : '#FFFFFF';
    const blurSigma = typeof blur === 'number' ? Math.max(0, blur) : 0;
    const particleAlpha = isDarkMode ? 0.88 : 0.78;
    const particleGlow = (isDarkMode ? 6 : 4) + blurSigma * (isDarkMode ? 1.6 : 1.3);

    const getConvergenceScale = () => {
      const current = Math.min(Math.max(convergenceRef.current, 0), 1);
      if (current <= 0) {
        return 0;
      }
      return Math.pow(current, 0.85);
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      angle: number;
      orbitRadius: number;
      baseOrbitRadius: number;
      color: string;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.radius = 1 + Math.random() * 1.5;
        this.angle = Math.random() * 2 * Math.PI;
        this.color = color;
        // Adjust orbit radius based on diversity and external spread control
        const baseOrbit = 40 + Math.random() * (25 + diversity * 2.5);
        this.baseOrbitRadius = baseOrbit * spreadFactor;
        const seedConvergence = getConvergenceScale();
        this.orbitRadius = this.baseOrbitRadius * seedConvergence;
      }

      update() {
        let ax = 0;
        let ay = 0;

        // Dynamic orbit center
        const orbitCenterX = center.x + Math.cos(this.angle * 0.5) * 50;
        const orbitCenterY = center.y + Math.sin(this.angle * 0.5) * 50;

        const centerDx = orbitCenterX - this.x;
        const centerDy = orbitCenterY - this.y;
        const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);

        const convergenceFactor = getConvergenceScale();
        const desiredOrbit = this.baseOrbitRadius * convergenceFactor;
        this.orbitRadius += (desiredOrbit - this.orbitRadius) * 0.08;

        // Gentle pull towards the orbit
        ax += centerDx * 0.0005;
        ay += centerDy * 0.0005;

        // Repulsion if too close to center
        const minRingRadius = 4 + getConvergenceScale() * 42;
        if (centerDist < minRingRadius) {
          const repelForce = 0.05 * (minRingRadius - centerDist);
          if (centerDist > 0.0001) {
            ax -= (centerDx / centerDist) * repelForce;
            ay -= (centerDy / centerDist) * repelForce;
          } else {
            const angle = this.angle;
            ax -= Math.cos(angle) * repelForce;
            ay -= Math.sin(angle) * repelForce;
          }
        }

        // Orbital motion
        this.angle += 0.01;
        const targetOrbitX = center.x + Math.cos(this.angle) * this.orbitRadius;
        const targetOrbitY = center.y + Math.sin(this.angle) * this.orbitRadius;
        const orbitDx = targetOrbitX - this.x;
        const orbitDy = targetOrbitY - this.y;
        ax += orbitDx * 0.002;
        ay += orbitDy * 0.002;

        // Random motion for organic feel
        if (Math.random() < 0.05) {
          ax += (Math.random() - 0.5) * 0.8;
          ay += (Math.random() - 0.5) * 0.8;
        }

        this.vx += ax;
        this.vy += ay;

        // Damping
        this.vx *= 0.94;
        this.vy *= 0.94;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.shadowBlur = particleGlow;
        ctx.shadowColor = `rgba(${this.color}, ${isDarkMode ? 0.55 : 0.35})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${particleAlpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      syncCenter(false);
      const totalParticles = points > 0 ? Math.round(points) : 0;

      if (!colors.length || totalParticles === 0) {
        return;
      }

      const totalRatio = colors.reduce((sum, c) => sum + c.ratio, 0);
      const equalWeight = 1 / colors.length;

      const allocations = colors.map((colorDef, index) => {
        const weight = totalRatio > 0 ? colorDef.ratio / totalRatio : equalWeight;
        const exact = weight * totalParticles;
        const base = Math.floor(exact);
        return {
          index,
          colorDef,
          base,
          fraction: exact - base,
        };
      });

      const assigned = allocations.reduce((sum, entry) => sum + entry.base, 0);
      let remaining = totalParticles - assigned;

      if (remaining > 0) {
        const sortedRemainders = [...allocations].sort((a, b) => b.fraction - a.fraction);
        for (let i = 0; i < sortedRemainders.length && remaining > 0; i++) {
          allocations[sortedRemainders[i].index].base += 1;
          remaining -= 1;
        }
      }

      allocations.forEach(({ colorDef, base }) => {
        for (let i = 0; i < base; i++) {
          const angle = Math.random() * 2 * Math.PI;

          // Adjust minRadius based on diversity
          const minRadius = (diversity > 10 ? 50 : 0) * spreadFactor;

          // Max radius is now based on screen height
          const maxScreenRadius = Math.max(
            minRadius + 25,
            ((canvasSizeRef.current.height / 2) - 150) * spreadFactor
          );

          // Scale diversity effect with points
          const diversityFactor = (diversity / 100) * (1 + points / 500);
          const maxRadius = minRadius + (maxScreenRadius - minRadius) * diversityFactor;

          // Skew distribution towards center
          const randomFactor = Math.pow(Math.random(), 3);
          const radius = minRadius + randomFactor * (maxRadius - minRadius);
          const seedConvergence = getConvergenceScale();
          const spawnRadius = radius * seedConvergence;

          const x = center.x + Math.cos(angle) * spawnRadius;
          const y = center.y + Math.sin(angle) * spawnRadius;

          particles.push(new Particle(x, y, colorDef.rgb));
        }
      });

      // Shuffle particles for mixing colors
      particles = particles.sort(() => Math.random() - 0.5);
    };

    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      syncCenter();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasSizeRef.current.width, canvasSizeRef.current.height);

      for (const p of particles) {
        p.update();
        p.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas || !ctx) return;
      applyCanvasSize();
      syncCenter(false);
      initParticles();
    };

    syncCenter(false);
    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [points, diversity, colors, spread, blur, resolvedTheme, sizeMultiplier]);

  const canvasClassName = cn(
    'pointer-events-none absolute -z-10',
    centerOnScreen ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : 'left-0 top-0',
    className
  );

  return <canvas ref={canvasRef} className={canvasClassName} />;
};

export default ParticleCanvas;
