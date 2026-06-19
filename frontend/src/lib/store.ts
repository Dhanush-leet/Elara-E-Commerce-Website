"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./products";

export type CartItem = {
  id: string; // productId|color|size
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (p: Product, color: string, size: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (p, color, size, qty = 1) =>
        set((s) => {
          const id = `${p.id}|${color}|${size}`;
          const existing = s.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              {
                id,
                productId: p.id,
                slug: p.slug,
                name: p.name,
                image: p.image,
                price: p.price,
                color,
                size,
                qty,
              },
            ],
          };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.id !== id)
              : s.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "elara-cart" }
  )
);

export const cartCount = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty, 0);
export const cartTotal = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.qty * i.price, 0);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id)
            ? s.ids.filter((x) => x !== id)
            : [...s.ids, id],
        })),
    }),
    { name: "elara-wishlist" }
  )
);

export type Toast = { id: number; message: string };

type UIState = {
  cartOpen: boolean;
  menuOpen: boolean;
  toasts: Toast[];
  setCartOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  toast: (message: string) => void;
  dismissToast: (id: number) => void;
};

let toastId = 0;

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  menuOpen: false,
  toasts: [],
  setCartOpen: (v) => set({ cartOpen: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  toast: (message) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      3200
    );
  },
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
