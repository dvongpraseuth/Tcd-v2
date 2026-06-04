import { ALL_COURS, type CoursKey, type Sexe } from "@/config/tarifs";
import { ageAuPeriode } from "@/lib/profile";

interface CritereProfil {
  dateNaissance: Date;
  sexe: Sexe;
}

/**
 * Retourne la liste des cours auxquels un membre est éligible
 * en fonction de son âge (au 1er sept de la saison) et de son sexe.
 *
 * Brief §6 — règles d'éligibilité posées dans config/tarifs.ts
 */
export function coursEligibles(
  membre: CritereProfil,
  anneeDebutSaison = 2026,
): { key: CoursKey; label: string; prix: number }[] {
  const ref = new Date(anneeDebutSaison, 8, 1);
  const age = ageAuPeriode(membre.dateNaissance, ref);

  return ALL_COURS.filter((c) => {
    // Type union des eligibilites — on cast en partial pour accès uniforme
    const e = c.eligibilite as {
      ageMin?: number;
      ageMax?: number;
      sexe?: Sexe;
    };
    if (e.ageMin !== undefined && age < e.ageMin) return false;
    if (e.ageMax !== undefined && age > e.ageMax) return false;
    if (e.sexe !== undefined && e.sexe !== membre.sexe) return false;
    return true;
  }).map((c) => ({ key: c.key, label: c.label, prix: c.prix }));
}
