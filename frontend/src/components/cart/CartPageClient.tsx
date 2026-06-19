"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, cartTotal } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { SmartImage } from "../SmartImage";
import { RollingPrice } from "../RollingNumber";
import { SplitHeading } from "../SplitHeading";

const FREE_SHIP_THRESHOLD = 50000;

export function CartPageClient() {
  const { items, setQty, remove } = useCart();
  const subtotal = cartTotal(items);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : 1200;

  return (
    <div className="px-4 py-10 sm:px-8">
      <SplitHeading
        lines={["YOUR BAG"]}
        as="h1"
        className="display-mega text-[14vw] leading-none sm:text-[8vw]"
      />

      {items.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-serif text-3xl italic text-smoke">
            Nothing here yet — the collection awaits.
          </p>
          <Link href="/collection" className="pill-solid mt-8 inline-flex">
            Explore the Collection →
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <ul>
            <AnimatePresence initial={false}>
              {items.map((i) => (
                <motion.li
                  key={i.id}
                  layout
                  exit={{ opacity: 0, x: 60 }}
                  className="flex gap-6 border-b border-ink/10 py-6"
                >
                  <Link
                    href={`/product/${i.slug}`}
                    className="relative h-36 w-28 shrink-0 overflow-hidden bg-stone"
                  >
                    <SmartImage src={i.image} alt={i.name} fill sizes="112px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          href={`/product/${i.slug}`}
                          className="text-sm font-bold uppercase tracking-[0.15em] hover:text-accent"
                        >
                          {i.name}
                        </Link>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-smoke">
                          {i.color} · {i.size}
                        </p>
                      </div>
                      <span className="font-mono">{formatPrice(i.price)}</span>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ink/20">
                        <button onClick={() => setQty(i.id, i.qty - 1)} className="px-4 py-2 hover:text-accent" aria-label="Decrease quantity">−</button>
                        <span className="w-8 text-center font-mono text-sm">{i.qty}</span>
                        <button onClick={() => setQty(i.id, i.qty + 1)} className="px-4 py-2 hover:text-accent" aria-label="Increase quantity">+</button>
                      </div>
                      <button
                        onClick={() => remove(i.id)}
                        className="font-mono text-[10px] uppercase tracking-widest text-smoke transition-colors hover:text-accent"
                      >
                        Remove ✕
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <aside className="h-fit border border-ink/15 bg-paper p-6 lg:sticky lg:top-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em]">Summary</h2>
            <div className="ruler-ticks my-4" aria-hidden="true" />
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-smoke">Subtotal</dt>
                <dd><RollingPrice value={subtotal} className="font-mono" /></dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-smoke">Shipping</dt>
                <dd className="font-mono">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-bold">
                <dt>Total</dt>
                <dd><RollingPrice value={subtotal + shipping} className="font-mono" /></dd>
              </div>
            </dl>
            {subtotal < FREE_SHIP_THRESHOLD && (
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-smoke">
                {formatPrice(FREE_SHIP_THRESHOLD - subtotal)} away from free shipping
              </p>
            )}
            <Link
              href="/checkout"
              className="mt-6 block w-full rounded-full bg-ink py-4 text-center text-sm font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-accent"
            >
              Proceed to Checkout →
            </Link>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-smoke">
              ✱ Secure checkout · Lifetime repairs
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
