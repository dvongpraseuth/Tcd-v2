import type { Metadata } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Brief §7 — Archivo 700-900 uppercase pour titres (display)
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

// Brief §7 — Hanken Grotesk pour texte courant
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tennis Club Davézieux — Préinscriptions saison 2026-2027",
    template: "%s — TC Davézieux",
  },
  description:
    "Tennis, padel et école de tennis à Davézieux (07). Préinscrivez-vous en ligne pour la saison 2026-2027.",
  metadataBase: new URL("https://tc-davezieux.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "TC Davézieux",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${archivo.variable} ${hanken.variable}`}>
      <body>
        <Nav />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
