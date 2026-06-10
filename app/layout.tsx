import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Police principale — UI et titres
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

// Police accent éditorial — italique pour les <em>
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tennis Club de Davézieux — Tennis & Padel en Ardèche",
    template: "%s — TC Davézieux",
  },
  description:
    "4 courts de tennis, 2 pistes de padel, une école labellisée. Adhésion à partir de 40 €. Préinscriptions ouvertes pour la saison 2026-2027.",
  metadataBase: new URL("https://tc-davezieux.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "TC Davézieux",
    title: "Tennis Club de Davézieux — Tennis & Padel",
    description:
      "Tennis, padel et école dans le complexe de Jossols. Saison 2026-2027.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo-tcd.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${playfair.variable}`}>
      <body>
        <Nav />
        <main className="pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
