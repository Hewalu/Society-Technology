'use client';

import React, { useRef, useEffect } from 'react';

interface ParticleCanvasProps {
    points: number;
    diversity: number;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ points, diversity }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particles: Particle[] = [];
        const center = { x: canvas.width / 2, y: canvas.height / 2 };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            angle: number;
            orbitRadius: number;

            constructor(x: number, y: number) {
                this.x = x;
                this.y = y;
                this.vx = Math.random() * 2 - 1;
                this.vy = Math.random() * 2 - 1;
                this.radius = 1 + Math.random() * 1.5;
                this.angle = Math.random() * 2 * Math.PI;
                // Adjust orbit radius based on diversity - more diversity means wider orbit
                this.orbitRadius = 80 + Math.random() * (50 + diversity * 5);
            }

            update() {
                let ax = 0;
                let ay = 0;

                // Attraction to center
                const centerDx = center.x - this.x;
                const centerDy = center.y - this.y;
                const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);

                // Repulsion if too close to center
                const minRingRadius = 50;
                if (centerDist < minRingRadius) {
                    const repelForce = 0.1 * (minRingRadius - centerDist);
                    ax -= (centerDx / centerDist) * repelForce;
                    ay -= (centerDy / centerDist) * repelForce;
                }

                // Orbital motion
                this.angle += 0.005;
                const targetOrbitX = center.x + Math.cos(this.angle) * this.orbitRadius;
                const targetOrbitY = center.y + Math.sin(this.angle) * this.orbitRadius;
                const orbitDx = targetOrbitX - this.x;
                const orbitDy = targetOrbitY - this.y;
                ax += orbitDx * 0.004;
                ay += orbitDy * 0.004;

                // Random motion
                if (Math.random() < 0.02) {
                    ax += (Math.random() - 0.5) * 0.5;
                    ay += (Math.random() - 0.5) * 0.5;
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
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'black';
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const numParticles = points > 0 ? points * 5 : 1000; // Use points prop, with a higher fallback
            for (let i = 0; i < numParticles; i++) {
                const angle = Math.random() * 2 * Math.PI;
                const minRadius = 50;
                // Max radius is now based on screen height to keep the diameter within the viewport
                const maxScreenRadius = (canvas.height / 2) - 300; // 50px buffer
                const diversityFactor = (diversity / 100) * (maxScreenRadius - minRadius);
                const maxRadius = minRadius + diversityFactor;

                // Skew distribution towards the center
                const randomFactor = Math.pow(Math.random(), 2);
                const radius = minRadius + randomFactor * (maxRadius - minRadius);

                const x = center.x + Math.cos(angle) * radius;
                const y = center.y + Math.sin(angle) * radius;
                particles.push(new Particle(x, y));
            }
        };

        let animationFrameId: number;
        const animate = () => {
            if (!ctx) return;
            ctx.fillStyle = 'white';
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
    }, [points, diversity]);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 -z-10" />;
};

export default ParticleCanvas;
