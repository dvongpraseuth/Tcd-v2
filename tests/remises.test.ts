import { describe, it, expect } from "vitest";
import { tauxRemise } from "@/lib/remises";

/**
 * Cumul ADDITIF par défaut (CUMUL_REMISE = "additif" dans config/inscriptions.ts).
 * À ajuster si le bureau tranche autrement.
 */

describe("tauxRemise — cumul additif", () => {
  it("Aucune remise si pas éligible", () => {
    const r = tauxRemise({
      remiseApplicable: true,
      estFamille: false,
      remiseSocialeDemandee: false,
    });
    expect(r.taux).toBe(0);
  });

  it("Famille seule = -20%", () => {
    const r = tauxRemise({
      remiseApplicable: true,
      estFamille: true,
      remiseSocialeDemandee: false,
    });
    expect(r.taux).toBeCloseTo(0.2, 5);
    expect(r.composantes.famille).toBe(0.2);
    expect(r.composantes.sociale).toBe(0);
  });

  it("Sociale seule = -10%", () => {
    const r = tauxRemise({
      remiseApplicable: true,
      estFamille: false,
      remiseSocialeDemandee: true,
    });
    expect(r.taux).toBeCloseTo(0.1, 5);
  });

  it("Famille + Sociale cumul additif = -30%", () => {
    const r = tauxRemise({
      remiseApplicable: true,
      estFamille: true,
      remiseSocialeDemandee: true,
    });
    expect(r.taux).toBeCloseTo(0.3, 5);
    expect(r.composantes.famille).toBe(0.2);
    expect(r.composantes.sociale).toBe(0.1);
  });

  it("Membre non remisable (licencié extérieur) = aucune remise même cochée", () => {
    const r = tauxRemise({
      remiseApplicable: false,
      estFamille: true,
      remiseSocialeDemandee: true,
    });
    expect(r.taux).toBe(0);
    expect(r.composantes.famille).toBe(0);
    expect(r.composantes.sociale).toBe(0);
  });
});
