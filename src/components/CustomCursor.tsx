"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./Providers";

/**
 * Custom cursor: dot + trailing ring. Scales over interactive elements,
 * shows DRAG / ROTATE labels over elements tagged data-cursor="drag|rotate".
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, input, select, textarea, [role='button']"
      );
      const cursorAttr = (e.target as HTMLElement)
        .closest<HTMLElement>("[data-cursor]")
        ?.dataset.cursor;
      setLabel(cursorAttr ?? null);
      setActive(!!target);
    };

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16;
      ring.y += (pos.y - ring.y) * 0.16;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduced]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[300]">
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-accent"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center"
      >
        <div
          className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-luxury ${
            label
              ? "h-16 w-16 border-transparent bg-ink/90 text-paper"
              : active
                ? "h-10 w-10 border-ink/60 bg-paper/20 backdrop-blur-sm"
                : "h-6 w-6 border-ink/40"
          }`}
        >
          {label && (
            <span className="font-mono text-[9px] uppercase tracking-[0.25em]">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
