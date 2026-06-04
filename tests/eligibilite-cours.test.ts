import { describe, it, expect } from "vitest";
import { coursEligibles } from "@/lib/eligibilite-cours";

describe("coursEligibles — filtrage par âge et sexe", () => {
  it("propose École + Compétition à un jeune de 14 ans", () => {
    const keys = coursEligibles(
      { dateNaissance: new Date("2012-04-10"), sexe: "M" },
      2026,
    ).map((c) => c.key);
    expect(keys).toContain("ecole_tennis");
    expect(keys).toContain("competition");
    expect(keys).not.toContain("cours_adulte");
    expect(keys).not.toContain("cours_dames");
  });

  it("propose Cours adulte + Cours dames à une femme adulte", () => {
    const keys = coursEligibles(
      { dateNaissance: new Date("1995-06-20"), sexe: "F" },
      2026,
    ).map((c) => c.key);
    expect(keys).toContain("cours_adulte");
    expect(keys).toContain("cours_dames");
    expect(keys).not.toContain("ecole_tennis");
  });

  it("ne propose PAS Cours dames à un homme adulte", () => {
    const keys = coursEligibles(
      { dateNaissance: new Date("1985-01-01"), sexe: "M" },
      2026,
    ).map((c) => c.key);
    expect(keys).toContain("cours_adulte");
    expect(keys).not.toContain("cours_dames");
  });
});
