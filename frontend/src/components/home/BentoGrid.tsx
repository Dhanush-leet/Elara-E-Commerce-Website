"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SmartImage } from "../SmartImage";
import { products } from "@/lib/products";

export function BentoGrid() {
  const big = products[0];
  const tall = products[3];

  return (
    <section className="grid gap-3 px-4 py-8 sm:px-8 lg:grid-cols-3" aria-label="Featured editorial">
      {/* Oversized lifestyle tile */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="group relative aspect-[4/3] overflow-hidden bg-stone lg:col-span-2 lg:aspect-auto lg:min-h-[560px]"
      >
        <SmartImage
          src={big.lifestyle}
          alt={`Model carrying the ${big.name} in natural light`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.06]"
        />
        <span className="badge-accent absolute left-5 top-5 transition-colors duration-200 group-hover:bg-ink">
          New Collection
        </span>
        <Link
          href={`/product/${big.slug}`}
          className="badge-cta absolute bottom-5 left-5 group-hover:bg-paper group-hover:text-ink"
        >
          Explore Product <span className="plus">+</span>
        </Link>
        <span className="absolute bottom-5 right-5 hidden font-serif text-xl italic text-paper drop-shadow sm:block">
          the {big.name.toLowerCase()}
        </span>
      </motion.div>

      {/* Tall supporting tile */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="group relative aspect-[3/4] overflow-hidden bg-stone lg:aspect-auto"
      >
        <SmartImage
          src={tall.lifestyle}
          alt={`Editorial look featuring the ${tall.name}`}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.06]"
        />
        <span className="badge-light absolute left-5 top-5">2026</span>
        <div className="absolute bottom-5 left-5 flex flex-col items-start gap-2">
          <span className="badge-accent group-hover:bg-ink">
            {tall.colors.length} Colors
          </span>
          <Link href={`/product/${tall.slug}`} className="badge-cta group-hover:bg-paper group-hover:text-ink">
            Explore Product <span className="plus">+</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
