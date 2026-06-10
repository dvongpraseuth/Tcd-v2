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
    <article className="flex flex-col rounded-card border border-paper-dark bg-paper p-5">
      <header className="mb-2">
        <h4 className="text-base mb-1 text-court">{offre.label}</h4>
        {tags.length > 0 && (
          <p className="text-xs font-medium text-ink/60 uppercase tracking-tight">
            {tags.join(" · ")}
          </p>
        )}
      </header>

      <p className="text-sm text-ink/70 mb-4 flex-grow">{offre.description}</p>

      <div className="flex items-end justify-between pt-3 border-t border-paper-dark">
        <span className="text-xs text-ink/60">
          {offre.surTenup ? "Inscriptible sur Ten'Up" : "Auprès du club"}
        </span>
        <span className="font-display text-2xl text-court">{offre.prix} €</span>
      </div>

      {offre.surTenup && offre.tenupId && (
        <a
          href={buildTenupOfferUrl(offre.tenupId)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-sm text-court-dark hover:text-court font-medium underline decoration-ball decoration-2 underline-offset-2"
        >
          S&apos;inscrire sur Ten&apos;Up →
        </a>
      )}
    </article>
  );
}
