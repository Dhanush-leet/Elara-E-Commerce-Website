"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Phase = "playing" | "splitting" | "done";

const TOTAL_FRAMES = 51;
const frameUrls = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const frameNum = String(i + 1).padStart(3, "0");
  return `/intro-frames/ezgif-frame-${frameNum}.jpg`;
});

/**
 * Cinematic opening: the leather-bag film plays FULL LENGTH at 1x speed.
 * The website opening displays ONLY the handbag (no words, progress bars, or other overlays).
 * To prevent WebGL/canvas downsampling lag, frames are rendered as standard HTML <img> tags,
 * pre-cached, and toggled via lightweight CSS display rules.
 */
export function IntroExperience() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);
  const splitTimeoutRef = useRef<any>(null);

  const triggerSplit = () => {
    setPhase((prev) => {
      if (prev !== "playing") return prev;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return "splitting";
    });
  };

  /* ── Preload & Playback Lifecycle ─────────────────────── */
  useEffect(() => {
    let entered = false;
    try {
      entered = !!sessionStorage.getItem("elara-entered");
    } catch { /* noop */ }
    if (entered) {
      setPhase("done");
      return;
    }

    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    frameUrls.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedImages[index] = img;
        loadedCount++;
        setLoadProgress(loadedCount / TOTAL_FRAMES);

        if (loadedCount === TOTAL_FRAMES) {
          setIsLoading(false);
          loadedImagesRef.current = loadedImages;
          startPlayback();
        }
      };
      img.onerror = () => {
        console.error(`Failed to load frame: ${url}`);
        loadedCount++;
        setLoadProgress(loadedCount / TOTAL_FRAMES);
        if (loadedCount === TOTAL_FRAMES) {
          setIsLoading(false);
          loadedImagesRef.current = loadedImages;
          startPlayback();
        }
      };
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (splitTimeoutRef.current) {
        clearTimeout(splitTimeoutRef.current);
      }
    };
  }, []);

  // Write session storage gating only when the intro completes / is skipped
  useEffect(() => {
    if (phase === "done") {
      try {
        sessionStorage.setItem("elara-entered", "1");
      } catch { /* noop */ }
    }
  }, [phase]);

  const startPlayback = () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    const FPS = 10; // 1x Speed: 10 FPS (51 frames over 5.1s)
    let startTime: number | null = null;
    let lastFrameIndex = -1;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      const frameIndex = Math.min(
        Math.floor(elapsed * FPS),
        TOTAL_FRAMES - 1
      );

      if (frameIndex !== lastFrameIndex) {
        const img = imgRef.current;
        if (img) {
          img.src = frameUrls[frameIndex];
        }
        lastFrameIndex = frameIndex;
      }

      if (frameIndex < TOTAL_FRAMES - 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation finished — wait briefly, then split
        splitTimeoutRef.current = setTimeout(triggerSplit, 400);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  if (phase === "done") return null;

  const curtainTransition = {
    duration: 1.6,
    ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
  };

  if (phase === "playing") {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0d0a07]">
        {/* Loading screen: purely minimal loader with NO words */}
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-50">
            <div
              className="h-full bg-amber-400 transition-all duration-200"
              style={{ width: `${loadProgress * 100}%` }}
            />
          </div>
        )}

        {/* Cinematic Handbag Frame Player: NO overlays, text, or progress bar */}
        <div ref={containerRef} className="absolute inset-0 h-full w-full">
          <img
            ref={imgRef}
            src={frameUrls[0]}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ imageRendering: "auto" }}
            alt=""
          />
        </div>

        {/* Subtle, borderless skip chevron at bottom right */}
        {!isLoading && (
          <button
            onClick={triggerSplit}
            className="absolute bottom-7 right-7 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white/50 backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:text-white"
            aria-label="Skip"
          >
            →
          </button>
        )}
      </div>
    );
  }

  // splitting phase
  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#0d0a07]" aria-live="polite">
      {/* ═══ TOP CURTAIN ═══ */}
      <motion.div
        className="absolute left-0 top-0 w-full h-1/2 overflow-hidden border-b border-white/5"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={curtainTransition}
        onAnimationComplete={() => setPhase("done")}
      >
        <div className="absolute left-0 top-0 h-screen w-screen">
          <img
            src="/intro-frames/ezgif-frame-051.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ imageRendering: "auto" }}
            alt=""
          />
        </div>
      </motion.div>

      {/* ═══ BOTTOM CURTAIN ═══ */}
      <motion.div
        className="absolute left-0 bottom-0 w-full h-1/2 overflow-hidden border-t border-white/5"
        initial={{ y: 0 }}
        animate={{ y: "100%" }}
        transition={curtainTransition}
      >
        <div className="absolute left-0 top-[-50vh] h-screen w-screen">
          <img
            src="/intro-frames/ezgif-frame-051.jpg"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ imageRendering: "auto" }}
            alt=""
          />
        </div>
      </motion.div>

      {/* ═══ HORIZONTAL GLOW LINE (appears during split) ═══ */}
      <AnimatePresence>
        <motion.div
          className="pointer-events-none absolute left-0 top-1/2 z-[210] w-full -translate-y-1/2"
          style={{
            height: 2,
            background:
            "linear-gradient(to right, transparent 2%, #f0d68a 25%, #fff8e7 50%, #f0d68a 75%, transparent 98%)",
            boxShadow:
            "0 0 60px 12px rgba(240,214,138,0.5), 0 0 120px 30px rgba(201,169,110,0.25)",
          }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scaleX: [0.3, 1, 1, 1] }}
          transition={{ duration: 1.6, times: [0, 0.15, 0.7, 1] }}
        />
      </AnimatePresence>
    </div>
  );
}
