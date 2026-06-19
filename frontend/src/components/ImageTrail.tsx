"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { products } from "@/lib/products";
import { useReducedMotion } from "./Providers";

/**
 * Cursor-trailing handbag images with a motion-blur smear — the
 * floating-tile hero effect. As the pointer moves across the area,
 * handbag photos spawn at the cursor, smear into focus, then drift
 * and fade. Pure DOM + GSAP, pointer-events-none so it never blocks UI.
 */

const TRAIL = [
  ...products.map((p) => p.image),
  ...products.map((p) => p.lifestyle),
];

// Persistent, gently-floating tiles scattered around the hero edges
// (matches the reference's resting state; CSS-animated so it's visible
// immediately, before any pointer movement).
const AMBIENT: { src: string; left: string; top: string; w: number; r: number; dur: number; delay: number }[] = [
  { src: products[0].image, left: "2%", top: "4%", w: 128, r: -6, dur: 8, delay: 0 },
  { src: products[5].lifestyle, left: "84%", top: "3%", w: 138, r: 5, dur: 9, delay: 1.2 },
  { src: products[3].image, left: "86%", top: "42%", w: 120, r: -4, dur: 7.5, delay: 0.6 },
  { src: products[8].image, left: "5%", top: "68%", w: 140, r: 7, dur: 8.5, delay: 1.8 },
  { src: products[2].lifestyle, left: "78%", top: "70%", w: 150, r: -3, dur: 7, delay: 0.3 },
  { src: products[10].image, left: "30%", top: "80%", w: 120, r: 4, dur: 8.2, delay: 0.9 },
];

export function ImageTrail({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const container = ref.current;
    if (!container || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const imgs = Array.from(
      container.querySelectorAll<HTMLElement>(".trail-cell")
    );
    if (!imgs.length) return;

    const last = { x: 0, y: 0, set: false };
    let idx = 0;
    const threshold = 90; // px between spawns

    const spawn = (x: number, y: number, vx: number, vy: number) => {
      const cell = imgs[idx % imgs.length];
      idx++;
      const speed = Math.min(1, Math.hypot(vx, vy) / 60);
      const angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      gsap.killTweensOf(cell);
      gsap.set(cell, {
        left: x,
        top: y,
        xPercent: -50,
        yPercent: -50,
        scale: 0.5,
        opacity: 0,
        rotation: gsap.utils.random(-10, 10),
        filter: `blur(${6 + speed * 10}px)`,
        zIndex: idx,
      });
      gsap
        .timeline()
        .to(cell, {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
        })
        .to(
          cell,
          {
            opacity: 0,
            scale: 0.78,
            x: Math.cos((angle * Math.PI) / 180) * 60,
            y: Math.sin((angle * Math.PI) / 180) * 60 + 40,
            filter: "blur(8px)",
            duration: 0.8,
            ease: "power2.in",
          },
          0.5
        );
    };

    const onMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // only react within the trail area (small margin)
      if (x < -40 || y < -40 || x > rect.width + 40 || y > rect.height + 40) return;
      if (!last.set) {
        last.x = x;
        last.y = y;
        last.set = true;
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      if (Math.hypot(dx, dy) < threshold) return;
      spawn(x, y, dx, dy);
      last.x = x;
      last.y = y;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* ambient floating tiles */}
      {AMBIENT.map((a, i) => (
        <div
          key={`amb-${i}`}
          className="trail-float absolute hidden opacity-60 shadow-xl md:block"
          style={
            {
              left: a.left,
              top: a.top,
              width: a.w,
              height: a.w * 1.25,
              backgroundImage: `url(${a.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              ["--r" as string]: `${a.r}deg`,
              ["--dur" as string]: `${a.dur}s`,
              ["--delay" as string]: `${a.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* cursor trail cells */}
      {TRAIL.map((src, i) => (
        <div
          key={i}
          className="trail-cell absolute left-0 top-0 h-44 w-36 opacity-0 shadow-2xl will-change-transform"
          style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ))}
    </div>
  );
}
