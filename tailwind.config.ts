import type { Config } from "tailwindcss";

/**
 * Design tokens du brief TCD §7
 * - Palette terrain (court) / balle / drapeau / papier / encre
 * - Fonts : Archivo 700-900 uppercase pour titres, Hanken Grotesk pour texte
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
        // Palette TCD brief §7
        ink: "#16201c",      // texte principal
        paper: "#f5f1e8",    // fond papier crème
        court: "#1f6b4a",    // vert terrain (primaire)
        ball: "#d8e84a",     // jaune balle (accent)
        flag: "#e8a33d",     // orange drapeau (mise en valeur)
        // Variantes utiles
        "court-dark": "#15523a",
        "court-light": "#2d8c64",
        "paper-dark": "#e8e0cc",
      },
      fontFamily: {
        // Chargés via next/font (cf app/layout.tsx)
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        // Titres Archivo en uppercase serrent un poil
        tight: "-0.02em",
      },
      maxWidth: {
        prose: "65ch",
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
