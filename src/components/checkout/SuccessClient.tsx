"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/products";
import type { CartItem } from "@/lib/store";

type Order = {
  id: string;
  total: number;
  items: CartItem[];
  name: string;
  email: string;
  placedAt: string;
};

function SubtleConfetti() {
  const pieces = Array.from({ length: 18 });
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-hidden" aria-hidden="true">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5"
          style={{
            left: `${(i * 53) % 100}%`,
            background: i % 4 === 0 ? "#e8442e" : i % 4 === 1 ? "#b08d57" : i % 4 === 2 ? "#141210" : "#8a857c",
          }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 240, opacity: [0, 1, 1, 0], rotate: 260 }}
          transition={{ duration: 2.4 + (i % 5) * 0.3, delay: i * 0.06, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}

export function SuccessClient() {
  const [order, setOrder] = useState<Order | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("elara-last-order");
    if (raw) setOrder(JSON.parse(raw));
    else setMissing(true);
  }, []);

  if (missing) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="font-serif text-3xl italic text-smoke">No recent order found.</p>
        <Link href="/collection" className="pill-solid mt-8 inline-flex">Explore the Collection</Link>
      </div>
    );
  }

  if (!order) return <div className="skeleton mx-auto my-20 h-96 max-w-2xl" />;

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-16 text-center sm:px-8">
      <SubtleConfetti />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-ink"
      >
        <svg width="40" height="32" viewBox="0 0 13 11" fill="none" aria-hidden="true">
          <path d="M1 5.5L4.8 9.5L12 1.5" stroke="#f4f1ec" strokeWidth="1.6" className="check-draw" />
        </svg>
      </motion.div>

      <h1 className="display-mega mt-8 text-5xl sm:text-6xl">
        Order<br />Confirmed
      </h1>
      <p className="mt-4 font-serif text-xl italic text-ink/70">
        Thank you, {order.name.split(" ")[0] || "friend"} — your pieces are
        being wrapped in the atelier.
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-smoke">
        Order {order.id} · confirmation sent to {order.email}
      </p>

      <div className="mt-10 border border-ink/15 bg-paper p-6 text-left">
        <h2 className="text-xs font-bold uppercase tracking-[0.25em]">Summary</h2>
        <div className="ruler-ticks my-4" aria-hidden="true" />
        <ul className="flex flex-col gap-3">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between text-sm">
              <span>{i.name} <span className="font-mono text-xs text-smoke">× {i.qty}</span></span>
              <span className="font-mono">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-ink/10 pt-4 font-bold">
          <span>Total Paid</span>
          <span className="font-mono">{formatPrice(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/account" className="pill px-8 py-3.5">Track Order</Link>
        <Link href="/collection" className="pill-solid px-8 py-3.5">Continue Shopping →</Link>
      </div>
    </div>
  );
}
