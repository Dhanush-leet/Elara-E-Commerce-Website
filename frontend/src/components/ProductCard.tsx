"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { SmartImage } from "./SmartImage";
import { useWishlist } from "@/lib/store";

export function ProductCard({
  product,
  index = 0,
  priority = false,
}: {
  product: Product;
  index?: number;
  priority?: boolean;
}) {
  const { ids, toggle } = useWishlist();
  const wished = ids.includes(product.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: (index % 8) * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          {/* base studio shot */}
          <SmartImage
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-all duration-700 ease-luxury group-hover:scale-[1.06] group-hover:opacity-0"
          />
          {/* lifestyle swap on hover */}
          <SmartImage
            src={product.lifestyle}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-700 ease-luxury group-hover:scale-[1.03] group-hover:opacity-100"
          />

          {product.tag && (
            <span
              className={`absolute left-3 top-3 ${
                product.tag === "SALE" ? "badge-accent" : "badge-light"
              }`}
            >
              {product.tag}
            </span>
          )}

          <span className="badge-cta absolute bottom-3 left-3 translate-y-3 opacity-0 transition-all duration-400 ease-luxury group-hover:translate-y-0 group-hover:opacity-100">
            Quick View <span className="plus">+</span>
          </span>
        </div>
      </Link>

      <button
        onClick={() => toggle(product.id)}
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wished}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 backdrop-blur transition-transform hover:scale-110 active:scale-90"
      >
        <svg width="14" height="13" viewBox="0 0 14 13" aria-hidden="true">
          <path
            d="M7 12S1 8.2 1 4.3C1 2.2 2.6.7 4.5.7 5.6.7 6.6 1.3 7 2.2 7.4 1.3 8.4.7 9.5.7c1.9 0 3.5 1.5 3.5 3.6C13 8.2 7 12 7 12Z"
            fill={wished ? "#e8442e" : "none"}
            stroke={wished ? "#e8442e" : "#141210"}
            className="transition-all duration-300"
          />
        </svg>
      </button>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.15em]">
          <Link href={`/product/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="shrink-0 font-mono text-xs text-ink/80">
          {product.compareAt && (
            <span className="mr-2 text-smoke line-through">{formatPrice(product.compareAt)}</span>
          )}
          {formatPrice(product.price)}
        </p>
      </div>
      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-smoke">
        {product.category} · {product.colors.length} colors
      </p>
    </motion.article>
  );
}
