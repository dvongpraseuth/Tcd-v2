import { ADHESION, COURS, STAGES, TENNIS_SANTE, type CoursKey, type StageKey, type Sexe } from "@/config/tarifs";
import { profilFor } from "@/lib/profile";
import { calculerRemise } from "@/lib/remises";

export interface MembreInput {
  dateNaissance: Date;
  sexe: Sexe;
  cours?: CoursKey | null;
  stages?: StageKey[];
  tennisSante?: boolean;
}

export interface FoyerInput {
  membres: MembreInput[];
  /** Au moins un membre déclare une situation sociale (étudiant, demandeur d'emploi, RSA) */
  situationSociale: boolean;
}

export interface DetailMembre {
  profil: "enfant" | "jeune" | "adulte";
  adhesion: number;
  cours: number;
  stages: number;
  tennisSante: number;
  sousTotal: number;
}

export interface DevisFoyer {
  membres: DetailMembre[];
  adhesionBrute: number;
  remise: { montant: number; label: string | null };
  coursTotal: number;
  stagesTotal: number;
  tennisSanteTotal: number;
  total: number;
}

/**
 * Calcul du devis d'un foyer pour la saison.
 *
 * Règles clés (brief §6) :
 * - Chaque membre paye sa part adhésion (selon profil âge)
 * - Cours / Stages / Tennis Santé = suppléments sans remise
 * - Remise (famille XOR sociale) appliquée uniquement sur l'adhésion totale
 *
 * Résultats ancrés (brief §10) — voir tests Vitest :
 *   famille 2 adultes Tennis + 1 jeune École → 338+130-68=400€
 *   femme adulte Tennis + cours Dames étudiante → 130+140-13=257€
 */
export function calculerDevis(foyer: FoyerInput, anneeDebutSaison = 2026): DevisFoyer {
  const detailsMembres: DetailMembre[] = foyer.membres.map((m) => {
    const profil = profilFor(m.dateNaissance, anneeDebutSaison);
    const adhesion = ADHESION[profil];
    const cours = m.cours ? COURS[m.cours].prix : 0;
    const stages = (m.stages ?? []).reduce((sum, k) => sum + STAGES[k].prix, 0);
    const tennisSante = m.tennisSante ? TENNIS_SANTE.prix : 0;
    return {
      profil,
      adhesion,
      cours,
      stages,
      tennisSante,
      sousTotal: adhesion + cours + stages + tennisSante,
    };
  });

  const adhesionBrute = detailsMembres.reduce((s, m) => s + m.adhesion, 0);
  const coursTotal = detailsMembres.reduce((s, m) => s + m.cours, 0);
  const stagesTotal = detailsMembres.reduce((s, m) => s + m.stages, 0);
  const tennisSanteTotal = detailsMembres.reduce((s, m) => s + m.tennisSante, 0);

  const remise = calculerRemise({
    adhesionBrute,
    nombreMembres: foyer.membres.length,
    situationSociale: foyer.situationSociale,
  });

  const total = adhesionBrute + coursTotal + stagesTotal + tennisSanteTotal - remise.montant;

  return {
    membres: detailsMembres,
    adhesionBrute,
    remise: { montant: remise.montant, label: remise.label },
    coursTotal,
    stagesTotal,
    tennisSanteTotal,
    total,
  };
}
