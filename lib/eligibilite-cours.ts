/**
 * ============================================================
 * ÉLIGIBILITÉ COURS — filtre la liste des cours offerts à un membre.
 *
 * Modèle Claude Desktop : on filtre par catégorie (avec genre pour adultes).
 * Pas de calcul d'âge depuis date de naissance — la catégorie est déclarée
 * directement par l'utilisateur dans le funnel.
 * ============================================================
 */

import { ALL_COURS, cibleCoursFor, type Categorie, type Sexe } from "@/config/tarifs";

export interface CoursEligible {
  key: string;
  label: string;
  description: string;
  prix: number;
  /** Disponible sur Ten'Up pour deep-link (ou hors-Ten'Up = handoff club) */
  surTenup: boolean;
}

/**
 * Retourne les cours éligibles pour un membre selon sa catégorie + sexe.
 */
export function coursEligibles(
  categorie: Categorie,
  sexe: Sexe,
): CoursEligible[] {
  const cible = cibleCoursFor(categorie, sexe);

  return ALL_COURS.filter((c) => {
    // null = ouvert à tous (genre "stage padel")
    if (c.cibleCategorie === null) return true;

    // Cours adulte non-genrés (genre "tennis santé adulte")
    if (c.cibleCategorie === "adulte" && categorie === "adulte") return true;

    return c.cibleCategorie === cible;
  }).map((c) => ({
    key: c.key,
    label: c.label,
    description: c.description,
    prix: c.prix,
    surTenup: c.surTenup,
  }));
}
