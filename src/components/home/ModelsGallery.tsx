"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";

const models = [
  {
    id: 1,
    title: "The Méridienne Tote",
    subtitle: "Structured Elegance",
    category: "Totes",
    description:
      "Full-grain Tuscan calfskin. A structured silhouette built to carry a day that refuses to end.",
    image: "/models/model-tote.png",
    slug: "meridienne-tote",
    price: "₹1,28,000",
  },
  {
    id: 2,
    title: "The Aube Crossbody",
    subtitle: "Light, Reimagined",
    category: "Crossbody",
    description:
      "Soft-pleated lambskin on an adjustable chain. Morning light, made carriable.",
    image: "/models/model-crossbody.png",
    slug: "aube-crossbody",
    price: "₹86,500",
  },
  {
    id: 3,
    title: "The Vesper Clutch",
    subtitle: "Evening Geometry",
    category: "Clutches",
    description:
      "Mirror-polish calf with a palladium clasp. An evening line that carries exactly enough.",
    image: "/models/model-clutch.png",
    slug: "vesper-clutch",
    price: "₹64,000",
  },
  {
    id: 4,
    title: "The Petit Soleil",
    subtitle: "Miniature Brilliance",
    category: "Mini Bags",
    description:
      "A mini top-handle with outsized presence. Sunlight in bag form, hand-rolled handle.",
    image: "/models/model-mini.png",
    slug: "petit-soleil",
    price: "₹58,000",
  },
  {
    id: 5,
    title: "The Rive Bucket",
    subtitle: "Riverside Composure",
    category: "Totes",
    description:
      "Drawstring ease meets suede-lined calfskin. The bucket bag, tailored for the modern woman.",
    image: "/models/model-bucket.png",
    slug: "rive-bucket",
    price: "₹92,000",
  },
  {
    id: 6,
    title: "The Voyage 48H",
    subtitle: "The Weekender",
    category: "Travel",
    description:
      "Two nights, one bag, zero compromise. Vachetta leather with a collapsible brass frame.",
    image: "/models/model-travel.png",
    slug: "voyage-48h",
    price: "₹1,96,000",
  },
];

function ModelCard({
  model,
  index,
}: {
  model: (typeof models)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative overflow-hidden ${
        index % 3 === 0
          ? "col-span-2 row-span-2 aspect-[3/4] lg:aspect-auto lg:min-h-[640px]"
          : "aspect-[3/4]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={model.image}
          alt={`Model carrying the ${model.title}`}
          fill
          sizes={
            index % 3 === 0
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 1024px) 50vw, 33vw"
          }
          className="object-cover transition-transform duration-[1.2s] ease-luxury group-hover:scale-[1.08]"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          background: hovered
            ? "linear-gradient(to top, rgba(13,10,7,0.85) 0%, rgba(13,10,7,0.3) 40%, transparent 70%)"
            : "linear-gradient(to top, rgba(13,10,7,0.6) 0%, transparent 50%)",
        }}
      />

      {/* Category badge */}
      <motion.span
        className="absolute left-5 top-5 z-10 inline-block bg-gradient-to-r from-amber-700 to-amber-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-50"
        initial={{ x: -30, opacity: 0 }}
        animate={isInView ? { x: 0, opacity: 1 } : {}}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.7 }}
      >
        {model.category}
      </motion.span>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col p-5 sm:p-7">
        <motion.div
          animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3"
        >
          <p className="text-xs leading-relaxed text-white/70 sm:text-sm">
            {model.description}
          </p>
        </motion.div>

        <h3 className="font-serif text-xl italic text-white sm:text-2xl">
          {model.title}
        </h3>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-amber-300/70">
          {model.subtitle}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-sm text-white/80">{model.price}</span>
          <Link
            href={`/product/${model.slug}`}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-300"
          >
            Explore
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M5 12h14m0 0l-5-5m5 5l-5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Hover glow border */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 border border-amber-400/20"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ModelsGallery() {
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true });

  return (
    <section className="px-4 py-16 sm:px-8" aria-label="Models Gallery">
      {/* Section header */}
      <div ref={headingRef} className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <motion.p
            className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke"
            initial={{ opacity: 0, x: -20 }}
            animate={headingInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            Editorial Campaign 2026
          </motion.p>
          <motion.h2
            className="display-mega mt-3 text-5xl leading-[0.88] sm:text-7xl lg:text-[5.5rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={headingInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            CARRIED BY
            <br />
            <span className="text-accent">THE BOLD.</span>
          </motion.h2>
        </div>
        <motion.p
          className="max-w-xs text-sm leading-relaxed text-ink/60"
          initial={{ opacity: 0, y: 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Each Elara piece photographed on real models in our atelier —
          because a silhouette means nothing until it moves.
        </motion.p>
      </div>

      {/* Gallery grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m, i) => (
          <ModelCard key={m.id} model={m} index={i} />
        ))}
      </div>

      {/* CTA */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Link
          href="/collection"
          className="group flex items-center gap-3 rounded-full border-2 border-ink bg-ink px-8 py-4 text-xs font-bold uppercase tracking-[0.25em] text-paper transition-all duration-500 hover:bg-accent hover:border-accent"
        >
          View Full Collection
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
