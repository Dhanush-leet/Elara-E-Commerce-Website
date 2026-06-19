import { Nav } from "@/components/Nav";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export const metadata = { title: "Checkout — ELARA" };

export default function CheckoutPage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <CheckoutClient />
    </main>
  );
}
