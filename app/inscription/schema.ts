import { z } from "zod";

/**
 * Schéma Zod partagé client (validation form) + serveur (validation POST).
 * Source de vérité unique du contrat de soumission.
 */

export const membreSchema = z.object({
  nom: z.string().trim().min(1, "Nom requis").max(80),
  prenom: z.string().trim().min(1, "Prénom requis").max(80),
  dateNaissance: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  sexe: z.enum(["F", "M", "X"]),
  cours: z
    .enum([
      "ecole_tennis",
      "cours_adulte",
      "cours_dames",
      "competition",
    ])
    .nullable()
    .optional(),
  stages: z
    .array(z.enum(["stage_jeune", "stage_adulte"]))
    .default([]),
  tennisSante: z.boolean().default(false),
});

export const preinscriptionSchema = z.object({
  typeInscription: z.enum(["solo", "famille"]),
  membres: z
    .array(membreSchema)
    .min(1, "Au moins un membre requis")
    .max(8, "8 membres maximum"),

  // Situation
  situationSociale: z.boolean().default(false),

  // Coordonnées foyer
  email: z.string().trim().toLowerCase().email("Email invalide"),
  telephone: z
    .string()
    .trim()
    .regex(/^[\d\s+().-]{8,20}$/, "Téléphone invalide"),
  codePostal: z.string().trim().regex(/^\d{5}$/, "Code postal 5 chiffres"),
  ville: z.string().trim().min(1, "Ville requise").max(80),
  adresse: z.string().trim().max(200).optional(),

  // Tunnel
  porteChoisie: z.enum(["tenup", "local"]).optional(),
  notesLibres: z.string().trim().max(2000).optional(),
});

export type MembreInput = z.infer<typeof membreSchema>;
export type PreinscriptionInput = z.infer<typeof preinscriptionSchema>;
