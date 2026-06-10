/**
 * ============================================================
 * CONFIG INSCRIPTIONS — flags + URLs Ten'Up
 *
 * Centralise les paramètres du funnel d'inscription.
 * Modifs hors-tarifs (URLs, mode de cumul, libellés CTA) se font ici.
 * ============================================================
 */

import type { FormuleKey } from "@/config/tarifs";

// ── Ten'Up ─────────────────────────────────────────────────

export const TENUP_CLUB_ID = "50070493" as const;
export const TENUP_BASE = `https://tenup.fft.fr/club/${TENUP_CLUB_ID}` as const;

/**
 * Construit l'URL deep-link Ten'Up pour une offre donnée.
 * Confirmé fonctionnel par David le 09/06/2026.
 */
export function buildTenupOfferUrl(tenupId: number): string {
  return `${TENUP_BASE}/offre/${tenupId}`;
}

/** URL de fallback (liste des offres) si un mapping manque. */
export const TENUP_OFFRES_URL = `${TENUP_BASE}/offres` as const;

// ── Remises ────────────────────────────────────────────────

/**
 * Mode de cumul des remises famille + sociale.
 *
 * - "additif"     : famille -20% + sociale -10% = -30% (modèle HANDOFF Claude Desktop)
 * - "noncumulable": on garde la plus avantageuse (ancien brief)
 * - "multiplicatif": (1 - 0.20) × (1 - 0.10) = -28%
 *
 * À CONFIRMER AVEC LE BUREAU TCD (Q2 du questionnaire club).
 */
export type ModeCumulRemise = "additif" | "noncumulable" | "multiplicatif";
export const CUMUL_REMISE: ModeCumulRemise = "additif";

// ── Routage simple / complexe ──────────────────────────────

/**
 * Détermine si un panier déclenche la voie "simple" (deep-link Ten'Up direct)
 * ou "complexe" (fiche Supabase + handoff club).
 *
 * Simple = TOUTES ces conditions :
 * - 1 seul membre dans le foyer
 * - Pas de remise sociale demandée
 * - 1 seule formule d'adhésion (pas de combo adhésion + cours)
 * - La formule a un tenupId (offre activée sur Ten'Up)
 *
 * Complexe sinon (famille, sociale, combo, offre hors Ten'Up).
 */
export interface RoutageInput {
  nombreMembres: number;
  remisesSocialeDemandees: boolean;
  formuleKey: FormuleKey;
  /** Le membre a-t-il sélectionné au moins un cours ou stage ? */
  aChoisiCours: boolean;
  /** La formule a-t-elle un ID Ten'Up actif ? */
  tenupId: number | null;
}

export type Routage =
  | { kind: "simple"; tenupUrl: string }
  | { kind: "complexe"; raison: string };

export function routerInscription(input: RoutageInput): Routage {
  if (input.nombreMembres > 1) {
    return { kind: "complexe", raison: "Inscription famille (2+ membres)" };
  }
  if (input.remisesSocialeDemandees) {
    return {
      kind: "complexe",
      raison: "Remise sociale demandée (justificatif à présenter au club)",
    };
  }
  if (input.aChoisiCours) {
    return {
      kind: "complexe",
      raison: "Cours ou stage sélectionné — gestion combinée par le club",
    };
  }
  if (input.tenupId === null) {
    return {
      kind: "complexe",
      raison: "Offre non disponible sur Ten'Up — inscription via le club",
    };
  }
  return { kind: "simple", tenupUrl: buildTenupOfferUrl(input.tenupId) };
}

// ── Contact club ───────────────────────────────────────────

export const CLUB_CONTACT = {
  nom: "Tennis Club de Davézieux",
  adresse: "Rue des Fonds — Jossols, 07430 Davézieux",
  telephone: "04 75 67 73 72",
  email: "tcdavezieuxtennispadel@gmail.com",
  /** À remplir si on ouvre une boîte technique séparée pour les notifs */
  emailTechnique: process.env.ADMIN_NOTIF_EMAIL ?? null,
} as const;
