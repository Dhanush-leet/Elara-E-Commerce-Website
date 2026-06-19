"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/store";

export function Toaster() {
  const { toasts, dismissToast } = useUI();
  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-[180] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => dismissToast(t.id)}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink px-5 py-3 text-xs uppercase tracking-widest text-paper shadow-2xl"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
