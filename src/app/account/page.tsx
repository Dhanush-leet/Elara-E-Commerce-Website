import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AccountClient } from "@/components/account/AccountClient";

export const metadata = { title: "Account — ELARA" };

export default function AccountPage() {
  return (
    <main>
      <Nav />
      <div className="ruler-ticks ruler-ticks-tall mx-4 sm:mx-8" aria-hidden="true" />
      <AccountClient />
      <Footer />
    </main>
  );
}
