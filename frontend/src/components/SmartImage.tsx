"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image with a graceful editorial fallback if the remote
 * photograph fails to load (offline dev, CDN hiccup).
 */
export function SmartImage({
  alt,
  className = "",
  ...props
}: ImageProps & { alt: string }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-stone via-canvas to-stone ${className}`}
      >
        <span className="rotate-[-4deg] font-serif text-2xl italic text-smoke">
          elara
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className="skeleton absolute inset-0" aria-hidden="true" />}
      <Image
        alt={alt}
        {...props}
        className={`${className} transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
