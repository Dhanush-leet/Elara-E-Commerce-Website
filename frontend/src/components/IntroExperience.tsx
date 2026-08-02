"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Phase = "playing" | "fading" | "done";

export function IntroExperience() {
  const [phase, setPhase] = useState<Phase>("playing");
  const videoRef = useRef<HTMLVideoElement>(null);

  const triggerExit = () => {
    setPhase((prev) => (prev === "playing" ? "fading" : prev));
  };

  useEffect(() => {
    let entered = false;
    try {
      entered = !!sessionStorage.getItem("elara-entered");
    } catch { /* noop */ }
    if (entered) {
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (phase === "fading") {
      try {
        sessionStorage.setItem("elara-entered", "1");
      } catch { /* noop */ }
      const t = setTimeout(() => setPhase("done"), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {phase !== "fading" && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black overflow-hidden flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* 4K Cinematic Handbag Video */}
          <video
            ref={videoRef}
            src="https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-woman-holding-a-brown-leather-bag-40011-large.mp4"
            autoPlay
            muted
            playsInline
            onEnded={triggerExit}
            className="absolute inset-0 h-full w-full object-cover opacity-75"
          />

          {/* Luxury Cinematic Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000_100%)] pointer-events-none" />
          
          {/* Grand Elara Branding */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
            className="absolute z-10 text-white text-center uppercase pointer-events-none"
          >
            <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-[0.3em] font-light text-white/90">Elara</h1>
            <p className="text-xs md:text-sm text-white/50 tracking-[0.8em]">The New Collection</p>
          </motion.div>

          {/* Elegant Skip Button */}
          <button
            onClick={triggerExit}
            className="absolute bottom-10 right-10 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/60 backdrop-blur-md transition-all duration-700 hover:bg-white hover:text-black hover:scale-110"
            aria-label="Skip to site"
          >
            <span className="font-light text-xl">→</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
