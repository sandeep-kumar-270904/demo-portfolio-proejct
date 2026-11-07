import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  baseAlpha: number;
  color: string;
}

const GOLD_PALETTE = ["#C69B45", "#E5B747", "#F2D18A", "#E58B32", "#A85C38"];

export default function IntroCanvasParticles({ burstTrigger }: { burstTrigger?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 26 : 64;

    const createParticle = (): Particle => {
      const color = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
      const baseAlpha = 0.12 + Math.random() * 0.35;
      const baseSize = 1 + Math.random() * 2.2;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.2 - Math.random() * 0.4,
        size: baseSize,
        baseSize,
        alpha: baseAlpha,
        baseAlpha,
        color,
      };
    };

    particlesRef.current = Array.from({ length: count }, createParticle);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;

        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  // Text-transition reaction / burst
  useEffect(() => {
    if (burstTrigger === undefined || burstTrigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Disperse particles outward from center
    particlesRef.current.forEach((p) => {
      const dx = p.x - width / 2;
      const dy = p.y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      p.vx += (dx / dist) * 1.5;
      p.vy += (dy / dist) * 1.5;
      p.alpha = Math.min(0.8, p.baseAlpha * 2.2);

      // Settle down after 600ms
      setTimeout(() => {
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = -0.2 - Math.random() * 0.4;
        p.alpha = p.baseAlpha;
      }, 700);
    });
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[12] h-full w-full"
      aria-hidden="true"
    />
  );
}
