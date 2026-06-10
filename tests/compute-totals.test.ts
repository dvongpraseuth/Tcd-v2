import { describe, it, expect } from "vitest";
import { calculerDevis, type FoyerInput } from "@/lib/compute-totals";

/**
 * ============================================================
 * MATRICE QA — cas validés bureau (questions-club-et-cas-tests.md PARTIE B)
 * Cumul des remises : ADDITIF par défaut (HANDOFF Claude Desktop §3)
 *   famille (-20%) + sociale (-10%) = -30% sur l'adhésion club
 * ============================================================
 */

const adulteH: FoyerInput["membres"][number] = {
  categorie: "adulte",
  sexe: "H",
  activite: "tennis",
  exterieur: false,
  cours: [],
  remiseSocialeDemandee: false,
};

describe("calculerDevis — matrice QA solo", () => {
  it("S1 Adulte Tennis sans remise → 130 €", () => {
    const d = calculerDevis({ mode: "seul", membres: [{ ...adulteH }] });
    expect(d.total).toBe(130);
    expect(d.membres[0].licence).toBe(33);
    expect(d.membres[0].adhesion).toBe(97);
    expect(d.membres[0].montantRemise).toBe(0);
  });

  it("S2 Adulte T&P -10% étudiant → 156,30 €", () => {
    const d = calculerDevis({
      mode: "seul",
      membres: [
        { ...adulteH, activite: "deux", remiseSocialeDemandee: true },
      ],
    });
    expect(d.total).toBe(156.3); // 33 + 137*0.9 = 33 + 123.30
    expect(d.membres[0].montantRemise).toBe(13.7); // 137*0.10
  });

  it("S3 Solo : la remise -20% famille n'est PAS appliquée", () => {
    const d = calculerDevis({
      mode: "seul",
      membres: [{ ...adulteH }],
    });
    expect(d.membres[0].composantesRemise.famille).toBe(0);
  });

  it("S4 Jeune Padel + cours Galaxie 120€ → 205 €", () => {
    const d = calculerDevis({
      mode: "seul",
      membres: [
        {
          categorie: "jeune",
          sexe: "H",
          activite: "padel",
          exterieur: false,
          cours: ["galaxie_tennis"],
          remiseSocialeDemandee: false,
        },
      ],
    });
    expect(d.total).toBe(205); // 23 + 62 + 120
    expect(d.membres[0].coursTotal).toBe(120); // cours non remisés
  });

  it("S5 Enfant -6 ans Tennis → 40 €", () => {
    const d = calculerDevis({
      mode: "seul",
      membres: [
        {
          categorie: "enfant",
          sexe: "F",
          activite: "tennis",
          exterieur: false,
          cours: [],
          remiseSocialeDemandee: false,
        },
      ],
    });
    expect(d.total).toBe(40); // 13 + 27
  });

  it("S7 Adulte Padel licencié extérieur → 170 €, remise ignorée", () => {
    const d = calculerDevis({
      mode: "seul",
      membres: [
        {
          ...adulteH,
          activite: "padel",
          exterieur: true,
          remiseSocialeDemandee: true, // tente la remise sociale
        },
      ],
    });
    expect(d.total).toBe(170);
    expect(d.membres[0].montantRemise).toBe(0); // remise bloquée
    expect(d.membres[0].licence).toBe(0); // pas de licence
  });
});

describe("calculerDevis — matrice QA famille", () => {
  it("F1 Famille 3 : Adulte T&P + Jeune Tennis(-10%) + Enfant Tennis + mini-tennis → 325,10 €", () => {
    const d = calculerDevis({
      mode: "famille",
      membres: [
        // M1 : Adulte T&P, pas de cours
        {
          categorie: "adulte",
          sexe: "H",
          activite: "deux",
          exterieur: false,
          cours: [],
          remiseSocialeDemandee: false,
        },
        // M2 : Jeune Tennis avec -10% étudiant
        {
          categorie: "jeune",
          sexe: "H",
          activite: "tennis",
          exterieur: false,
          cours: [],
          remiseSocialeDemandee: true,
        },
        // M3 : Enfant Tennis + mini-tennis
        {
          categorie: "enfant",
          sexe: "F",
          activite: "tennis",
          exterieur: false,
          cours: ["mini_tennis"],
          remiseSocialeDemandee: false,
        },
      ],
    });

    expect(d.membres[0].sousTotal).toBe(142.6); // 33 + 137 - 27.40
    expect(d.membres[1].sousTotal).toBe(62.9); // 23 + 57 - 17.10
    expect(d.membres[2].sousTotal).toBe(119.6); // 13 + 27 - 5.40 + 85
    expect(d.total).toBe(325.1);
  });

  it("F6 Total foyer = somme des sous-totaux", () => {
    const d = calculerDevis({
      mode: "famille",
      membres: [
        { ...adulteH, activite: "tennis" },
        { ...adulteH, sexe: "F", activite: "padel" },
      ],
    });
    const sommeManuelle =
      d.membres.reduce((s, m) => s + m.sousTotal, 0);
    expect(d.total).toBe(sommeManuelle);
  });
});

describe("calculerDevis — cas de bord", () => {
  it("Solo sans cours : sousTotal = licence + adhésion", () => {
    const d = calculerDevis({ mode: "seul", membres: [{ ...adulteH }] });
    expect(d.membres[0].sousTotal).toBe(
      d.membres[0].licence + d.membres[0].adhesionNette,
    );
  });

  it("Famille 2 membres = mode famille actif → -20% sur chacun", () => {
    const d = calculerDevis({
      mode: "famille",
      membres: [
        { ...adulteH },
        { ...adulteH, sexe: "F" },
      ],
    });
    expect(d.membres[0].composantesRemise.famille).toBe(0.2);
    expect(d.membres[1].composantesRemise.famille).toBe(0.2);
  });
});
