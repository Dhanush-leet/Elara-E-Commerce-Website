"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { products } from "@/lib/products";
import { SmartImage } from "../SmartImage";
import { Magnetic } from "../MagneticButton";

const looks = [products[1], products[6], products[8]];

const copy = [
  "Layered with structure, grounded in soft leather, and finished with quiet hardware — built for everyday city movement.",
  "One continuous line from strap to base. The silhouette does the talking; you do the moving.",
  "After-dark proportions with daylight practicality. Small bag, long night, no compromises.",
];

export function StoryBanner() {
  const [i, setI] = useState(0);
  const look = looks[i];

  return (
    <section className="px-4 py-8 sm:px-8" aria-label="Editorial story">
      <div className="relative overflow-hidden rounded-3xl bg-paper">
        <div className="grid items-center gap-8 p-6 sm:p-12 lg:grid-cols-[1.2fr_auto_1fr]">
          <div>
            <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
              New Collection
            </p>
            <h2 className="display-mega mt-5 text-4xl sm:text-6xl">
              A silhouette built<br />for modern<br />movement.
            </h2>
            <div className="mt-8 flex items-center gap-3">
              <Magnetic>
                <button
                  onClick={() => setI((i - 1 + looks.length) % looks.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:bg-stone"
                  aria-label="Previous look"
                >
                  ←
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => setI((i + 1) % looks.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent"
                  aria-label="Next look"
                >
                  →
                </button>
              </Magnetic>
              <span className="ml-2 font-mono text-xs text-smoke">
                {String(i + 1).padStart(2, "0")} / {String(looks.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          <div className="relative mx-auto h-[380px] w-[280px] sm:h-[440px] sm:w-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={look.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 overflow-hidden bg-stone shadow-2xl"
              >
                <SmartImage
                  src={look.lifestyle}
                  alt={`Look featuring the ${look.name}`}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="max-w-xs lg:justify-self-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={look.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-sm leading-relaxed text-ink/70">{copy[i]}</p>
                <Link
                  href={`/product/${look.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent hover:text-ink"
                >
                  Shop the {look.name} →
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
