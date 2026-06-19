"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/** Masked line-by-line slide-up reveal for headings. */
export function SplitHeading({
  lines,
  className = "",
  as: Tag = "h2",
}: {
  lines: string[];
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <Tag className={className}>
      <span ref={ref} className="block">
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={inView ? { y: 0 } : undefined}
              transition={{
                delay: i * 0.08,
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
