import type { Categorie } from "@/config/tarifs";

/**
 * Détermine la catégorie officielle TCD à partir d'une date de naissance.
 * Référence de calcul : 1er septembre de l'année de saison.
 *
 * Utilisé côté API pour validation cohérence catégorie déclarée vs âge réel
 * (le funnel demande la catégorie directement, mais le formulaire de fiche
 * complexe collecte la date de naissance pour archive bureau).
 *
 * Brief §9 — hypothèses retenues par défaut :
 * - < 6 ans = enfant
 * - 6 à 17 ans = jeune
 * - 18+ ans = adulte (le jour des 18 ans au 1er sept)
 */
export function profilFor(dateNaissance: Date, anneeDebutSaison = 2026): Categorie {
  const ref = new Date(anneeDebutSaison, 8, 1); // 1er septembre AAAA
  const age = ageAuPeriode(dateNaissance, ref);

  if (age < 6) return "enfant";
  if (age < 18) return "jeune";
  return "adulte";
}

/**
 * Calcul d'âge exact à une date donnée (anniv pas encore atteint = -1).
 */
export function ageAuPeriode(naissance: Date, refDate: Date): number {
  let age = refDate.getFullYear() - naissance.getFullYear();
  const mois = refDate.getMonth() - naissance.getMonth();
  if (mois < 0 || (mois === 0 && refDate.getDate() < naissance.getDate())) {
    age--;
  }
  return age;
}
