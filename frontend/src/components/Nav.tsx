"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useCart, useUI, cartCount } from "@/lib/store";
import { categories } from "@/lib/products";
import { Magnetic } from "./MagneticButton";

export function Nav() {
  const items = useCart((s) => s.items);
  const { setCartOpen, setMenuOpen } = useUI();
  const count = cartCount(items);
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <header className="relative z-40">
      {/* Top bar */}
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-8">
        <div className="flex justify-start">
          <Magnetic>
            <button
              onClick={() => setMenuOpen(true)}
              className="pill"
              aria-label="Open menu"
            >
              Menu <span aria-hidden="true" className="text-sm leading-none">≡</span>
            </button>
          </Magnetic>
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl italic tracking-tight sm:text-3xl"
          aria-label="ELARA home"
        >
          <span className="font-semibold">elara</span>
        </Link>

        <div className="flex items-center justify-end gap-2">
          {session ? (
            <details className="group relative hidden sm:block">
              <summary className="pill list-none [&::-webkit-details-marker]:hidden">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-bold text-paper">
                  {firstName?.[0]?.toUpperCase() ?? "E"}
                </span>
                {firstName ?? "Account"}
              </summary>
              <div className="absolute right-0 top-full z-50 mt-2 flex min-w-44 flex-col rounded-2xl border border-ink/15 bg-paper p-2 shadow-xl">
                <Link href="/account" className="rounded-xl px-4 py-2 text-xs uppercase tracking-wider hover:bg-stone">
                  My Elara
                </Link>
                <Link href="/account" className="rounded-xl px-4 py-2 text-xs uppercase tracking-wider hover:bg-stone">
                  Orders
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="rounded-xl px-4 py-2 text-left text-xs uppercase tracking-wider text-accent hover:bg-stone"
                >
                  Sign Out
                </button>
              </div>
            </details>
          ) : (
            <Link href="/login" className="pill hidden sm:inline-flex">
              Login
            </Link>
          )}
          <Magnetic>
            <button
              onClick={() => setCartOpen(true)}
              className="pill-solid relative"
              aria-label={`Open cart, ${count} items`}
            >
              <span className="hidden sm:inline">Cart</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={count}
                  initial={{ scale: 1.6, color: "#e8442e" }}
                  animate={{ scale: 1, color: "#faf8f4" }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="font-mono text-[10px]"
                >
                  ({count})
                </motion.span>
              </AnimatePresence>
              <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-paper text-ink" aria-hidden="true">
                <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                  <path d="M1 4h9l-.7 7H1.7L1 4Z" stroke="currentColor" />
                  <path d="M3.5 4V3a2 2 0 1 1 4 0v1" stroke="currentColor" />
                </svg>
              </span>
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Utility row */}
      <div className="flex flex-wrap items-center gap-2 px-4 pb-4 sm:px-8">
        <details className="group relative">
          <summary className="pill list-none [&::-webkit-details-marker]:hidden" data-cursor="">
            Categories
            <svg width="9" height="6" viewBox="0 0 9 6" className="transition-transform group-open:rotate-180">
              <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" />
            </svg>
          </summary>
          <div className="absolute left-0 top-full z-50 mt-2 flex min-w-44 flex-col rounded-2xl border border-ink/15 bg-paper p-2 shadow-xl">
            {categories.filter((c) => c !== "All").map((c) => (
              <Link
                key={c}
                href={`/collection?category=${encodeURIComponent(c)}`}
                className="rounded-xl px-4 py-2 text-xs uppercase tracking-wider hover:bg-stone"
              >
                {c}
              </Link>
            ))}
          </div>
        </details>

        <Link href="/collection?sort=new" className="pill">
          New Arrivals
          <svg width="9" height="6" viewBox="0 0 9 6"><path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" /></svg>
        </Link>

        <form
          action="/collection"
          className={`flex items-center overflow-hidden rounded-full border border-ink/20 bg-paper transition-all duration-500 ease-luxury ${searchOpen ? "w-64" : "w-28 sm:w-40"}`}
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
        >
          <span className="pl-4 text-smoke" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" />
              <path d="M9 9l3 3" stroke="currentColor" />
            </svg>
          </span>
          <input
            type="search"
            name="q"
            placeholder="Search"
            aria-label="Search products"
            className="w-full bg-transparent px-3 py-2 text-xs uppercase tracking-wider placeholder:text-smoke focus:outline-none"
          />
        </form>

        <div className="ml-auto hidden gap-2 lg:flex">
          {["Totes", "Crossbody", "Clutches", "Mini Bags", "Travel"].map((c) => (
            <Link
              key={c}
              href={`/collection?category=${encodeURIComponent(c)}`}
              className="pill"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
