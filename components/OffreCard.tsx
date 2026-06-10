import Link from "next/link";
import type { Formule } from "@/config/tarifs";
import { buildTenupOfferUrl } from "@/config/inscriptions";

interface Props {
  formule: Formule;
  /** Mise en avant visuelle (ex : combo Tennis & Padel) */
  feature?: boolean;
}

/**
 * Carte d'adhésion (formule).
 * Affiche la décomposition licence + adhésion + total, les conditions
 * et un CTA Ten'Up si l'offre est activée.
 */
export function OffreCard({ formule, feature = false }: Props) {
  const cond = formule.conditions;
  const conditionsTexte =
    cond.ageMin && cond.ageMax
      ? `${cond.ageMin}-${cond.ageMax} ans`
      : cond.ageMin
        ? `${cond.ageMin} ans et +`
        : cond.ageMax
          ? `moins de ${cond.ageMax + 1} ans`
          : null;

  const ctaHref = formule.tenupId ? buildTenupOfferUrl(formule.tenupId) : null;

  return (
    <article
      className={`flex flex-col rounded-card border bg-blanc p-6 ${
        feature ? "border-jaune shadow-md" : "border-gris-200"
      }`}
    >
      <header className="mb-4">
        {feature && (
          <span className="inline-block bg-jaune text-blanc font-sans uppercase tracking-tight text-xs px-2 py-0.5 rounded mb-2">
            Le plus avantageux
          </span>
        )}
        <h3 className="text-xl mb-1 text-bleu">{formule.label}</h3>
        {conditionsTexte && (
          <p className="text-xs font-medium text-gris-700 uppercase tracking-tight">
            {conditionsTexte}
          </p>
        )}
      </header>

      <p className="text-sm text-gris-700 mb-4 flex-grow">{formule.description}</p>

      <div className="border-t border-gris-200 pt-4 mb-4">
        <dl className="text-sm space-y-1 mb-2">
          {formule.licence > 0 && (
            <div className="flex justify-between text-gris-700">
              <dt>Licence FFT + assurance</dt>
              <dd>{formule.licence} €</dd>
            </div>
          )}
          <div className="flex justify-between text-gris-700">
            <dt>Adhésion club</dt>
            <dd>{formule.adhesion} €</dd>
          </div>
        </dl>
        <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-gris-200">
          <span className="font-sans uppercase tracking-tight text-sm">
            Total
          </span>
          <span className="font-sans text-3xl text-bleu">
            {formule.total} €
          </span>
        </div>
      </div>

      {!formule.remiseApplicable && (
        <p className="text-xs text-jaune mb-3">
          Aucune remise applicable sur cette formule.
        </p>
      )}

      {ctaHref ? (
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm py-2.5 text-center"
        >
          S&apos;inscrire sur Ten&apos;Up →
        </a>
      ) : (
        <Link href="/inscription" className="btn-primary text-sm py-2.5 text-center">
          Contacter le club
        </Link>
      )}
    </article>
  );
}
