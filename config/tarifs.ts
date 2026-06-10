/**
 * ============================================================
 * TARIFS TCD — saison 2026-2027
 *
 * SOURCE UNIQUE DE VÉRITÉ — alimenté par :
 * - _handoff-2026-06-09/tarifs-2026-27.json (modèle Claude Desktop)
 * - _research/tenup-offres-final.json (IDs Ten'Up scrap 09/06/2026, millesime 2027)
 *
 * Règle d'or : aucune valeur en dur ailleurs dans le code.
 * Modification = un seul fichier + bump SAISON si saison suivante.
 * ============================================================
 */

export const SAISON = "2026-2027" as const;
export const ANNEE_DEBUT_SAISON = 2026;
export const RENTREE = "8 septembre 2026" as const;

// ── TYPES ──────────────────────────────────────────────────

export type Categorie = "adulte" | "jeune" | "enfant";
export type Activite = "tennis" | "padel" | "deux";
export type Sexe = "F" | "H";

/** Composition d'une formule d'adhésion : licence FFT + adhésion club. */
export interface Formule {
  /** ID Ten'Up officiel pour deep-link (null si offre non activée Ten'Up) */
  tenupId: number | null;
  /** Libellé affiché (court) */
  label: string;
  /** Description courte (pour cartes vitrine) */
  description: string;
  /** Part licence FFT (reversée à la fédération, non remisable) */
  licence: number;
  /** Part adhésion club (sur laquelle s'appliquent les remises) */
  adhesion: number;
  /** Total brut affiché (licence + adhésion) */
  total: number;
  /** Conditions */
  conditions: {
    ageMin?: number;
    ageMax?: number;
    sexe?: Sexe;
  };
  /** Cette formule peut-elle bénéficier des remises ? (false pour licencié extérieur) */
  remiseApplicable: boolean;
}

/** Cours / stages / programmes spécialisés. Tarif unique. */
export interface Offre {
  tenupId: number | null;
  label: string;
  description: string;
  prix: number;
  /** Catégorie cible : adulte_F, adulte_H, jeune, enfant — null = tous */
  cibleCategorie: "adulte_F" | "adulte_H" | "adulte" | "jeune" | "enfant" | null;
  conditions: {
    ageMin?: number;
    ageMax?: number;
    sexe?: Sexe;
  };
  /** Cette offre est-elle activée sur Ten'Up (deep-link possible) ? */
  surTenup: boolean;
}

// ── ADHÉSIONS ──────────────────────────────────────────────
// 9 offres officielles Ten'Up saison 2026-2027 (millesime 2027)

export const ADHESIONS = {
  adulte_tennis: {
    tenupId: 684099,
    label: "Adulte — Tennis",
    description:
      "Licence FFT + assurance + accès illimité aux courts de tennis avec réservation gratuite.",
    licence: 33,
    adhesion: 97,
    total: 130,
    conditions: { ageMin: 18 },
    remiseApplicable: true,
  },
  adulte_padel: {
    tenupId: 684100,
    label: "Adulte — Padel",
    description:
      "Licence FFT + assurance + accès aux pistes de padel avec réservation gratuite.",
    licence: 33,
    adhesion: 97,
    total: 130,
    conditions: { ageMin: 18 },
    remiseApplicable: true,
  },
  adulte_deux: {
    tenupId: 684098,
    label: "Adulte — Tennis & Padel",
    description:
      "La formule la plus avantageuse : tennis + padel, une seule adhésion.",
    licence: 33,
    adhesion: 137,
    total: 170,
    conditions: { ageMin: 18 },
    remiseApplicable: true,
  },
  jeune_tennis: {
    tenupId: 684102,
    label: "Jeune 7-17 ans — Tennis",
    description: "Licence FFT + assurance + accès courts tennis.",
    licence: 23,
    adhesion: 57,
    total: 80,
    conditions: { ageMin: 7, ageMax: 17 },
    remiseApplicable: true,
  },
  jeune_padel: {
    tenupId: 684103,
    label: "Jeune 7-17 ans — Padel",
    description: "Licence FFT + assurance + accès pistes padel.",
    licence: 23,
    adhesion: 62,
    total: 85,
    conditions: { ageMin: 7, ageMax: 17 },
    remiseApplicable: true,
  },
  jeune_deux: {
    tenupId: 684101,
    label: "Jeune 7-17 ans — Tennis & Padel",
    description: "Combo tennis + padel pour les jeunes.",
    licence: 23,
    adhesion: 92,
    total: 115,
    conditions: { ageMin: 7, ageMax: 17 },
    remiseApplicable: true,
  },
  enfant_tennis: {
    tenupId: 684104,
    label: "Enfant -6 ans — Tennis",
    description: "Tarif découverte pour les moins de 6 ans. Tennis uniquement.",
    licence: 13,
    adhesion: 27,
    total: 40,
    conditions: { ageMax: 5 },
    remiseApplicable: true,
  },
  exterieur_padel: {
    tenupId: 684105,
    label: "Licencié extérieur — Padel seul",
    description:
      "Pour les joueurs déjà licenciés dans un autre club FFT, accès aux pistes padel uniquement. Aucune remise applicable.",
    licence: 0,
    adhesion: 170,
    total: 170,
    conditions: {},
    remiseApplicable: false,
  },
  adulte_accompagnant: {
    tenupId: 684106,
    label: "Adulte accompagnant — Licence seule",
    description:
      "Pour le parent qui accompagne un enfant adhérent. Donne la licence FFT sans accès illimité aux courts.",
    licence: 0,
    adhesion: 27,
    total: 27,
    conditions: { ageMin: 18 },
    remiseApplicable: false,
  },
} as const satisfies Record<string, Formule>;

export type FormuleKey = keyof typeof ADHESIONS;

// ── COURS / STAGES / TENNIS SANTÉ ──────────────────────────
// Présents sur Ten'Up (8 offres millesime 2027) + offres hors Ten'Up
// gérées par le club (stages, tennis santé spécialisés)

export const COURS = {
  // ── Présents sur Ten'Up ───────────────────────────────
  mini_tennis: {
    tenupId: 684113,
    label: "Mini-tennis (4-6 ans)",
    description:
      "Initiation au tennis pour les petits. 25 cours d'1h dans la saison.",
    prix: 85,
    cibleCategorie: "enfant",
    conditions: { ageMin: 4, ageMax: 6 },
    surTenup: true,
  },
  galaxie_tennis: {
    tenupId: 684114,
    label: "Galaxie tennis (6-13 ans)",
    description:
      "Programme officiel FFT. 25 cours d'1h30 — couleurs progressives.",
    prix: 120,
    cibleCategorie: "jeune",
    conditions: { ageMin: 6, ageMax: 13 },
    surTenup: true,
  },
  ecole_tennis: {
    tenupId: 684115,
    label: "École de tennis (14-17 ans)",
    description: "25 cours d'1h15 pour ados.",
    prix: 130,
    cibleCategorie: "jeune",
    conditions: { ageMin: 14, ageMax: 17 },
    surTenup: true,
  },
  cours_dame: {
    tenupId: 684116,
    label: "Cours Adulte Dame",
    description: "Cours collectifs adultes femmes. 25 cours d'1h15.",
    prix: 140,
    cibleCategorie: "adulte_F",
    conditions: { ageMin: 18, sexe: "F" },
    surTenup: true,
  },
  cours_homme: {
    tenupId: 684117,
    label: "Cours Adulte Homme",
    description: "Cours collectifs adultes hommes. 25 cours d'1h15.",
    prix: 160,
    cibleCategorie: "adulte_H",
    conditions: { ageMin: 18, sexe: "H" },
    surTenup: true,
  },
  pole_espoirs: {
    tenupId: 684118,
    label: "Pôle espoirs (6-12 ans)",
    description: "Sur avis des moniteurs. 50 cours d'1h15.",
    prix: 195,
    cibleCategorie: "jeune",
    conditions: { ageMin: 6, ageMax: 12 },
    surTenup: true,
  },
  pole_competition: {
    tenupId: 684119,
    label: "Pôle compétition (13-18 ans)",
    description: "Pour les jeunes compétiteurs. 25 cours d'1h15.",
    prix: 235,
    cibleCategorie: "jeune",
    conditions: { ageMin: 13, ageMax: 18 },
    surTenup: true,
  },
  tennis_sante_coeur: {
    tenupId: 684120,
    label: "Tennis / Padel Santé — Cœur de Douceur",
    description: "Programme bien-être adulte sur prescription.",
    prix: 50,
    cibleCategorie: "adulte",
    conditions: { ageMin: 18 },
    surTenup: true,
  },

  // ── Hors Ten'Up (gérés par le club) ──────────────────
  stage_padel: {
    tenupId: null,
    label: "Stage padel (groupe de 4)",
    description: "3 séances d'1h30 — groupes de 4 joueurs.",
    prix: 50,
    cibleCategorie: null,
    conditions: {},
    surTenup: false,
  },
  tennis_sante_adultes: {
    tenupId: null,
    label: "Tennis santé adultes",
    description: "Programme spécifique (cancer du sein). Sur prescription.",
    prix: 7,
    cibleCategorie: "adulte",
    conditions: { ageMin: 18 },
    surTenup: false,
  },
  tennis_sante_jeunes: {
    tenupId: null,
    label: "Tennis santé jeunes",
    description: "Programme pour enfants nés prématurés. 15 séances d'1h.",
    prix: 23,
    cibleCategorie: "jeune",
    conditions: { ageMin: 6, ageMax: 17 },
    surTenup: false,
  },
  stage_journee: {
    tenupId: null,
    label: "Stage vacances — journée",
    description: "Semaine de stage, 10h-16h30. 26 €/jour.",
    prix: 130,
    cibleCategorie: null,
    conditions: {},
    surTenup: false,
  },
  stage_demi_journee: {
    tenupId: null,
    label: "Stage vacances — demi-journée",
    description: "Semaine de stage, 10h-12h. 11 €/jour.",
    prix: 55,
    cibleCategorie: null,
    conditions: {},
    surTenup: false,
  },
} as const satisfies Record<string, Offre>;

export type CoursKey = keyof typeof COURS;

// ── REMISES ────────────────────────────────────────────────

/**
 * Remises applicables sur la part adhésion club uniquement (jamais sur la
 * licence FFT ni sur les cours).
 *
 * Mode de cumul piloté par CUMUL_REMISE dans config/inscriptions.ts.
 */
export const REMISES = {
  famille: {
    id: "famille",
    label: "Couple ou 2 enfants et +",
    taux: 0.2,
    /** Famille = mode panier famille (≥ 2 membres) — appliqué à TOUS les membres */
    auto: true,
  },
  social: {
    id: "social",
    label: "Couple / Étudiant / Chômeur",
    taux: 0.1,
    /** Social = case à cocher par membre (justificatif) */
    auto: false,
  },
} as const;

// ── HELPERS ────────────────────────────────────────────────

export const ALL_ADHESIONS = Object.entries(ADHESIONS).map(([key, f]) => ({
  key: key as FormuleKey,
  ...f,
}));

export const ALL_COURS = Object.entries(COURS).map(([key, c]) => ({
  key: key as CoursKey,
  ...c,
}));

/**
 * Retourne la clé de formule pour un membre, en tenant compte du cas extérieur.
 */
export function formuleKeyFor(
  categorie: Categorie,
  activite: Activite,
  exterieur: boolean,
): FormuleKey {
  if (categorie === "adulte" && activite === "padel" && exterieur) {
    return "exterieur_padel";
  }
  if (categorie === "enfant") {
    // Enfants : seul Tennis disponible (brief §6)
    return "enfant_tennis";
  }
  return `${categorie}_${activite}` as FormuleKey;
}

/**
 * Catégorie de filtrage cours pour un membre (les cours adulte sont genrés).
 */
export function cibleCoursFor(
  categorie: Categorie,
  sexe: Sexe,
): "enfant" | "jeune" | "adulte_F" | "adulte_H" {
  if (categorie === "adulte") return sexe === "F" ? "adulte_F" : "adulte_H";
  return categorie;
}
