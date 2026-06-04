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
    if (c.eligibilite.ageMin !== undefined && age < c.eligibilite.ageMin) return false;
    if (c.eligibilite.ageMax !== undefined && age > c.eligibilite.ageMax) return false;
    if (c.eligibilite.sexe !== undefined && c.eligibilite.sexe !== membre.sexe) return false;
    return true;
  }).map((c) => ({ key: c.key, label: c.label, prix: c.prix }));
}
