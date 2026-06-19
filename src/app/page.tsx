import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { Hero } from "@/components/home/Hero";
import { ModelsGallery } from "@/components/home/ModelsGallery";
import { BentoGrid } from "@/components/home/BentoGrid";
import { Showcase3D } from "@/components/home/Showcase3D";
import { ParallaxEditorial } from "@/components/home/ParallaxEditorial";
import { BestSellers } from "@/components/home/BestSellers";
import { StoryBanner } from "@/components/home/StoryBanner";

export default function HomePage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <Hero />
      <Marquee
        items={[
          "New drop now",
          "Use code ELARA_2026 for 10% off",
          "2026 Atelier Collection",
          "Free worldwide shipping",
          "Hand-finished in small ateliers",
        ]}
      />
      <ModelsGallery />
      <div className="ruler-ticks mx-4 sm:mx-8" aria-hidden="true" />
      <ParallaxEditorial />
      <Marquee
        items={[
          "Carried by the bold",
          "Lifetime repairs included",
          "Elara Pop-Up — Jio World Plaza, June 2026",
          "Vegetable-tanned leathers only",
        ]}
        reverse
      />
      <BentoGrid />
      <div className="ruler-ticks mx-4 sm:mx-8" aria-hidden="true" />
      <Showcase3D />
      <BestSellers />
      <div className="ruler-ticks mx-4 sm:mx-8" aria-hidden="true" />
      <StoryBanner />
      <Footer />
    </main>
  );
}
