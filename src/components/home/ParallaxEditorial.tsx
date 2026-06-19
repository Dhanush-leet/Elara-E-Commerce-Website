"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const EDITORIAL_ITEMS = [
  {
    title: "THE ART OF LEATHER",
    copy: "Every hide is selected by hand, tanned slowly over weeks in Tuscan workshops, and finished with edge paint mixed to our exact specification.",
    image: "/models/model-tote.png",
    align: "left" as const,
  },
  {
    title: "DESIGNED TO MOVE",
    copy: "Our silhouettes are sculpted on moving forms — not dress mannequins. Because a bag should look as extraordinary in motion as it does at rest.",
    image: "/models/model-crossbody.png",
    align: "right" as const,
  },
];

function ParallaxItem({
  item,
  index,
}: {
  item: (typeof EDITORIAL_ITEMS)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1]);

  const isRight = item.align === "right";

  return (
    <div
      ref={ref}
      className={`grid items-center gap-6 lg:grid-cols-2 ${
        isRight ? "lg:[direction:rtl]" : ""
      }`}
    >
      {/* Image */}
      <motion.div
        className="relative aspect-[3/4] overflow-hidden lg:aspect-[4/5] lg:[direction:ltr]"
        initial={{ opacity: 0, x: isRight ? 60 : -60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex flex-col justify-center px-2 sm:px-6 lg:px-12 lg:[direction:ltr]"
        style={{ y }}
      >
        <motion.span
          className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-smoke"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {String(index + 1).padStart(2, "0")} / {String(EDITORIAL_ITEMS.length).padStart(2, "0")}
        </motion.span>

        <motion.h3
          className="display-mega text-4xl sm:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {item.title.split(" ").map((word, wi) => (
            <span key={wi}>
              {wi === item.title.split(" ").length - 1 ? (
                <span className="text-accent">{word}</span>
              ) : (
                word
              )}{" "}
            </span>
          ))}
        </motion.h3>

        <motion.p
          className="mt-6 max-w-sm text-sm leading-relaxed text-ink/60"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {item.copy}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <Link
            href="/collection"
            className="mt-8 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent"
          >
            Discover More
            <span className="h-px w-10 bg-current transition-all duration-300 group-hover:w-16" />
            <span className="text-accent">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ParallaxEditorial() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="space-y-20 px-4 py-20 sm:px-8 lg:space-y-32"
      aria-label="Editorial story"
    >
      {/* Section intro */}
      <div className="mx-auto max-w-2xl text-center">
        <motion.p
          className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7 }}
        >
          Our Craft
        </motion.p>
        <motion.h2
          className="display-mega mt-4 text-4xl sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          EVERY DETAIL,
          <br />
          <span className="font-serif text-[0.85em] font-normal italic text-ink/50">
            intentional.
          </span>
        </motion.h2>
      </div>

      {EDITORIAL_ITEMS.map((item, i) => (
        <ParallaxItem key={item.title} item={item} index={i} />
      ))}
    </section>
  );
}
