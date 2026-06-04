import { REMISES } from "@/config/tarifs";

export interface ContexteRemise {
  /** Total adhésion brute du foyer (somme des parts adhésion AVANT remise) */
  adhesionBrute: number;
  /** Nombre de membres dans le foyer */
  nombreMembres: number;
  /** Si au moins un membre déclare une situation sociale (étudiant, RSA, etc.) */
  situationSociale: boolean;
}

export interface ResultatRemise {
  /** Montant en € à déduire de l'adhésion brute */
  montant: number;
  /** Type de remise appliqué (null si aucune) */
  type: "famille" | "sociale" | null;
  /** Libellé humain pour récap UI */
  label: string | null;
}

/**
 * Calcule la remise applicable sur la part adhésion uniquement.
 *
 * Brief §6 — règles :
 * - Famille : -20% si ≥2 membres dans le foyer
 * - Sociale : -10% sur justificatif
 * - NON CUMULABLES → on retient la plus avantageuse
 *
 * Arrondi à l'euro entier (cohérent avec les résultats ancrés §10 :
 * 338 × 0.20 = 67.6 → 68).
 */
export function calculerRemise(ctx: ContexteRemise): ResultatRemise {
  const peutFamille = ctx.nombreMembres >= REMISES.famille.seuilMembres;
  const peutSociale = ctx.situationSociale;

  const montantFamille = peutFamille
    ? Math.round(ctx.adhesionBrute * REMISES.famille.taux)
    : 0;
  const montantSociale = peutSociale
    ? Math.round(ctx.adhesionBrute * REMISES.sociale.taux)
    : 0;

  if (montantFamille === 0 && montantSociale === 0) {
    return { montant: 0, type: null, label: null };
  }

  // Non cumulables : on prend la plus avantageuse pour le foyer
  if (montantFamille >= montantSociale) {
    return {
      montant: montantFamille,
      type: "famille",
      label: REMISES.famille.label,
    };
  }
  return {
    montant: montantSociale,
    type: "sociale",
    label: REMISES.sociale.label,
  };
}
