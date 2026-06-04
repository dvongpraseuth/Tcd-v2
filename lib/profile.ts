import type { ProfilAge } from "@/config/tarifs";

/**
 * Détermine la tranche d'âge officielle TCD à partir d'une date de naissance.
 * Référence de calcul : 1er septembre de l'année de saison.
 *
 * Brief §9 — hypothèse confirmée par défaut : "6 ans révolus = jeune".
 * Bord-de-règle 18 ans : adulte le jour des 18 ans (au 1er sept).
 *
 * À ajuster avec Séb Roux quand le bureau aura tranché (cf bloqueurs §9).
 */
export function profilFor(dateNaissance: Date, anneeDebutSaison = 2026): ProfilAge {
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
