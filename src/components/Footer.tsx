"use client";

import Link from "next/link";
import { useState } from "react";
import { Marquee } from "./Marquee";
import { useUI } from "@/lib/store";

const cols = [
  {
    title: "Shop",
    links: [
      ["All Bags", "/collection"],
      ["Totes", "/collection?category=Totes"],
      ["Crossbody", "/collection?category=Crossbody"],
      ["Travel", "/collection?category=Travel"],
    ],
  },
  {
    title: "Maison",
    links: [
      ["Our Ateliers", "/atelier#ateliers"],
      ["Craftsmanship", "/atelier#craftsmanship"],
      ["Sustainability", "/atelier#sustainability"],
      ["The Atelier", "/atelier"],
    ],
  },
  {
    title: "Care",
    links: [
      ["Shipping & Returns", "/atelier#shipping"],
      ["Leather Care", "/atelier#leather"],
      ["Repairs", "/atelier#repairs"],
      ["Contact", "/atelier#contact"],
    ],
  },
];

export function Footer() {
  const toast = useUI((s) => s.toast);
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-ink text-paper">
      <Marquee
        items={[
          "Free worldwide shipping over ₹50,000",
          "Lifetime repairs on every bag",
          "Hand-finished in small ateliers",
          "Carry the extraordinary",
        ]}
        reverse
      />

      <div className="px-4 py-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-paper/60">
              Newsletter
            </p>
            <h3 className="display-mega mt-4 text-4xl sm:text-5xl">
              Letters from<br />the Atelier
            </h3>
            <form
              className="mt-6 flex max-w-md overflow-hidden rounded-full border border-paper/25"
              onSubmit={(e) => {
                e.preventDefault();
                if (email) {
                  toast("Welcome to the atelier list ✱");
                  setEmail("");
                }
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                aria-label="Email address"
                className="w-full bg-transparent px-5 py-3 text-sm placeholder:text-paper/40 focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 bg-accent px-6 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-paper hover:text-ink"
              >
                Join →
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-paper/50">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm text-paper/80 transition-colors hover:text-accent"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden px-2" aria-hidden="true">
        <p className="display-mega translate-y-[0.18em] text-center text-[24vw] leading-none text-paper/95">
          <span className="font-serif lowercase italic tracking-tight">elara</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper/10 px-4 py-5 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:px-8">
        <span>© 2026 Elara Maison</span>
        <span aria-hidden="true">✱ ✱ ✱</span>
        <span>Paris · Mumbai · Tokyo</span>
      </div>
    </footer>
  );
}
