import { describe, it, expect } from "vitest";
import { calculerRemise } from "@/lib/remises";

describe("calculerRemise — famille XOR sociale, non cumulables", () => {
  it("applique -20% famille dès 2 membres", () => {
    const r = calculerRemise({
      adhesionBrute: 338,
      nombreMembres: 3,
      situationSociale: false,
    });
    expect(r.type).toBe("famille");
    expect(r.montant).toBe(68); // 338 × 0.20 = 67.6 → arrondi 68
  });

  it("applique -10% sociale si pas éligible famille", () => {
    const r = calculerRemise({
      adhesionBrute: 130,
      nombreMembres: 1,
      situationSociale: true,
    });
    expect(r.type).toBe("sociale");
    expect(r.montant).toBe(13);
  });

  it("retient la plus avantageuse (famille) si les 2 éligibles", () => {
    const r = calculerRemise({
      adhesionBrute: 300,
      nombreMembres: 3,
      situationSociale: true,
    });
    // famille = 60, sociale = 30 → on prend famille
    expect(r.type).toBe("famille");
    expect(r.montant).toBe(60);
  });

  it("aucune remise si pas éligible", () => {
    const r = calculerRemise({
      adhesionBrute: 130,
      nombreMembres: 1,
      situationSociale: false,
    });
    expect(r.type).toBe(null);
    expect(r.montant).toBe(0);
  });
});
