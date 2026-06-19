"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./Providers";

export function Marquee({
  items,
  reverse = false,
  dark = true,
  speed = 28,
  className = "",
}: {
  items: string[];
  reverse?: boolean;
  dark?: boolean;
  speed?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [dir, setDir] = useState(reverse ? -1 : 1);
  const lastY = useRef(0);

  // Reverse direction when scroll direction changes
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const y = window.scrollY;
      const scrollingDown = y > lastY.current;
      lastY.current = y;
      setDir(scrollingDown ? (reverse ? -1 : 1) : reverse ? 1 : -1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reverse, reduced]);

  const content = items.map((item, i) => (
    <span key={i} className="flex items-center">
      <span className="px-6 text-xs font-medium uppercase tracking-[0.2em]">
        {item}
      </span>
      <span className={`text-sm ${dark ? "text-accent" : "text-accent"}`} aria-hidden="true">
        ✱
      </span>
    </span>
  ));

  if (reduced) {
    return (
      <div
        className={`overflow-hidden border-y border-ink/10 py-3 ${
          dark ? "bg-ink text-paper" : "bg-paper text-ink"
        } ${className}`}
      >
        <div className="flex">{content}</div>
      </div>
    );
  }

  return (
    <div
      className={`marquee overflow-hidden py-3 ${
        dark ? "bg-ink text-paper" : "bg-paper text-ink border-y border-ink/10"
      } ${className}`}
      aria-hidden="true"
      style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
    >
      <div
        className={`marquee-track ${
          dir === 1 ? "animate-marquee-left" : "animate-marquee-right"
        }`}
      >
        <div className="flex shrink-0">{content}{content}</div>
        <div className="flex shrink-0">{content}{content}</div>
      </div>
    </div>
  );
}
