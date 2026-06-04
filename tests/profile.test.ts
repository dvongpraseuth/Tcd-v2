import { describe, it, expect } from "vitest";
import { profilFor, ageAuPeriode } from "@/lib/profile";

describe("profilFor — tranches d'âge TCD au 1er sept saison", () => {
  it("classe en 'adulte' un membre de 18+ ans au 1er sept", () => {
    expect(profilFor(new Date("2000-05-15"), 2026)).toBe("adulte");
    expect(profilFor(new Date("2008-09-01"), 2026)).toBe("adulte"); // 18 ans pile
  });

  it("classe en 'jeune' un membre de 6 à 17 ans au 1er sept", () => {
    expect(profilFor(new Date("2010-03-12"), 2026)).toBe("jeune"); // 16 ans
    expect(profilFor(new Date("2020-08-30"), 2026)).toBe("jeune"); // 6 ans pile
  });

  it("classe en 'enfant' un membre de moins de 6 ans au 1er sept", () => {
    expect(profilFor(new Date("2022-01-01"), 2026)).toBe("enfant"); // 4 ans
    expect(profilFor(new Date("2020-09-02"), 2026)).toBe("enfant"); // 5 ans (anniv après ref)
  });

  it("ageAuPeriode tient compte du mois/jour", () => {
    const naissance = new Date("2010-12-15");
    expect(ageAuPeriode(naissance, new Date("2026-09-01"))).toBe(15);
    expect(ageAuPeriode(naissance, new Date("2026-12-15"))).toBe(16);
  });
});
