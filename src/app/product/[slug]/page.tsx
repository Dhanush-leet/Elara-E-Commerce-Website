import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Marquee } from "@/components/Marquee";
import { getProduct, products } from "@/lib/products";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { CompleteTheLook } from "@/components/product/CompleteTheLook";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProduct(params.slug);
  return { title: p ? `${p.name} — ELARA` : "ELARA" };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  return (
    <main>
      <Nav />
      <div className="ruler-ticks mx-4 sm:mx-8" aria-hidden="true" />
      <ProductDetailClient product={product} />
      <Marquee
        items={[
          "Hand-finished over three days",
          "Lifetime repairs included",
          "Vegetable-tanned leather",
          "Ships in recycled cotton dust bag",
        ]}
      />
      <CompleteTheLook current={product} />
      <Footer />
    </main>
  );
}
