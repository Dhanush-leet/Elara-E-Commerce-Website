import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { SplitHeading } from "@/components/SplitHeading";
import { SmartImage } from "@/components/SmartImage";

export const metadata = { title: "The Atelier — ELARA" };

const chapters = [
  {
    id: "ateliers",
    eyebrow: "Our Ateliers",
    title: ["MADE BY", "HAND, NOT", "BY MACHINE"],
    body: "Every ELARA piece is cut, folded and stitched in small ateliers across Paris, Mumbai and Tokyo. A single artisan sees a bag from hide to finish — their initials are pressed inside the lining.",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "craftsmanship",
    eyebrow: "Craftsmanship",
    title: ["THREE DAYS", "PER BAG.", "NO SHORTCUTS"],
    body: "We burnish edges by hand over three days, saddle-stitch with waxed linen thread, and set every rivet by eye. The result wears in, not out — softening into a patina that is yours alone.",
    image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "sustainability",
    eyebrow: "Sustainability",
    title: ["VEGETABLE", "TANNED.", "BUILT TO LAST"],
    body: "We use only vegetable-tanned leathers from certified tanneries, recycled-cotton dust bags, and plastic-free packaging. A bag built to last a lifetime is the most sustainable bag there is.",
    image: "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function AtelierPage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />

      <section className="px-4 py-12 sm:px-8">
        <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
          The Maison
        </p>
        <SplitHeading
          lines={["THE ATELIER"]}
          as="h1"
          className="display-mega mt-3 text-[15vw] leading-none sm:text-[11vw]"
        />
        <p className="mt-6 max-w-xl font-serif text-2xl italic text-ink/70">
          A house built on the belief that the way a thing is made matters as
          much as the thing itself.
        </p>
      </section>

      <Marquee
        items={["Hand-finished", "Vegetable-tanned", "Lifetime repairs", "Plastic-free", "Made in small ateliers"]}
      />

      {chapters.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          className="grid scroll-mt-24 items-center gap-8 px-4 py-16 sm:px-8 lg:grid-cols-2"
        >
          <div className={i % 2 === 1 ? "lg:order-2" : ""}>
            <p className="eyebrow-dot font-mono text-[10px] uppercase tracking-[0.3em] text-smoke">
              {c.eyebrow}
            </p>
            <SplitHeading lines={c.title} className="display-mega mt-4 text-5xl sm:text-7xl" />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-ink/70">{c.body}</p>
          </div>
          <div className={`relative aspect-[4/3] overflow-hidden bg-stone ${i % 2 === 1 ? "lg:order-1" : ""}`}>
            <SmartImage src={c.image} alt={c.eyebrow} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
        </section>
      ))}

      {/* Care section */}
      <section id="care" className="scroll-mt-24 bg-paper px-4 py-16 sm:px-8">
        <SplitHeading lines={["CARE & REPAIRS"]} className="display-mega text-4xl sm:text-6xl" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Shipping & Returns", "Free worldwide shipping over ₹50,000. 30-day returns on unworn pieces."],
            ["Leather Care", "Wipe with a soft dry cloth. Condition twice a year. Store in the dust bag away from direct sun."],
            ["Repairs", "Every bag carries a lifetime repair promise. Bring it to any atelier or post it to us."],
            ["Contact", "atelier@elara.maison · concierge available 9–6 IST, Monday to Saturday."],
          ].map(([title, body]) => (
            <div key={title} id={title.toLowerCase().split(" ")[0]} className="scroll-mt-24 border border-ink/15 p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{title}</h3>
              <div className="ruler-ticks my-3" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink/70">{body}</p>
            </div>
          ))}
        </div>
        <Link href="/collection" className="pill-solid mt-10 inline-flex">
          Explore the Collection →
        </Link>
      </section>

      <Footer />
    </main>
  );
}
