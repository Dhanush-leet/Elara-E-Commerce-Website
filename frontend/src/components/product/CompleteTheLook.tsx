"use client";

import { products, type Product } from "@/lib/products";
import { ProductCard } from "../ProductCard";
import { SplitHeading } from "../SplitHeading";

export function CompleteTheLook({ current }: { current: Product }) {
  const related = products
    .filter((p) => p.id !== current.id)
    .sort((a, b) =>
      (a.category === current.category ? -1 : 0) -
      (b.category === current.category ? -1 : 0)
    )
    .slice(0, 4);

  return (
    <section className="px-4 py-16 sm:px-8" aria-label="Complete the look">
      <SplitHeading
        lines={["COMPLETE", "THE LOOK"]}
        className="display-mega text-5xl sm:text-7xl"
      />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {related.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
