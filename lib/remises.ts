/**
 * ============================================================
 * REMISES — calcul des taux et montants
 *
 * Règles (HANDOFF Claude Desktop) :
 * - Remise s'applique UNIQUEMENT sur la part adhésion club
 * - Famille (-20%) appliquée AUTOMATIQUEMENT si ≥ 2 membres dans le foyer
 * - Sociale (-10%) sur case à cocher par membre + justificatif
 * - Bloquée pour licencié extérieur (formule.remiseApplicable = false)
 * - Mode de cumul : voir CUMUL_REMISE dans config/inscriptions.ts
 * ============================================================
 */

import { REMISES } from "@/config/tarifs";
import { CUMUL_REMISE, type ModeCumulRemise } from "@/config/inscriptions";

export interface ContexteRemise {
  /** Membre éligible aux remises (false pour licencié extérieur) */
  remiseApplicable: boolean;
  /** Mode famille actif (≥ 2 membres dans le foyer) */
  estFamille: boolean;
  /** Le membre a coché la remise sociale (étudiant / chômeur / etc.) */
  remiseSocialeDemandee: boolean;
}

export interface ResultatRemise {
  /** Taux total de remise (entre 0 et ~0.30) */
  taux: number;
  /** Détail des composantes appliquées */
  composantes: {
    famille: number;
    sociale: number;
  };
  /** Mode de cumul utilisé pour info / debug */
  mode: ModeCumulRemise;
}

/**
 * Calcule le TAUX de remise pour un membre selon son contexte.
 * Le montant en € se calcule ensuite par : adhesionClub × taux.
 */
export function tauxRemise(ctx: ContexteRemise): ResultatRemise {
  if (!ctx.remiseApplicable) {
    return {
      taux: 0,
      composantes: { famille: 0, sociale: 0 },
      mode: CUMUL_REMISE,
    };
  }

  const famille = ctx.estFamille ? REMISES.famille.taux : 0;
  const sociale = ctx.remiseSocialeDemandee ? REMISES.social.taux : 0;

  let taux: number;
  switch (CUMUL_REMISE) {
    case "additif":
      taux = famille + sociale;
      break;
    case "multiplicatif":
      taux = 1 - (1 - famille) * (1 - sociale);
      break;
    case "noncumulable":
      taux = Math.max(famille, sociale);
      break;
  }

  return {
    taux,
    composantes: { famille, sociale },
    mode: CUMUL_REMISE,
  };
}

/**
 * Arrondi monétaire à 2 décimales (pour les montants en €).
 */
export function arrondi2(montant: number): number {
  return Math.round(montant * 100) / 100;
}
