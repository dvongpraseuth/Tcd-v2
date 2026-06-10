import Link from "next/link";

interface EnConstructionProps {
  /** Titre de la page (ex: "Le club", "Padel") */
  titre: string;
  /** Sous-titre optionnel pour donner du contexte */
  sousTitre?: string;
}

/**
 * Placeholder utilisé pour toutes les pages P2 du brief (le-club, tennis, padel, ecole, actualites, contact).
 * Le tunnel /inscription et la page /tarifs sont P0 — eux sont fonctionnels.
 */
export function EnConstruction({ titre, sousTitre }: EnConstructionProps) {
  return (
    <section className="container-page py-20 sm:py-28">
      <div className="card-paper text-center max-w-xl mx-auto">
        <p className="font-sans uppercase tracking-tight text-bleu text-sm mb-2">
          Saison {process.env.NEXT_PUBLIC_SAISON ?? "2026-2027"}
        </p>
        <h1 className="text-4xl sm:text-5xl mb-4">{titre}</h1>
        {sousTitre && (
          <p className="text-lg text-gris-700 mb-6">{sousTitre}</p>
        )}
        <p className="text-base text-gris-700 mb-8">
          Cette page sera mise en ligne prochainement. En attendant, vous pouvez
          préinscrire votre famille au club ou consulter nos tarifs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/inscription" className="btn-primary">
            Préinscription
          </Link>
          <Link href="/tarifs" className="btn-secondary">
            Voir les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}
