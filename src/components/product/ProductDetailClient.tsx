"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart, useUI, useWishlist } from "@/lib/store";
import type { LightPreset } from "../three/BagViewer";

const BagViewer = dynamic(
  () => import("../three/BagViewer").then((m) => m.BagViewer),
  { ssr: false, loading: () => <div className="skeleton h-full w-full" /> }
);

const presetLabels: { id: LightPreset; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "golden", label: "Golden Hour" },
  { id: "boutique", label: "Boutique" },
];

export function ProductDetailClient({ product }: { product: Product }) {
  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [preset, setPreset] = useState<LightPreset>("studio");
  const [flying, setFlying] = useState(false);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const add = useCart((s) => s.add);
  const { toast, setCartOpen } = useUI();
  const { ids, toggle } = useWishlist();
  const wished = ids.includes(product.id);
  const color = product.colors[colorIdx];

  const addToBag = () => {
    add(product, color.name, size, qty);
    setFlying(true);
    setTimeout(() => setFlying(false), 900);
    toast(`${product.name} added to your bag`);
    setTimeout(() => setCartOpen(true), 700);
  };

  return (
    <section className="grid lg:grid-cols-[3fr_2fr]" aria-label={`${product.name} details`}>
      {/* ── 3D viewer ─────────────────────────────────── */}
      <div className="relative border-b border-ink/10 bg-gradient-to-b from-paper to-canvas lg:min-h-[80vh] lg:border-b-0 lg:border-r">
        <BagViewer
          model={product.model}
          leather={color.hex}
          hardware={color.hardware}
          preset={preset}
          interactive
          className="h-[60vh] w-full lg:h-full lg:min-h-[80vh]"
        />

        <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
          {product.tag && (
            <span className={product.tag === "SALE" ? "badge-accent" : "badge-light"}>
              {product.tag}
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            Drag · Rotate · Scroll to zoom
          </span>
        </div>

        {/* Lighting presets */}
        <div
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border border-ink/15 bg-paper/90 p-1 backdrop-blur"
          role="radiogroup"
          aria-label="Lighting preset"
        >
          {presetLabels.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={preset === p.id}
              onClick={() => setPreset(p.id)}
              className={`rounded-full px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-300 ${
                preset === p.id ? "bg-ink text-paper" : "hover:bg-stone"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Purchase panel ────────────────────────────── */}
      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        <div>
          <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            {product.category} — 2026 Atelier
          </p>
          <h1 className="display-mega mt-3 text-5xl sm:text-6xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-mono text-2xl">{formatPrice(product.price)}</p>
            {product.compareAt && (
              <p className="font-mono text-base text-smoke line-through">
                {formatPrice(product.compareAt)}
              </p>
            )}
          </div>
          <p className="mt-4 max-w-sm whitespace-pre-line font-serif text-xl italic leading-snug text-ink/70">
            {product.blurb}
          </p>
        </div>

        {/* Specs table with ruler-tick borders */}
        <div>
          <div className="ruler-ticks" aria-hidden="true" />
          <dl className="grid grid-cols-3 gap-4 py-4 font-mono text-xs">
            <div>
              <dt className="uppercase tracking-widest text-smoke">Material</dt>
              <dd className="mt-1">{product.material}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest text-smoke">Dimensions</dt>
              <dd className="mt-1">{product.dimensions}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest text-smoke">Weight</dt>
              <dd className="mt-1">{product.weight}</dd>
            </div>
          </dl>
          <div className="ruler-ticks" aria-hidden="true" />
        </div>

        {/* Color */}
        <fieldset>
          <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">
            Color — <span className="text-smoke">{color.name}</span>
          </legend>
          <div className="flex gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                aria-label={`Color ${c.name}`}
                aria-pressed={i === colorIdx}
                className={`h-10 w-10 rounded-full border-2 transition-all duration-300 ${
                  i === colorIdx
                    ? "scale-110 border-accent"
                    : "border-ink/15 hover:scale-105"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </fieldset>

        {/* Size */}
        {product.sizes.length > 1 && (
          <fieldset>
            <legend className="mb-3 text-xs font-semibold uppercase tracking-widest">Size</legend>
            <div className="flex gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  aria-pressed={s === size}
                  className={`pill ${s === size ? "!border-ink !bg-ink !text-paper" : ""}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {/* Qty + CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-ink/20">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-4 py-3 hover:text-accent"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center font-mono" aria-live="polite">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="px-4 py-3 hover:text-accent"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <motion.button
            ref={addBtnRef}
            onClick={addToBag}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            className="relative flex-1 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors duration-200 hover:bg-accent"
          >
            Add to Bag — {formatPrice(product.price * qty)}
            {/* flying thumbnail */}
            {flying && (
              <motion.span
                className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 rounded-full shadow-xl"
                style={{ background: color.hex }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: "38vw", y: "-38vh", opacity: 0.2, scale: 0.3 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
              />
            )}
          </motion.button>

          <button
            onClick={() => {
              toggle(product.id);
              toast(wished ? "Removed from wishlist" : "Saved to wishlist ♥");
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={wished}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-all hover:border-accent active:scale-90"
          >
            <motion.svg
              width="18"
              height="16"
              viewBox="0 0 14 13"
              animate={wished ? { scale: [1, 1.4, 1] } : {}}
              transition={{ duration: 0.4 }}
            >
              <path
                d="M7 12S1 8.2 1 4.3C1 2.2 2.6.7 4.5.7 5.6.7 6.6 1.3 7 2.2 7.4 1.3 8.4.7 9.5.7c1.9 0 3.5 1.5 3.5 3.6C13 8.2 7 12 7 12Z"
                fill={wished ? "#e8442e" : "none"}
                stroke={wished ? "#e8442e" : "#141210"}
                className="transition-all duration-500"
              />
            </motion.svg>
          </button>
        </div>

        {/* Story */}
        <div className="mt-2 border-t border-ink/10 pt-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            ✱ From the atelier
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">{product.story}</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-smoke">
            ★ {product.rating} · {product.reviews} reviews
          </p>
        </div>
      </div>
    </section>
  );
}
