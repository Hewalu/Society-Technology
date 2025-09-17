'use client';

import React, { useRef, useEffect } from 'react';
import { ParticleColor } from '@/context/UserContext';
import { useTheme } from 'next-themes';

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
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  points,
  diversity,
  colors,
  spread,
  blur,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[] = [];
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const spreadFactor = typeof spread === 'number' ? Math.max(0.2, spread) : 1;
    const isDarkMode = resolvedTheme === 'dark';
    const backgroundColor = isDarkMode ? '#050914' : '#FFFFFF';
    const blurSigma = typeof blur === 'number' ? Math.max(0, blur) : 0;
    const particleAlpha = isDarkMode ? 0.88 : 0.78;
    const particleGlow = (isDarkMode ? 6 : 4) + blurSigma * (isDarkMode ? 1.6 : 1.3);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      angle: number;
      orbitRadius: number;
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
        this.orbitRadius = baseOrbit * spreadFactor;
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

        // Gentle pull towards the orbit
        ax += centerDx * 0.0005;
        ay += centerDy * 0.0005;

        // Repulsion if too close to center
        const minRingRadius = 50;
        if (centerDist < minRingRadius) {
          const repelForce = 0.05 * (minRingRadius - centerDist);
          ax -= (centerDx / centerDist) * repelForce;
          ay -= (centerDy / centerDist) * repelForce;
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
      const totalParticles = points > 0 ? points * 8 : 1000;

      // Normiere die Ratios, falls sie nicht 1 ergeben
      const totalRatio = colors.reduce((sum, c) => sum + c.ratio, 0);

      colors.forEach(colorDef => {
        const numParticles = Math.floor((colorDef.ratio / totalRatio) * totalParticles);

        for (let i = 0; i < numParticles; i++) {
          const angle = Math.random() * 2 * Math.PI;

          // Adjust minRadius based on diversity
          const minRadius = (diversity > 10 ? 50 : 0) * spreadFactor;

          // Max radius is now based on screen height
          const maxScreenRadius = Math.max(minRadius + 25, ((canvas.height / 2) - 150) * spreadFactor);

          // Scale diversity effect with points
          const diversityFactor = (diversity / 100) * (1 + points / 500);
          const maxRadius = minRadius + (maxScreenRadius - minRadius) * diversityFactor;

          // Skew distribution towards center
          const randomFactor = Math.pow(Math.random(), 3);
          const radius = minRadius + randomFactor * (maxRadius - minRadius);

          const x = center.x + Math.cos(angle) * radius;
          const y = center.y + Math.sin(angle) * radius;

          particles.push(new Particle(x, y, colorDef.rgb));
        }
      });

      // Shuffle particles for mixing colors
      particles = particles.sort(() => Math.random() - 0.5);
    };

    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.update();
        p.draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      center.x = canvas.width / 2;
      center.y = canvas.height / 2;
      initParticles();
    };

    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [points, diversity, colors, spread, blur, resolvedTheme]);
  return <canvas ref={canvasRef} className="absolute top-0 left-0 -z-10" />;
};

export default ParticleCanvas;
