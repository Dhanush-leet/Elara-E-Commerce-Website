"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/store";

const links = [
  { href: "/", label: "Home", index: "01" },
  { href: "/collection", label: "Collection", index: "02" },
  { href: "/collection?category=Totes", label: "Totes", index: "03" },
  { href: "/collection?category=Travel", label: "Travel", index: "04" },
  { href: "/account", label: "Account", index: "05" },
  { href: "/cart", label: "Cart", index: "06" },
];

export function MenuOverlay() {
  const { menuOpen, setMenuOpen } = useUI();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMenuOpen]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col bg-frame text-paper"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="flex items-center justify-between px-6 py-6 sm:px-10">
            <span className="font-serif text-3xl italic">elara</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="rounded-full border border-paper/30 px-5 py-2 text-xs uppercase tracking-widest transition-colors hover:bg-paper hover:text-ink"
            >
              Close ✕
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-6 sm:px-10">
            {links.map((l, i) => (
              <motion.div
                key={l.href + l.label}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.25 + i * 0.07,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="overflow-hidden border-b border-paper/10"
              >
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-baseline gap-6 py-2"
                >
                  <span className="font-mono text-xs text-paper/40">{l.index}</span>
                  <span className="display-mega text-[11vw] leading-[1.05] transition-all duration-300 group-hover:translate-x-4 group-hover:text-accent sm:text-[7vw]">
                    {l.label}
                  </span>
                  <span className="ml-auto hidden text-2xl opacity-0 transition-opacity group-hover:opacity-100 sm:block" aria-hidden="true">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50 sm:px-10">
            <span>Atelier — Paris · Mumbai · Tokyo</span>
            <span>✱ Est. 2026</span>
            <span>hello@elara.maison</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
