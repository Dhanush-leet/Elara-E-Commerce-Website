"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { products, categories } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { SplitHeading } from "../SplitHeading";

const priceBands = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₹75K", min: 0, max: 75000 },
  { label: "₹75K – ₹1.2L", min: 75000, max: 120000 },
  { label: "Over ₹1.2L", min: 120000, max: Infinity },
] as const;

const materialFilters = ["All", "Calfskin", "Lambskin", "Goatskin", "Bridle", "Canvas"];

export function CollectionClient() {
  const params = useSearchParams();
  const [category, setCategory] = useState<string>("All");
  const [material, setMaterial] = useState("All");
  const [band, setBand] = useState(0);
  const q = (params.get("q") ?? "").toLowerCase();

  useEffect(() => {
    const c = params.get("category");
    if (c && (categories as readonly string[]).includes(c)) setCategory(c);
  }, [params]);

  const filtered = useMemo(() => {
    const b = priceBands[band];
    return products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (material === "All" ||
          p.material.toLowerCase().includes(material.toLowerCase())) &&
        p.price >= b.min &&
        p.price < b.max &&
        (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    );
  }, [category, material, band, q]);

  return (
    <div className="px-4 pb-16 sm:px-8">
      <div className="py-8">
        <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
          {filtered.length} pieces
        </p>
        <SplitHeading
          lines={["THE", "COLLECTION"]}
          as="h1"
          className="display-mega mt-3 text-[14vw] leading-[0.86] sm:text-[9vw]"
        />
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-[calc(var(--frame)+0px)] z-30 -mx-4 mb-8 border-y border-ink/10 bg-canvas/90 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`pill transition-transform active:scale-90 ${
                category === c ? "!border-ink !bg-ink !text-paper" : ""
              }`}
            >
              {c}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-ink/20 sm:block" aria-hidden="true" />
          {materialFilters.map((m) => (
            <button
              key={m}
              onClick={() => setMaterial(m)}
              aria-pressed={material === m}
              className={`pill hidden transition-transform active:scale-90 md:inline-flex ${
                material === m ? "!border-accent !bg-accent !text-paper" : ""
              }`}
            >
              {m}
            </button>
          ))}
          <select
            value={band}
            onChange={(e) => setBand(Number(e.target.value))}
            aria-label="Filter by price"
            className="pill ml-auto appearance-none bg-paper pr-8"
          >
            {priceBands.map((b, i) => (
              <option key={b.label} value={i}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FLIP grid — framer-motion layout animations re-sort cards fluidly */}
      <LayoutGroup>
        <motion.div layout className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} priority={i < 4} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl italic text-smoke">
            Nothing matches — yet.
          </p>
          <button
            onClick={() => {
              setCategory("All");
              setMaterial("All");
              setBand(0);
            }}
            className="pill-solid mt-6"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
