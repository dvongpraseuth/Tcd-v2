/**
 * ============================================================
 * TARIFS TCD — saison 2026-2027
 * Brief DASH §6 — source de vérité unique
 *
 * RÈGLE D'OR : ne JAMAIS coder un tarif en dur ailleurs.
 * Toute logique de calcul (compute-totals, remises) lit ce fichier.
 * Modification = un seul endroit + bump SAISON si saison suivante.
 * ============================================================
 */

export const SAISON = "2026-2027" as const;

/**
 * Adhésion club (part fixe, payée par chaque membre).
 * Pas de discipline incluse — c'est la base.
 *
 * Valeurs calées sur les résultats ancrés du brief §10 :
 * - Test 1 (famille 2 adultes Tennis + 1 jeune École) → 338+130-68=400€
 *   donc 130×2 + jeune = 338 ⇒ jeune = 78 ;  remise 20% × 338 = 67.6 ≈ 68
 * - Test 2 (femme adulte Tennis + cours Dames étudiante) → 130+140-13=257€
 *   donc adulte = 130 ; remise 10% × 130 = 13
 *
 * À CONFIRMER AVEC LE BUREAU TCD pour mise en prod.
 */
export const ADHESION = {
  adulte: 130, // 18+ ans
  jeune: 78,   // 6-17 ans (calé sur test ancré §10)
  enfant: 60,  // <6 ans (mini-tennis — à confirmer)
} as const;

/**
 * Cours collectifs — supplément à l'adhésion.
 * Filtrage par profil (âge / sexe) via lib/eligibilite-cours.ts
 */
export const COURS = {
  ecole_tennis: {
    label: "École de tennis",
    prix: 130,
    eligibilite: { ageMin: 6, ageMax: 17 },
  },
  cours_adulte: {
    label: "Cours adulte",
    prix: 180,
    eligibilite: { ageMin: 18 },
  },
  cours_dames: {
    label: "Cours dames",
    prix: 140,
    eligibilite: { ageMin: 18, sexe: "F" as const },
  },
  competition: {
    label: "Section compétition",
    prix: 220,
    eligibilite: { ageMin: 12 },
  },
} as const;

/**
 * Stages (vacances scolaires) — optionnels, achetables à part.
 */
export const STAGES = {
  stage_jeune: {
    label: "Stage jeunes (semaine)",
    prix: 80,
    eligibilite: { ageMin: 6, ageMax: 17 },
  },
  stage_adulte: {
    label: "Stage adulte (week-end)",
    prix: 60,
    eligibilite: { ageMin: 18 },
  },
} as const;

/**
 * Tennis Santé — programme spécifique sur prescription.
 */
export const TENNIS_SANTE = {
  label: "Tennis Santé",
  prix: 150,
  eligibilite: { ageMin: 18 },
} as const;

/**
 * Remises — appliquées sur la PART ADHÉSION uniquement (pas sur les cours).
 * NON cumulables : si famille ET sociale éligibles, on prend la plus avantageuse.
 */
export const REMISES = {
  famille: {
    label: "Remise famille",
    seuilMembres: 2,   // 2+ membres dans le même foyer
    taux: 0.20,         // -20 % sur la part adhésion de chacun
  },
  sociale: {
    label: "Tarif social",
    taux: 0.10,         // -10 % sur la part adhésion
    // Critères justificatifs : étudiant, demandeur d'emploi, RSA, etc.
  },
} as const;

/**
 * Types exportés pour usage TS strict
 */
export type CoursKey = keyof typeof COURS;
export type StageKey = keyof typeof STAGES;
export type ProfilAge = "enfant" | "jeune" | "adulte";
export type Sexe = "F" | "M" | "X";

/**
 * Accesseurs ergonomiques (pour pages /tarifs et /inscription)
 */
export const ALL_COURS = Object.entries(COURS).map(([key, c]) => ({
  key: key as CoursKey,
  ...c,
}));

export const ALL_STAGES = Object.entries(STAGES).map(([key, s]) => ({
  key: key as StageKey,
  ...s,
}));
