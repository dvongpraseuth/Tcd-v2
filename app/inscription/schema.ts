import { z } from "zod";

/**
 * ============================================================
 * SCHÉMA ZOD — saison 2026-2027
 *
 * Modèle aligné sur le HANDOFF Claude Desktop :
 * - Catégorie + activité déclarées (pas calculées depuis date naissance)
 * - Décomposition adhésion = licence + adhésion club
 * - Cours peuvent être multiples par membre
 *
 * Contrat partagé client (validation formulaire) ↔ serveur (validation POST).
 * ============================================================
 */

import { ADHESIONS, COURS } from "@/config/tarifs";

// Clés dérivées de config/tarifs.ts pour rester en sync
const formuleKeys = Object.keys(ADHESIONS) as [keyof typeof ADHESIONS];
const coursKeys = Object.keys(COURS) as [keyof typeof COURS];

export const membreSchema = z.object({
  nom: z.string().trim().min(1, "Nom requis").max(80),
  prenom: z.string().trim().min(1, "Prénom requis").max(80),
  /** Date naissance pour validation cohérence catégorie + à archiver fiche club */
  dateNaissance: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD"),
  /** Catégorie déclarée par l'utilisateur dans le funnel */
  categorie: z.enum(["adulte", "jeune", "enfant"]),
  /** Sexe — sert au filtrage des cours genrés (Dame / Homme) */
  sexe: z.enum(["F", "H"]),
  /** Activité choisie */
  activite: z.enum(["tennis", "padel", "deux"]),
  /** Toggle "déjà licencié dans un autre club" (Padel adulte uniquement) */
  exterieur: z.boolean().default(false),
  /** Cours / stages choisis (peuvent être multiples) */
  cours: z.array(z.enum(coursKeys)).default([]),
  /** Le membre coche la remise -10% sociale ? */
  remiseSocialeDemandee: z.boolean().default(false),
  /** Clé de formule calculée serveur (snapshot) — laissé optionnel côté client */
  formuleKey: z.enum(formuleKeys).optional(),
});

export const preinscriptionSchema = z.object({
  mode: z.enum(["seul", "famille"]),
  membres: z
    .array(membreSchema)
    .min(1, "Au moins un membre requis")
    .max(8, "8 membres maximum"),

  // Coordonnées foyer
  email: z.string().trim().toLowerCase().email("Email invalide"),
  telephone: z
    .string()
    .trim()
    .regex(/^[\d\s+().-]{8,20}$/, "Téléphone invalide"),
  codePostal: z.string().trim().regex(/^\d{5}$/, "Code postal 5 chiffres"),
  ville: z.string().trim().min(1, "Ville requise").max(80),
  adresse: z.string().trim().max(200).optional(),

  // Routage choisi par le tunnel (info pour stats)
  routageInitial: z.enum(["simple", "complexe"]).optional(),

  // Notes libres (commentaire foyer)
  notesLibres: z.string().trim().max(2000).optional(),
});

export type MembreInput = z.infer<typeof membreSchema>;
export type PreinscriptionInput = z.infer<typeof preinscriptionSchema>;
