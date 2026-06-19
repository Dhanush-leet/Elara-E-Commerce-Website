"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart, useUI, cartTotal } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { SmartImage } from "./SmartImage";
import { RollingPrice } from "./RollingNumber";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { items, setQty, remove } = useCart();
  const total = cartTotal(items);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[120] bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[130] flex w-full max-w-md flex-col bg-canvas"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="display-mega text-2xl">
                Your Bag <span className="font-mono text-sm text-smoke">({items.length})</span>
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="pill"
                aria-label="Close cart"
              >
                Close ✕
              </button>
            </div>

            <div className="ruler-ticks" aria-hidden="true" />

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="font-serif text-2xl italic text-smoke">
                    Your bag is beautifully empty.
                  </p>
                  <Link
                    href="/collection"
                    onClick={() => setCartOpen(false)}
                    className="pill-solid"
                  >
                    Explore the Collection
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-5">
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.li
                        key={i.id}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0 }}
                        className="flex gap-4 border-b border-ink/10 pb-5"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-stone">
                          <SmartImage src={i.image} alt={i.name} fill sizes="80px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <Link
                              href={`/product/${i.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="text-sm font-semibold uppercase tracking-wider hover:text-accent"
                            >
                              {i.name}
                            </Link>
                            <button
                              onClick={() => remove(i.id)}
                              aria-label={`Remove ${i.name}`}
                              className="text-smoke transition-colors hover:text-accent"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-smoke">
                            {i.color} · {i.size}
                          </p>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-ink/20">
                              <button
                                onClick={() => setQty(i.id, i.qty - 1)}
                                className="px-3 py-1 hover:text-accent"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="w-6 text-center font-mono text-xs">{i.qty}</span>
                              <button
                                onClick={() => setQty(i.id, i.qty + 1)}
                                className="px-3 py-1 hover:text-accent"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <span className="font-mono text-sm">{formatPrice(i.price * i.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink/10 bg-paper px-6 py-5">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="uppercase tracking-widest text-smoke">Subtotal</span>
                  <RollingPrice value={total} className="font-mono text-lg" />
                </div>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-smoke">
                  Duties & shipping calculated at checkout
                </p>
                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    className="pill flex-1 justify-center py-3"
                  >
                    Review Bag
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="pill-solid flex-1 justify-center py-3"
                  >
                    Checkout →
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
