import type { Metadata } from "next";
import { Anton, Cormorant_Garamond, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { IntroExperience } from "@/components/IntroExperience";
import { CustomCursor } from "@/components/CustomCursor";
import { Toaster } from "@/components/Toaster";
import { CartDrawer } from "@/components/CartDrawer";
import { MenuOverlay } from "@/components/MenuOverlay";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const serif = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Archivo({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELARA — Carry the Extraordinary",
  description:
    "Luxury handbags, hand-finished in small ateliers. Editorial silhouettes for modern movement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans grain-overlay">
        <Providers>
          <IntroExperience />
          <div className="site-frame" aria-hidden="true" />
          <div className="page-canvas">{children}</div>
          <CartDrawer />
          <MenuOverlay />
          <Toaster />
          <CustomCursor />
        </Providers>
      </body>
    </html>
  );
}
