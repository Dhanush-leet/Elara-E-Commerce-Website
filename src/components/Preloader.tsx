"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Skip preloader on client-side navigations within the session
    if (sessionStorage.getItem("elara-loaded")) {
      setDone(true);
      return;
    }
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 16 + 4);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(tick);
        sessionStorage.setItem("elara-loaded", "1");
        setTimeout(() => setDone(true), 450);
      }
    }, 110);
    return () => clearInterval(tick);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-frame text-paper"
          exit={{
            clipPath: "inset(50% 0 50% 0)",
            transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
          }}
          aria-label="Loading ELARA"
        >
          <svg viewBox="0 0 240 90" className="w-56" aria-hidden="true">
            <motion.text
              x="120"
              y="62"
              textAnchor="middle"
              fontSize="58"
              fontStyle="italic"
              fill="none"
              stroke="#f4f1ec"
              strokeWidth="1"
              style={{ fontFamily: "var(--font-serif)" }}
              initial={{ strokeDasharray: 600, strokeDashoffset: 600 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              elara
            </motion.text>
          </svg>
          <div className="mt-8 font-mono text-xs tracking-[0.4em] text-paper/60">
            {String(progress).padStart(3, "0")}%
          </div>
          <div className="mt-3 h-px w-40 overflow-hidden bg-paper/15">
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
