"use client";

import { useRef } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { SplitHeading } from "../SplitHeading";

/** Horizontal drag-to-scroll rail with momentum. */
export function BestSellers() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0, vel: 0, lastX: 0, raf: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail) return;
    cancelAnimationFrame(drag.current.raf);
    drag.current = { ...drag.current, down: true, startX: e.clientX, scrollLeft: rail.scrollLeft, lastX: e.clientX, vel: 0 };
    rail.classList.add("dragging");
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const rail = railRef.current;
    if (!rail || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.vel = drag.current.lastX - e.clientX;
    drag.current.lastX = e.clientX;
    rail.scrollLeft = drag.current.scrollLeft - dx;
  };

  const release = () => {
    const rail = railRef.current;
    if (!rail || !drag.current.down) return;
    drag.current.down = false;
    rail.classList.remove("dragging");
    // momentum
    const glide = () => {
      drag.current.vel *= 0.94;
      rail.scrollLeft += drag.current.vel;
      if (Math.abs(drag.current.vel) > 0.4) {
        drag.current.raf = requestAnimationFrame(glide);
      }
    };
    drag.current.raf = requestAnimationFrame(glide);
  };

  const best = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 8);

  return (
    <section className="overflow-hidden py-16" aria-label="Best sellers">
      <div className="px-4 sm:px-8">
        <SplitHeading
          lines={["BEST SELLERS"]}
          className="display-mega -mr-[6vw] whitespace-nowrap text-[13vw] leading-none text-ink"
        />
      </div>

      <div
        ref={railRef}
        data-cursor="drag"
        className="drag-rail mt-8 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerLeave={release}
        role="region"
        aria-label="Best sellers carousel, drag to scroll"
        tabIndex={0}
      >
        {best.map((p, i) => (
          <div key={p.id} className="w-[72vw] shrink-0 select-none sm:w-[340px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
