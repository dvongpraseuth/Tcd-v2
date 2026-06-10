import type { Config } from "tailwindcss";

/**
 * Design tokens TCD — bascule maquette site-mockup-eta (10/06/2026)
 * - Palette navy (bleu) + jaune + noir + gris (site-mockup-eta.vercel.app)
 * - Fonts : Outfit (UI) + Playfair Display italic (accents éditoriaux)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette maquette TCD
        bleu: "#2E3B8C",
        "bleu-fonce": "#1E2A6E",
        "bleu-clair": "#3D4FA6",
        jaune: "#F2C94C",
        "jaune-clair": "#F7DC7F",
        "jaune-pale": "#FFF8E1",
        noir: "#1A1A1A",
        blanc: "#FFFFFF",
        "gris-50": "#F8F9FA",
        "gris-100": "#F1F3F5",
        "gris-200": "#E9ECEF",
        "gris-300": "#DEE2E6",
        "gris-500": "#ADB5BD",
        "gris-700": "#495057",
        "gris-800": "#343A40",
      },
      fontFamily: {
        // Chargés via next/font (cf app/layout.tsx)
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      letterSpacing: {
        tight: "-0.02em",
        tighter: "-0.04em",
      },
      maxWidth: {
        prose: "65ch",
        container: "1280px",
      },
      borderRadius: {
        card: "12px",
        "card-lg": "20px",
      },
      boxShadow: {
        "tcd-sm": "0 4px 24px rgba(46, 59, 140, 0.08)",
        "tcd-lg": "0 12px 48px rgba(46, 59, 140, 0.12)",
        "tcd-jaune": "0 8px 24px rgba(242, 201, 76, 0.35)",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out",
        "fade-in-up-delay": "fadeInUp 0.8s ease-out 0.2s both",
      },
    },
  },
  plugins: [],
};

export default config;
