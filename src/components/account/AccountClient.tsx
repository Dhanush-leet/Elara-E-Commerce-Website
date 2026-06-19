"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { products, formatPrice } from "@/lib/products";
import { useWishlist, type CartItem } from "@/lib/store";
import { ProductCard } from "../ProductCard";
import { SplitHeading } from "../SplitHeading";

type Order = {
  id: string;
  total: number;
  items: CartItem[];
  name: string;
  email: string;
  placedAt: string;
};

const tabs = ["Orders", "Wishlist", "Addresses", "Profile"] as const;
type Tab = (typeof tabs)[number];

const orderStages = ["Confirmed", "In the Atelier", "Shipped", "Delivered"];

function OrderTimeline({ order, stage }: { order: Order; stage: number }) {
  return (
    <article className="border border-ink/15 bg-paper p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-mono text-sm font-bold">{order.id}</h3>
        <span className="font-mono text-xs text-smoke">
          {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>
      <p className="mt-1 text-sm text-ink/70">
        {order.items.map((i) => i.name).join(", ")} — <span className="font-mono">{formatPrice(order.total)}</span>
      </p>

      <ol className="mt-6 flex items-center" aria-label="Order status">
        {orderStages.map((s, i) => (
          <li key={s} className={`flex items-center ${i < orderStages.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                  i <= stage ? "border-accent bg-accent" : "border-ink/25 bg-paper"
                }`}
                aria-hidden="true"
              />
              <span className={`font-mono text-[8px] uppercase tracking-[0.2em] sm:text-[9px] ${i <= stage ? "text-ink" : "text-smoke"}`}>
                {s}
              </span>
            </div>
            {i < orderStages.length - 1 && (
              <div className="relative mx-1 mb-4 h-px flex-1 bg-ink/15 sm:mx-2">
                <div
                  className="absolute inset-y-0 left-0 bg-accent transition-all duration-1000 ease-luxury"
                  style={{ width: i < stage ? "100%" : "0%" }}
                />
              </div>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

type Address = { label: string; line: string; city: string; pin: string };

export function AccountClient() {
  const [tab, setTab] = useState<Tab>("Orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addingAddress, setAddingAddress] = useState(false);
  const [draft, setDraft] = useState<Address>({ label: "", line: "", city: "", pin: "" });
  const ids = useWishlist((s) => s.ids);
  const wished = products.filter((p) => ids.includes(p.id));
  const { data: session, status } = useSession();

  useEffect(() => {
    setOrders(JSON.parse(localStorage.getItem("elara-orders") ?? "[]"));
    setAddresses(JSON.parse(localStorage.getItem("elara-addresses") ?? "[]"));
  }, []);

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const next = [...addresses, draft];
    setAddresses(next);
    localStorage.setItem("elara-addresses", JSON.stringify(next));
    setDraft({ label: "", line: "", city: "", pin: "" });
    setAddingAddress(false);
  };

  const removeAddress = (i: number) => {
    const next = addresses.filter((_, idx) => idx !== i);
    setAddresses(next);
    localStorage.setItem("elara-addresses", JSON.stringify(next));
  };

  if (status === "unauthenticated") {
    return (
      <div className="px-4 py-24 text-center sm:px-8">
        <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
          Members Atelier
        </p>
        <h1 className="display-mega mt-4 text-[14vw] leading-none sm:text-[7vw]">
          Sign in to<br />your Elara
        </h1>
        <p className="mt-4 font-serif text-xl italic text-smoke">
          Your orders, wishlist and addresses live behind the door.
        </p>
        <Link href="/login?callbackUrl=/account" className="pill-solid mt-8 inline-flex">
          Sign In or Create Account →
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-8">
      <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
        Members Atelier
      </p>
      <SplitHeading
        lines={["MY ELARA"]}
        as="h1"
        className="display-mega mt-3 text-[13vw] leading-none sm:text-[8vw]"
      />

      <div className="mt-8 flex flex-wrap gap-2 border-b border-ink/10 pb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`pill ${tab === t ? "!border-ink !bg-ink !text-paper" : ""}`}
          >
            {t}
            {t === "Wishlist" && wished.length > 0 && (
              <span className="font-mono text-[10px] text-accent">({wished.length})</span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-[40vh] py-10"
        >
          {tab === "Orders" &&
            (orders.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-serif text-2xl italic text-smoke">No orders yet.</p>
                <Link href="/collection" className="pill-solid mt-6 inline-flex">Start your collection →</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {orders.map((o, i) => (
                  <OrderTimeline key={o.id} order={o} stage={Math.min(i === 0 ? 1 : 3, 3)} />
                ))}
              </div>
            ))}

          {tab === "Wishlist" &&
            (wished.length === 0 ? (
              <div className="py-12 text-center">
                <p className="font-serif text-2xl italic text-smoke">
                  Tap the ♥ on any piece to keep it here.
                </p>
                <Link href="/collection" className="pill-solid mt-6 inline-flex">Browse the Collection →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
                {wished.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ))}

          {tab === "Addresses" && (
            <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
              {addresses.map((a, i) => (
                <div key={i} className="border border-ink/15 bg-paper p-6">
                  {i === 0 && <span className="badge-accent">Default</span>}
                  <p className="mt-4 text-sm font-semibold">{a.label || "Address"}</p>
                  <p className="mt-1 text-sm text-ink/70">{a.line}, {a.city} {a.pin}</p>
                  <button
                    onClick={() => removeAddress(i)}
                    className="mt-3 font-mono text-[10px] uppercase tracking-widest text-smoke hover:text-accent"
                  >
                    Remove ✕
                  </button>
                </div>
              ))}

              {addingAddress ? (
                <form onSubmit={saveAddress} className="flex flex-col gap-2 border border-ink/15 bg-paper p-5">
                  {([["label", "Label (Home, Office…)"], ["line", "Street address"], ["city", "City"], ["pin", "PIN code"]] as const).map(([k, ph]) => (
                    <input
                      key={k}
                      required
                      value={draft[k]}
                      onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                      placeholder={ph}
                      className="w-full rounded-xl border border-ink/20 px-3 py-2 text-sm focus:border-ink focus:outline-none"
                    />
                  ))}
                  <div className="mt-1 flex gap-2">
                    <button type="submit" className="pill-solid flex-1 justify-center">Save</button>
                    <button type="button" onClick={() => setAddingAddress(false)} className="pill">Cancel</button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setAddingAddress(true)}
                  className="flex min-h-36 items-center justify-center border border-dashed border-ink/30 font-mono text-xs uppercase tracking-widest text-smoke transition-colors hover:border-accent hover:text-accent"
                >
                  + Add address
                </button>
              )}
            </div>
          )}

          {tab === "Profile" && (
            <div className="max-w-md">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ink font-serif text-3xl italic text-paper">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "e"}
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {session?.user?.name ?? "Guest of the Maison"}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-widest text-smoke">
                    {session?.user?.email ?? "Member since June 2026"}
                  </p>
                </div>
              </div>
              <div className="ruler-ticks my-6" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink/70">
                Your bag, wishlist and orders are tied to this account. A welcome
                note has been sent to your inbox — saved payment methods and
                atelier appointments arrive with the next release.
              </p>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="pill mt-6"
              >
                Sign Out
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
