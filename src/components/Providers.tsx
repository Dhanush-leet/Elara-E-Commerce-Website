"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ReducedMotionContext = createContext(false);
export const useReducedMotion = () => useContext(ReducedMotionContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);

    if (!mq.matches) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      return () => {
        mq.removeEventListener("change", onChange);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    }
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <ReducedMotionContext.Provider value={reduced}>
          {children}
        </ReducedMotionContext.Provider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
