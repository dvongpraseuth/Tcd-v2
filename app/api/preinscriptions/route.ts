import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { preinscriptionSchema } from "@/app/inscription/schema";
import { calculerDevis } from "@/lib/compute-totals";
import { profilFor } from "@/lib/profile";
import { ADHESION, COURS, STAGES, TENNIS_SANTE } from "@/config/tarifs";

export const runtime = "nodejs"; // Fluid Compute (cf vercel knowledge update)

/**
 * POST /api/preinscriptions
 *
 * Convention TCD :
 * - Validation Zod stricte
 * - Recalcul serveur du devis (jamais trust client)
 * - Client anon Supabase (RLS active) → policy anon_insert_*
 * - Insertion atomique : preinscription + membres dans la foulée, rollback si membre échoue
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON invalide" },
      { status: 400 },
    );
  }

  const parse = preinscriptionSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parse.error.flatten() },
      { status: 400 },
    );
  }
  const data = parse.data;

  // Recalcul serveur — source de vérité montant
  const devis = calculerDevis({
    membres: data.membres.map((m) => ({
      dateNaissance: new Date(m.dateNaissance),
      sexe: m.sexe,
      cours: m.cours ?? null,
      stages: m.stages,
      tennisSante: m.tennisSante,
    })),
    situationSociale: data.situationSociale,
  });

  const supabase = await createClient();

  // 1. Insert préinscription
  const { data: preins, error: errIns } = await supabase
    .from("preinscriptions")
    .insert({
      email: data.email,
      telephone: data.telephone,
      code_postal: data.codePostal,
      ville: data.ville,
      adresse: data.adresse ?? null,
      type_inscription: data.typeInscription,
      situation_sociale: data.situationSociale,
      notes_libres: data.notesLibres ?? null,
      porte_choisie: data.porteChoisie ?? null,
      total_calcule: devis.total,
      remise_type: devis.remise.label
        ? data.situationSociale && devis.adhesionBrute * 0.1 >= devis.remise.montant
          ? "sociale"
          : "famille"
        : null,
      remise_montant: devis.remise.montant,
      saison: process.env.NEXT_PUBLIC_SAISON ?? "2026-2027",
    })
    .select("id")
    .single();

  if (errIns || !preins) {
    console.error("[preinscriptions] insert error:", errIns);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la préinscription" },
      { status: 500 },
    );
  }

  // 2. Insert membres
  const membresRows = data.membres.map((m) => {
    const naissance = new Date(m.dateNaissance);
    const profil = profilFor(naissance, 2026);
    const coursMontant = m.cours ? COURS[m.cours].prix : 0;
    const stagesMontant = m.stages.reduce((s, k) => s + STAGES[k].prix, 0);
    return {
      preinscription_id: preins.id,
      nom: m.nom,
      prenom: m.prenom,
      date_naissance: m.dateNaissance,
      sexe: m.sexe,
      profil,
      cours: m.cours ?? null,
      stages: m.stages,
      tennis_sante: m.tennisSante,
      adhesion: ADHESION[profil],
      cours_montant: coursMontant,
      stages_montant: stagesMontant,
      tennis_sante_montant: m.tennisSante ? TENNIS_SANTE.prix : 0,
    };
  });

  const { error: errMembres } = await supabase
    .from("preinscription_membres")
    .insert(membresRows);

  if (errMembres) {
    console.error("[preinscriptions] insert membres error:", errMembres);
    // Rollback manuel — Supabase REST ne supporte pas les transactions
    await supabase.from("preinscriptions").delete().eq("id", preins.id);
    return NextResponse.json(
      { error: "Impossible d'enregistrer les membres" },
      { status: 500 },
    );
  }

  // TODO P1 : envoi email récap au foyer + notif admin
  // (utilisera ADMIN_NOTIF_EMAIL côté env)

  return NextResponse.json({ id: preins.id, total: devis.total }, { status: 201 });
}
