import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <div className="px-4 py-24 text-center sm:px-8">
        <h1 className="display-mega text-[20vw] leading-none sm:text-[12vw]">404</h1>
        <p className="mt-4 font-serif text-2xl italic text-smoke">
          This page slipped out of the bag.
        </p>
        <Link href="/" className="pill-solid mt-8 inline-flex">← Back home</Link>
      </div>
      <Footer />
    </main>
  );
}
