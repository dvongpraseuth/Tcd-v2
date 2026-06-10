"use client";

import { useState } from "react";
import Link from "next/link";
import { SAISON } from "@/config/tarifs";

interface Card {
  icon: string;
  name: string;
  sub: string;
  prix: number;
  features: string[];
  featured?: boolean;
  badge?: string;
}

const ADULTES: Card[] = [
  {
    icon: "🎾",
    name: "Tennis",
    sub: "Adulte · Accès aux 4 courts",
    prix: 130,
    features: [
      "Licence FFT + assurance incluses",
      "4 courts éclairés en accès libre",
      "Réservation via Ten'Up",
      "Championnats par équipes",
    ],
  },
  {
    icon: "🎾🏸",
    name: "Tennis & Padel",
    sub: "Adulte · Accès complet",
    prix: 170,
    features: [
      "La formule la plus avantageuse",
      "4 courts + 2 pistes padel",
      "Tournois padel P25 à P2000",
      "Championnats tennis et padel",
    ],
    featured: true,
    badge: "POPULAIRE",
  },
  {
    icon: "🏸",
    name: "Padel",
    sub: "Adulte · Accès aux 2 pistes",
    prix: 130,
    features: [
      "Licence FFT + assurance incluses",
      "2 pistes padel éclairées",
      "Réservation via Ten'Up",
      "Interclubs padel",
    ],
  },
];

const JEUNES: Card[] = [
  {
    icon: "🌟",
    name: "Enfant -6 ans",
    sub: "Mini-tennis · 3-6 ans",
    prix: 40,
    features: [
      "Licence FFT + assurance incluses",
      "Accès mini-tennis",
      "Encadrement adapté",
      "Le mercredi",
    ],
  },
  {
    icon: "🎾🏸",
    name: "Tennis & Padel",
    sub: "Jeune · 7-17 ans · Accès complet",
    prix: 115,
    features: [
      "Licence FFT + assurance incluses",
      "4 courts + 2 pistes padel",
      "Championnats jeunes",
      "Pass Région et aide départementale acceptés",
    ],
    featured: true,
    badge: "7-17 ANS",
  },
  {
    icon: "🎾",
    name: "Tennis Jeunes",
    sub: "Jeune · 7-17 ans · Tennis seul",
    prix: 80,
    features: [
      "Licence FFT + assurance incluses",
      "4 courts en accès libre",
      "Éclairage inclus",
      "Championnats jeunes",
    ],
  },
];

const EXTRAS = [
  { icon: "👶", name: "Mini-Tennis (4-6 ans)", detail: "25 × 1h · le mercredi", prix: "85€" },
  { icon: "🚀", name: "Galaxie Tennis (6-13 ans)", detail: "25-30 × 1h30", prix: "à partir de 120€" },
  { icon: "👩", name: "Adultes Dames", detail: "25-30 × 1h15", prix: "140€" },
  { icon: "👨", name: "Adultes Hommes", detail: "25-30 × 1h15", prix: "160€" },
  { icon: "🏆", name: "Pôle Compétition (13+)", detail: "25-30 × 1h15 + hebdo", prix: "235€" },
  { icon: "💚", name: "Tennis/Padel Santé", detail: "15-20 × 1h", prix: "50€" },
  { icon: "🎾", name: "Location court tennis", detail: "Joueurs extérieurs ≥ 15 ans", prix: "8€ / ticket" },
  { icon: "🏸", name: "Location piste padel", detail: "Carnet 4 tickets × 1h30", prix: "40€" },
  { icon: "🎁", name: "Stages vacances scolaires", detail: "Jeunes · Encadrés par BE", prix: "Gratuit", highlight: true },
];

export function TarifsTeaser() {
  const [vue, setVue] = useState<"adultes" | "jeunes">("adultes");
  const cards = vue === "adultes" ? ADULTES : JEUNES;

  return (
    <section id="tarifs-teaser" className="py-24 px-5 sm:px-8 bg-blanc">
      <div className="max-w-container mx-auto">
        <div className="section-label">Saison {SAISON}</div>
        <h2 className="text-4xl sm:text-5xl font-extrabold -tracking-[1.5px] leading-tight mb-4 text-noir">
          Nos <em className="text-bleu">tarifs</em>
        </h2>
        <p className="text-base sm:text-[17px] text-gris-700 leading-relaxed max-w-xl mb-10">
          Tarif tout compris : licence FFT + assurance + accès aux courts avec
          réservation gratuite. Accès courts de 8h à 22h, toute l&apos;année.
        </p>

        {/* Toggle Adultes / Jeunes */}
        <div className="inline-flex gap-1 bg-gris-100 rounded-card p-1 mb-10">
          <button
            type="button"
            onClick={() => setVue("adultes")}
            className={`px-7 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              vue === "adultes"
                ? "bg-bleu text-blanc shadow-tcd-sm"
                : "bg-transparent text-gris-700 hover:text-bleu"
            }`}
          >
            Adultes
          </button>
          <button
            type="button"
            onClick={() => setVue("jeunes")}
            className={`px-7 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              vue === "jeunes"
                ? "bg-bleu text-blanc shadow-tcd-sm"
                : "bg-transparent text-gris-700 hover:text-bleu"
            }`}
          >
            Jeunes
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-12">
          {cards.map((c) => (
            <TarifCard key={c.name} card={c} />
          ))}
        </div>

        {/* Cours & Locations en grille compacte */}
        <div className="mt-12 pt-12 border-t border-gris-200">
          <h3 className="text-2xl font-bold mb-6 -tracking-[0.5px]">
            Cours &amp; Locations
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {EXTRAS.map((e) => (
              <div
                key={e.name}
                className={`flex items-center gap-4 p-4 rounded-card border transition-all ${
                  "highlight" in e && e.highlight
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gris-200 bg-blanc hover:border-bleu hover:shadow-tcd-sm"
                }`}
              >
                <div className="text-2xl flex-shrink-0" aria-hidden>
                  {e.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-noir">
                    {e.name}
                  </div>
                  <div className="text-xs text-gris-500">{e.detail}</div>
                </div>
                <div
                  className={`text-[15px] font-bold whitespace-nowrap ${
                    "highlight" in e && e.highlight
                      ? "text-emerald-600"
                      : "text-bleu"
                  }`}
                >
                  {e.prix}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-gris-50 rounded-card-lg p-8 md:p-10 border border-gris-200">
          <h3 className="text-2xl font-bold mb-3">
            Découvrez toutes les offres
          </h3>
          <p className="text-gris-700 max-w-2xl mx-auto mb-6">
            17 formules pour la saison {SAISON} — adultes, jeunes, enfants,
            adulte accompagnant, licencié extérieur, cours, stages, tennis santé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tarifs" className="btn-bleu">
              Voir tous les tarifs →
            </Link>
            <Link href="/inscription" className="btn-primary">
              Préinscription guidée
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TarifCard({ card }: { card: Card }) {
  const isFeature = card.featured ?? false;
  return (
    <article
      className={`relative rounded-card-lg p-10 border transition-all hover:shadow-tcd-lg ${
        isFeature
          ? "bg-bleu border-bleu text-blanc"
          : "border-gris-200 bg-blanc hover:border-bleu"
      }`}
    >
      {card.badge && (
        <div className="absolute -top-3 right-6 bg-jaune text-bleu-fonce text-[11px] font-bold px-3.5 py-1 rounded-full tracking-wide">
          {card.badge}
        </div>
      )}
      <div className="text-4xl mb-5" aria-hidden>
        {card.icon}
      </div>
      <h3
        className={`text-[22px] font-bold mb-2 -tracking-[0.3px] ${
          isFeature ? "text-blanc" : "text-noir"
        }`}
      >
        {card.name}
      </h3>
      <p
        className={`text-sm mb-6 ${
          isFeature ? "text-white/80" : "text-gris-700"
        }`}
      >
        {card.sub}
      </p>
      <div
        className={`text-5xl font-extrabold -tracking-[2px] mb-1 ${
          isFeature ? "text-jaune" : "text-bleu"
        }`}
      >
        {card.prix}€{" "}
        <span className="text-base font-normal tracking-normal">/ saison</span>
      </div>
      <p
        className={`text-xs mb-7 ${
          isFeature ? "text-white/40" : "text-gris-500"
        }`}
      >
        Licence FFT incluse
      </p>
      <ul className="list-none mb-0 space-y-2">
        {card.features.map((f) => (
          <li
            key={f}
            className={`text-sm py-2 border-b flex items-center gap-2.5 ${
              isFeature
                ? "text-white/80 border-white/10"
                : "text-gris-700 border-gris-100"
            }`}
          >
            <span className="text-jaune font-bold" aria-hidden>
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}
