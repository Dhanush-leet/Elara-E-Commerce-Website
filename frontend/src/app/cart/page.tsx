import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata = { title: "Your Bag — ELARA" };

export default function CartPage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <CartPageClient />
      <Footer />
    </main>
  );
}
