import { describe, it, expect } from "vitest";
import { calculerDevis } from "@/lib/compute-totals";

/**
 * ============================================================
 * RÉSULTATS ANCRÉS — brief §10
 * Ces 2 tests sont la source de vérité pour les valeurs
 * de config/tarifs.ts. Si ils cassent, c'est le code OU les
 * tarifs qui ont divergé du brief — pas le test.
 * ============================================================
 */

describe("calculerDevis — résultats ancrés brief §10", () => {
  it("famille 2 adultes Tennis + 1 jeune École → 338+130-68=400€", () => {
    const devis = calculerDevis(
      {
        membres: [
          // Adulte 1 — pas de cours
          { dateNaissance: new Date("1985-01-01"), sexe: "M" },
          // Adulte 2 — pas de cours
          { dateNaissance: new Date("1987-06-15"), sexe: "F" },
          // Jeune — cours École de tennis
          { dateNaissance: new Date("2014-03-10"), sexe: "M", cours: "ecole_tennis" },
        ],
        situationSociale: false,
      },
      2026,
    );

    expect(devis.adhesionBrute).toBe(338); // 130 + 130 + 78
    expect(devis.coursTotal).toBe(130);    // École de tennis
    expect(devis.remise.montant).toBe(68); // 20% famille sur 338
    expect(devis.remise.label).toBeTruthy();
    expect(devis.total).toBe(400);
  });

  it("femme adulte Tennis + cours Dames étudiante → 130+140-13=257€", () => {
    const devis = calculerDevis(
      {
        membres: [
          {
            dateNaissance: new Date("1998-09-22"),
            sexe: "F",
            cours: "cours_dames",
          },
        ],
        situationSociale: true, // étudiante = tarif social
      },
      2026,
    );

    expect(devis.adhesionBrute).toBe(130);
    expect(devis.coursTotal).toBe(140);
    expect(devis.remise.montant).toBe(13); // 10% sociale sur 130
    expect(devis.total).toBe(257);
  });
});

describe("calculerDevis — cas de bord", () => {
  it("totalise correctement adhésion + cours + stages + tennis santé sans remise", () => {
    const devis = calculerDevis(
      {
        membres: [
          {
            dateNaissance: new Date("1990-05-05"),
            sexe: "M",
            cours: "cours_adulte",
            stages: ["stage_adulte"],
            tennisSante: false,
          },
        ],
        situationSociale: false,
      },
      2026,
    );
    expect(devis.adhesionBrute).toBe(130);
    expect(devis.coursTotal).toBe(180);
    expect(devis.stagesTotal).toBe(60);
    expect(devis.remise.montant).toBe(0);
    expect(devis.total).toBe(370);
  });

  it("enfant <6 ans : adhésion enfant 60€, pas de cours", () => {
    const devis = calculerDevis(
      {
        membres: [
          { dateNaissance: new Date("2022-04-10"), sexe: "F" },
        ],
        situationSociale: false,
      },
      2026,
    );
    expect(devis.membres[0].profil).toBe("enfant");
    expect(devis.membres[0].adhesion).toBe(60);
    expect(devis.total).toBe(60);
  });
});
