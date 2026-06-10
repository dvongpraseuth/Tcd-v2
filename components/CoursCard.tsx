import type { Offre } from "@/config/tarifs";
import { buildTenupOfferUrl } from "@/config/inscriptions";

interface Props {
  offre: Offre;
}

/**
 * Carte cours / stage / programme.
 * Affiche le prix et l'origine (Ten'Up ou club).
 */
export function CoursCard({ offre }: Props) {
  const cond = offre.conditions;
  const conditionsTexte =
    cond.ageMin && cond.ageMax
      ? `${cond.ageMin}-${cond.ageMax} ans`
      : cond.ageMin
        ? `${cond.ageMin} ans et +`
        : null;

  const sexeTexte = cond.sexe === "F" ? "Femmes" : cond.sexe === "H" ? "Hommes" : null;
  const tags = [conditionsTexte, sexeTexte].filter(Boolean);

  return (
    <article className="flex flex-col rounded-card border border-gris-200 bg-blanc p-5">
      <header className="mb-2">
        <h4 className="text-base mb-1 text-bleu">{offre.label}</h4>
        {tags.length > 0 && (
          <p className="text-xs font-medium text-gris-700 uppercase tracking-tight">
            {tags.join(" · ")}
          </p>
        )}
      </header>

      <p className="text-sm text-gris-700 mb-4 flex-grow">{offre.description}</p>

      <div className="flex items-end justify-between pt-3 border-t border-gris-200">
        <span className="text-xs text-gris-700">
          {offre.surTenup ? "Inscriptible sur Ten'Up" : "Auprès du club"}
        </span>
        <span className="font-sans text-2xl text-bleu">{offre.prix} €</span>
      </div>

      {offre.surTenup && offre.tenupId && (
        <a
          href={buildTenupOfferUrl(offre.tenupId)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm text-bleu-fonce hover:text-bleu font-medium underline decoration-ball decoration-2 underline-offset-2"
        >
          S&apos;inscrire sur Ten&apos;Up →
        </a>
      )}
    </article>
  );
}
