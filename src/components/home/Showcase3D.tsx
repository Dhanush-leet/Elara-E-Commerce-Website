"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatPrice } from "@/lib/products";
import { SplitHeading } from "../SplitHeading";
import { SmartImage } from "../SmartImage";
import { useReducedMotion } from "../Providers";
import type { LightPreset } from "../three/BagViewer";

const BagViewer = dynamic(
  () => import("../three/BagViewer").then((m) => m.BagViewer),
  { ssr: false, loading: () => <div className="skeleton h-full w-full" /> }
);

const chips = ["Totes", "Crossbody", "Clutches", "Mini Bags", "Travel", "Atelier Exclusives"];

export function Showcase3D() {
  const featured = products[0]; // Méridienne Tote — an elegant structured silhouette
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [preset, setPreset] = useState<LightPreset>("studio");
  const reduced = useReducedMotion();

  // Scroll-linked rotation/relight: progress drives the camera rig,
  // and crossing thirds of the section switches the lighting preset.
  useEffect(() => {
    if (reduced || !sectionRef.current) return;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      end: "bottom 20%",
      onUpdate: (self) => {
        progress.current = self.progress;
        const p = self.progress;
        setPreset(p < 0.36 ? "studio" : p < 0.7 ? "golden" : "boutique");
      },
    });
    return () => st.kill();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="px-4 py-16 sm:px-8" aria-label="3D showcase">
      <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
        Interactive Atelier
      </p>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SplitHeading
            lines={["ENGINEERED FOR", "ELEGANCE.", "DESIGNED TO", "BE HELD."]}
            className="display-mega text-5xl sm:text-7xl"
          />

          <div className="mt-8 flex max-w-md flex-wrap gap-2">
            {chips.map((c) => (
              <Link
                key={c}
                href={`/collection?category=${encodeURIComponent(c)}`}
                className="pill active:scale-95"
              >
                {c}
              </Link>
            ))}
          </div>

          {/* Featured product card */}
          <Link
            href={`/product/${featured.slug}`}
            className="group mt-10 flex max-w-sm items-center gap-4 border border-ink/15 bg-paper p-3 transition-colors hover:border-ink"
          >
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone">
              <SmartImage src={featured.image} alt={featured.name} fill sizes="80px" className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em]">
                {featured.name}
              </p>
              <p className="mt-1 font-mono text-xs text-smoke">{formatPrice(featured.price)}</p>
              <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-widest text-accent">
                View in 3D →
              </span>
            </div>
          </Link>
        </div>

        {/* Pedestal */}
        <div className="relative">
          <div className="absolute inset-x-8 bottom-6 top-12 rounded-t-full bg-gradient-to-b from-stone/60 to-transparent" aria-hidden="true" />
          <BagViewer
            model={featured.model}
            leather={featured.colors[0].hex}
            hardware={featured.colors[0].hardware}
            preset={preset}
            float
            interactive
            className="relative h-[420px] w-full sm:h-[520px]"
          />
          <div className="mx-auto h-3 w-3/4 rounded-[100%] bg-ink/10 blur-sm" aria-hidden="true" />
          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            Drag to rotate ✱ scroll to re-light — {preset}
          </p>
        </div>
      </div>
    </section>
  );
}
