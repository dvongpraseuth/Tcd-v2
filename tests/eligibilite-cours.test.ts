import { describe, it, expect } from "vitest";
import { coursEligibles } from "@/lib/eligibilite-cours";

describe("coursEligibles — filtrage par catégorie et sexe", () => {
  it("Enfant : seulement mini-tennis (catégorie 'enfant')", () => {
    const cours = coursEligibles("enfant", "F").map((c) => c.key);
    expect(cours).toContain("mini_tennis");
    // Et pas les cours adultes ni jeunes spécifiques
    expect(cours).not.toContain("cours_dame");
    expect(cours).not.toContain("cours_homme");
    expect(cours).not.toContain("ecole_tennis");
  });

  it("Jeune : galaxie, école, pôles, tennis santé jeunes", () => {
    const cours = coursEligibles("jeune", "H").map((c) => c.key);
    expect(cours).toContain("galaxie_tennis");
    expect(cours).toContain("ecole_tennis");
    expect(cours).toContain("pole_espoirs");
    expect(cours).toContain("pole_competition");
    expect(cours).toContain("tennis_sante_jeunes");
    expect(cours).not.toContain("cours_homme");
    expect(cours).not.toContain("cours_dame");
  });

  it("Adulte Femme : cours dame, tennis santé adulte, stages, PAS cours homme", () => {
    const cours = coursEligibles("adulte", "F").map((c) => c.key);
    expect(cours).toContain("cours_dame");
    expect(cours).toContain("tennis_sante_coeur");
    expect(cours).toContain("tennis_sante_adultes");
    expect(cours).toContain("stage_padel"); // null cible = ouvert à tous
    expect(cours).not.toContain("cours_homme");
  });

  it("Adulte Homme : cours homme, tennis santé adulte, stages, PAS cours dame", () => {
    const cours = coursEligibles("adulte", "H").map((c) => c.key);
    expect(cours).toContain("cours_homme");
    expect(cours).toContain("tennis_sante_coeur");
    expect(cours).toContain("stage_padel");
    expect(cours).not.toContain("cours_dame");
  });
});
