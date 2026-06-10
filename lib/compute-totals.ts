/**
 * ============================================================
 * CALCUL DU DEVIS FOYER — saison 2026-2027
 *
 * Modèle aligné sur le HANDOFF Claude Desktop :
 * - Adhésion = licence FFT + adhésion club (séparées)
 * - Remises sur la part adhésion club uniquement
 * - Cours / stages non remisés
 * - Mode famille (≥2 membres) déclenche -20% auto
 * - Mode social (-10%) sur case à cocher par membre
 * ============================================================
 */

import {
  ADHESIONS,
  COURS,
  formuleKeyFor,
  type Activite,
  type Categorie,
  type CoursKey,
  type FormuleKey,
  type Sexe,
} from "@/config/tarifs";
import { arrondi2, tauxRemise } from "@/lib/remises";

export interface MembreInput {
  categorie: Categorie;
  sexe: Sexe;
  activite: Activite;
  /** Toggle "déjà licencié dans un autre club" (Padel adulte uniquement) */
  exterieur: boolean;
  /** Cours / stages sélectionnés */
  cours: CoursKey[];
  /** Case "-10% étudiant / chômeur / couple" cochée par ce membre */
  remiseSocialeDemandee: boolean;
}

export interface FoyerInput {
  mode: "seul" | "famille";
  membres: MembreInput[];
}

export interface DetailMembre {
  formuleKey: FormuleKey;
  formuleLabel: string;
  licence: number;
  adhesion: number;
  /** Taux de remise appliqué (0 si aucune) */
  tauxRemise: number;
  /** Montant € retiré de l'adhésion */
  montantRemise: number;
  /** Détail des composantes (pour récap UI) */
  composantesRemise: { famille: number; sociale: number };
  /** Adhésion club après remise */
  adhesionNette: number;
  /** Total adhésion (licence + adhésion nette) */
  totalAdhesion: number;
  /** Détail des cours sélectionnés avec prix */
  coursDetail: { key: CoursKey; label: string; prix: number }[];
  /** Total des cours */
  coursTotal: number;
  /** Sous-total du membre (totalAdhesion + coursTotal) */
  sousTotal: number;
}

export interface DevisFoyer {
  mode: "seul" | "famille";
  membres: DetailMembre[];
  /** Somme des sous-totaux membres */
  total: number;
}

/**
 * Calcule le devis complet d'un foyer.
 *
 * Cas de test ancrés (HANDOFF §5) :
 *   Solo Adulte Tennis sans remise        → 130 €
 *   Solo Adulte Tennis -10%               → 120,30 €
 *   Solo Adulte T&P cumul -30%            → 128,90 €  (note : HANDOFF dit 100,90 par erreur)
 *   Solo Padel extérieur (-20% coché)     → 170 €    (remise ignorée)
 *   Solo Enfant Tennis                    → 40 €
 *   Famille 3 Adulte T&P + Jeune T -10% + Enfant T + mini-tennis → 325,10 €
 */
export function calculerDevis(foyer: FoyerInput): DevisFoyer {
  const estFamille = foyer.mode === "famille" && foyer.membres.length >= 2;

  const membres: DetailMembre[] = foyer.membres.map((m) => {
    const formuleKey = formuleKeyFor(m.categorie, m.activite, m.exterieur);
    const formule = ADHESIONS[formuleKey];

    const remise = tauxRemise({
      remiseApplicable: formule.remiseApplicable,
      estFamille,
      remiseSocialeDemandee: m.remiseSocialeDemandee,
    });

    const montantRemise = arrondi2(formule.adhesion * remise.taux);
    const adhesionNette = arrondi2(formule.adhesion - montantRemise);
    const totalAdhesion = arrondi2(formule.licence + adhesionNette);

    const coursDetail = m.cours.map((k) => ({
      key: k,
      label: COURS[k].label,
      prix: COURS[k].prix,
    }));
    const coursTotal = coursDetail.reduce((s, c) => s + c.prix, 0);

    return {
      formuleKey,
      formuleLabel: formule.label,
      licence: formule.licence,
      adhesion: formule.adhesion,
      tauxRemise: remise.taux,
      montantRemise,
      composantesRemise: remise.composantes,
      adhesionNette,
      totalAdhesion,
      coursDetail,
      coursTotal,
      sousTotal: arrondi2(totalAdhesion + coursTotal),
    };
  });

  const total = arrondi2(membres.reduce((s, m) => s + m.sousTotal, 0));

  return {
    mode: foyer.mode,
    membres,
    total,
  };
}

/**
 * Helper : construit un membre vide (état initial du funnel).
 */
export function membreVide(): MembreInput {
  return {
    categorie: "adulte",
    sexe: "H",
    activite: "tennis",
    exterieur: false,
    cours: [],
    remiseSocialeDemandee: false,
  };
}
