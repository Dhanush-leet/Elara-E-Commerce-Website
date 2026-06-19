import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SuccessClient } from "@/components/checkout/SuccessClient";

export const metadata = { title: "Order Confirmed — ELARA" };

export default function SuccessPage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <SuccessClient />
      <Footer />
    </main>
  );
}
