import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero — terrain + balle */}
      <section className="bg-court text-paper relative overflow-hidden">
        <div className="container-page py-20 sm:py-28 relative z-10">
          <p className="font-display uppercase tracking-tight text-ball text-sm mb-4">
            Saison {process.env.NEXT_PUBLIC_SAISON ?? "2026-2027"}
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-6 max-w-3xl">
            Tennis, padel & école au cœur de Davézieux
          </h1>
          <p className="text-lg sm:text-xl text-paper/90 max-w-xl mb-8">
            Préinscriptions ouvertes en ligne. Un formulaire unique pour toute
            la famille, paiement validé après confirmation du club.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/inscription" className="btn-primary bg-ball text-ink hover:bg-flag">
              Démarrer ma préinscription
            </Link>
            <Link
              href="/tarifs"
              className="btn-secondary bg-paper/10 text-paper hover:bg-paper/20"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
        {/* Décor balle stylisée */}
        <div
          aria-hidden
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-ball/30 blur-3xl"
        />
      </section>

      {/* 3 cards : Tennis / Padel / École */}
      <section className="container-page py-16">
        <h2 className="text-3xl sm:text-4xl mb-10">Trois portes d'entrée</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card titre="Tennis" desc="Loisir, compétition, cours adultes et dames." href="/tennis" />
          <Card titre="Padel" desc="Le sport qui monte — terrains réservables en ligne." href="/padel" />
          <Card titre="École" desc="6-17 ans, encadrement DE, créneaux du mercredi & samedi." href="/ecole" />
        </div>
      </section>

      {/* Info préinscription */}
      <section className="bg-paper-dark py-16">
        <div className="container-page text-center max-w-2xl mx-auto">
          <p className="font-display uppercase tracking-tight text-court text-sm mb-2">
            Comment ça marche
          </p>
          <h2 className="text-3xl sm:text-4xl mb-4">
            Une préinscription en 5 minutes
          </h2>
          <p className="text-base text-ink/70 mb-6">
            Vous remplissez le formulaire, le club valide votre dossier, vous
            recevez le lien de paiement Ten'Up FFT (CB sécurisée) ou les
            instructions pour régler en chèque/espèces sur place.
          </p>
          <Link href="/inscription" className="btn-primary">
            Je préinscris ma famille
          </Link>
        </div>
      </section>
    </>
  );
}

function Card({ titre, desc, href }: { titre: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="card-paper hover:border-court transition-colors group no-underline"
    >
      <h3 className="text-2xl mb-2 group-hover:text-court">{titre}</h3>
      <p className="text-sm text-ink/70">{desc}</p>
      <p className="text-sm font-display uppercase tracking-tight text-court mt-4">
        En savoir plus →
      </p>
    </Link>
  );
}
