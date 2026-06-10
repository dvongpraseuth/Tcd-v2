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

const CARDS: Card[] = [
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

export function TarifsTeaser() {
  return (
    <section id="tarifs-teaser" className="py-24 px-5 sm:px-8 bg-blanc">
      <div className="max-w-container mx-auto">
        <div className="section-label">Saison {SAISON}</div>
        <h2 className="text-4xl sm:text-5xl font-extrabold -tracking-[1.5px] leading-tight mb-4 text-noir">
          Nos <em className="text-bleu">tarifs</em>
        </h2>
        <p className="text-base sm:text-[17px] text-gris-700 leading-relaxed max-w-xl mb-12">
          Tarif tout compris : licence FFT + assurance + accès aux courts avec
          réservation gratuite. Accès courts de 8h à 22h, toute l&apos;année.
        </p>

        <div className="grid gap-5 md:grid-cols-3 mb-12">
          {CARDS.map((c) => (
            <TarifCard key={c.name} card={c} />
          ))}
        </div>

        <div className="text-center bg-gris-50 rounded-card-lg p-8 md:p-10 border border-gris-200">
          <h3 className="text-2xl font-bold mb-3">
            Découvrez toutes les offres
          </h3>
          <p className="text-gris-700 max-w-2xl mx-auto mb-6">
            Jeunes, enfants, adulte accompagnant, licencié extérieur, cours, stages,
            tennis santé — 17 formules pour la saison {SAISON}.
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
