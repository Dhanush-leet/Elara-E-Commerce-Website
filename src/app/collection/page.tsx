import { Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CollectionClient } from "@/components/collection/CollectionClient";

export const metadata = { title: "Collection — ELARA" };

export default function CollectionPage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <Suspense fallback={<div className="skeleton mx-4 h-96 sm:mx-8" />}>
        <CollectionClient />
      </Suspense>
      <Footer />
    </main>
  );
}
