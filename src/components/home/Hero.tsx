"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useUI } from "@/lib/store";
import { ImageTrail } from "../ImageTrail";

const HEADLINE = ["THE NEW", "ATELIER"];

function ConfettiBurst() {
  const pieces = Array.from({ length: 14 });
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {pieces.map((_, i) => {
        const angle = (i / pieces.length) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5"
            style={{
              background:
                i % 3 === 0
                  ? "#e8442e"
                  : i % 3 === 1
                  ? "#b08d57"
                  : "#141210",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * (40 + (i % 4) * 14),
              y: Math.sin(angle) * (34 + (i % 3) * 12) - 18,
              opacity: 0,
              scale: 0.4,
              rotate: 180 + i * 40,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

export function Hero() {
  const toast = useUI((s) => s.toast);
  const [burst, setBurst] = useState(0);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  const copyVoucher = async () => {
    try {
      await navigator.clipboard.writeText("ELARA_2026");
      toast("Code ELARA_2026 copied to clipboard");
    } catch {
      toast("Use code ELARA_2026 at checkout");
    }
    setBurst((b) => b + 1);
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[65vh] flex-col justify-center px-4 pb-10 pt-6 sm:min-h-[85vh] sm:px-8"
      aria-label="New season collection"
    >
      <ImageTrail className="z-0" />

      {/* Floating editorial image — visible on larger screens */}
      <motion.div
        className="pointer-events-none absolute right-8 top-24 z-[1] hidden lg:block"
        initial={{ opacity: 0, x: 60, rotate: 3 }}
        animate={isInView ? { opacity: 1, x: 0, rotate: 2 } : {}}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative h-[340px] w-[260px] overflow-hidden shadow-2xl">
          <Image
            src="/models/hero-editorial.png"
            alt="Elara editorial collection"
            fill
            sizes="260px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.3em] text-white/60">
            Atelier 2026
          </span>
        </div>
      </motion.div>

      {/* Small cursor hint */}
      <p className="relative z-10 mb-4 hidden font-mono text-[10px] uppercase tracking-[0.35em] text-smoke md:block">
        ✱ Move your cursor — the atelier follows
      </p>

      {/* Headline */}
      <h1 className="pointer-events-none relative z-10 display-mega text-[14vw] leading-[0.84] sm:text-[11vw]">
        {HEADLINE.map((line, i) => (
          <span key={line} className="block overflow-hidden">
            <motion.span
              className="block"
              initial={{ y: "110%", clipPath: "inset(0 0 100% 0)" }}
              animate={{ y: 0, clipPath: "inset(0 0 -10% 0)" }}
              transition={{
                delay: 0.9 + i * 0.16,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {i === 1 ? (
                <>
                  <span className="text-accent">ATELIER</span>
                </>
              ) : (
                line
              )}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* Subtitle line with stagger */}
      <motion.div
        className="relative z-10 mt-4"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="max-w-md font-serif text-lg italic text-ink/50 sm:text-xl">
          Hand-finished leather, editorial silhouettes,
          <br className="hidden sm:block" />
          designed for modern movement.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/collection"
            className="group flex items-center gap-3 bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:bg-accent"
          >
            Explore Collection
            <span className="flex h-5 w-5 items-center justify-center bg-accent text-paper transition-colors group-hover:bg-paper group-hover:text-ink">
              +
            </span>
          </Link>

          <button
            onClick={copyVoucher}
            className="group relative flex items-center gap-3 rounded-full border border-ink/20 bg-paper py-2 pl-5 pr-2 text-xs uppercase tracking-widest transition-all duration-300 hover:border-ink"
            aria-label="Copy voucher code ELARA_2026"
          >
            10% Off
            <span className="rounded-full bg-accent px-4 py-2 font-mono font-bold text-paper transition-transform duration-200 group-active:scale-90">
              ELARA_2026
            </span>
            {burst > 0 && <ConfettiBurst key={burst} />}
          </button>
        </div>

        <Link
          href="/collection"
          className="group flex items-center gap-2 text-sm text-ink/70 transition-colors hover:text-ink"
        >
          Elara Pop-Up Atelier at Jio World Plaza — June 2026
          <span
            className="transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
