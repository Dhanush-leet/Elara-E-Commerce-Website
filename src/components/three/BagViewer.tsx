"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Bag } from "./Bag";
import type { BagModel } from "@/lib/products";
import { useReducedMotion } from "../Providers";

export type LightPreset = "studio" | "golden" | "boutique";

const presets: Record<
  LightPreset,
  { key: string; fill: string; rim: string; keyI: number; fillI: number; rimI: number; bg: string }
> = {
  studio: { key: "#ffffff", fill: "#dfe6f0", rim: "#ffffff", keyI: 2.6, fillI: 0.9, rimI: 1.6, bg: "#f4f1ec" },
  golden: { key: "#ffc987", fill: "#ff9d6b", rim: "#ffe8c2", keyI: 2.2, fillI: 0.7, rimI: 2.2, bg: "#f3e7d3" },
  boutique: { key: "#fff3e0", fill: "#caa3ff", rim: "#86b6ff", keyI: 1.9, fillI: 0.8, rimI: 1.8, bg: "#ece6e9" },
};

function Lights({ preset }: { preset: LightPreset }) {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const p = presets[preset];

  useFrame((_, delta) => {
    const k = 1 - Math.pow(0.005, delta); // smooth re-light ~800ms
    for (const [ref, color, intensity] of [
      [keyRef, p.key, p.keyI],
      [fillRef, p.fill, p.fillI],
      [rimRef, p.rim, p.rimI],
    ] as const) {
      if (!ref.current) continue;
      ref.current.color.lerp(new THREE.Color(color), k);
      ref.current.intensity += (intensity - ref.current.intensity) * k;
    }
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight ref={keyRef} position={[3, 4, 4]} intensity={p.keyI} castShadow />
      <directionalLight ref={fillRef} position={[-4, 1, 2]} intensity={p.fillI} />
      <directionalLight ref={rimRef} position={[0, 3, -5]} intensity={p.rimI} />
    </>
  );
}

/** Rotates the model group with scroll progress — never touches the camera,
 *  so it composes cleanly with OrbitControls drag. */
function ScrollRig({
  progress,
  children,
}: {
  progress: React.MutableRefObject<number>;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const t = progress.current;
    const target = t * Math.PI * 1.6;
    group.current.rotation.y += (target - group.current.rotation.y) * 0.08;
    group.current.rotation.x = Math.sin(t * Math.PI) * 0.12;
  });
  return <group ref={group}>{children}</group>;
}

export function BagViewer({
  model = "tote",
  leather,
  hardware,
  preset = "studio",
  interactive = true,
  float = false,
  scrollProgress,
  className = "",
}: {
  model?: BagModel;
  leather: string;
  hardware: string;
  preset?: LightPreset;
  interactive?: boolean;
  /** gently float + auto-rotate the bag (pedestal showcase) */
  float?: boolean;
  /** optional 0..1 ref driven by an external ScrollTrigger */
  scrollProgress?: React.MutableRefObject<number>;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!c.getContext("webgl2") && !c.getContext("webgl")) setWebgl(false);
    } catch {
      setWebgl(false);
    }
  }, []);

  // Lazy-mount the canvas only when near the viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!webgl) {
    return (
      <div
        ref={wrapRef}
        className={`flex items-center justify-center bg-gradient-to-b from-stone to-canvas ${className}`}
      >
        <div className="text-center">
          <div
            className="mx-auto h-40 w-40 rounded-3xl shadow-2xl transition-colors duration-700"
            style={{ background: leather }}
            aria-hidden="true"
          />
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
            360° view unavailable — showing finish preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      data-cursor={interactive ? "rotate" : undefined}
      aria-label="Interactive 3D handbag viewer. Drag to rotate."
      role="img"
    >
      {inView && (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.35, 4.8], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Lights preset={preset} />
            {float ? (
              <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
                <Bag model={model} leather={leather} hardware={hardware} autoRotate={!reduced} />
              </Float>
            ) : scrollProgress && !reduced ? (
              <ScrollRig progress={scrollProgress}>
                <Bag model={model} leather={leather} hardware={hardware} autoRotate={false} />
              </ScrollRig>
            ) : (
              <Bag model={model} leather={leather} hardware={hardware} autoRotate={!reduced} />
            )}
            <ContactShadows position={[0, -0.85, 0]} opacity={0.4} scale={6} blur={2.6} far={2.2} />
            {interactive && (
              <OrbitControls
                enablePan={false}
                enableDamping
                dampingFactor={0.06}
                minDistance={2.6}
                maxDistance={7}
                maxPolarAngle={Math.PI * 0.72}
              />
            )}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
