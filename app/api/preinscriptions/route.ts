import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { preinscriptionSchema } from "@/app/inscription/schema";
import { calculerDevis } from "@/lib/compute-totals";
import { profilFor } from "@/lib/profile";
import { SAISON, formuleKeyFor } from "@/config/tarifs";

export const runtime = "nodejs"; // Fluid Compute

/**
 * POST /api/preinscriptions
 *
 * - Validation Zod stricte
 * - Recalcul serveur du devis (jamais trust client)
 * - Validation cohérence catégorie déclarée vs date de naissance
 * - Client anon Supabase (RLS active) → policy anon_insert_*
 * - Insertion atomique : préinscription + membres, rollback si membre échoue
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parse = preinscriptionSchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parse.error.flatten() },
      { status: 400 },
    );
  }
  const data = parse.data;

  // Cohérence catégorie déclarée vs date naissance (warning seulement, pas blocage —
  // certains cas légitimes : enfant 6 ans pile, jeune 17 ans tardif).
  const incohérences: string[] = [];
  for (const [i, m] of data.membres.entries()) {
    const profilAuto = profilFor(new Date(m.dateNaissance));
    if (profilAuto !== m.categorie) {
      incohérences.push(
        `Membre ${i + 1} (${m.prenom}) : catégorie déclarée "${m.categorie}" diffère de l'âge calculé "${profilAuto}"`,
      );
    }
  }

  // Recalcul serveur
  const devis = calculerDevis({
    mode: data.mode,
    membres: data.membres.map((m) => ({
      categorie: m.categorie,
      sexe: m.sexe,
      activite: m.activite,
      exterieur: m.exterieur,
      cours: m.cours,
      remiseSocialeDemandee: m.remiseSocialeDemandee,
    })),
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
      mode: data.mode,
      routage_initial: data.routageInitial ?? null,
      notes_libres: data.notesLibres ?? null,
      incoherences: incohérences.length > 0 ? incohérences : null,
      total_calcule: devis.total,
      saison: SAISON,
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
  const membresRows = data.membres.map((m, i) => {
    const detail = devis.membres[i];
    return {
      preinscription_id: preins.id,
      nom: m.nom,
      prenom: m.prenom,
      date_naissance: m.dateNaissance,
      sexe: m.sexe,
      categorie: m.categorie,
      activite: m.activite,
      exterieur: m.exterieur,
      formule_key: formuleKeyFor(m.categorie, m.activite, m.exterieur),
      cours: m.cours,
      remise_sociale_demandee: m.remiseSocialeDemandee,
      licence: detail.licence,
      adhesion_brute: detail.adhesion,
      montant_remise: detail.montantRemise,
      adhesion_nette: detail.adhesionNette,
      cours_montant: detail.coursTotal,
      sous_total: detail.sousTotal,
    };
  });

  const { error: errMembres } = await supabase
    .from("preinscription_membres")
    .insert(membresRows);

  if (errMembres) {
    console.error("[preinscriptions] insert membres error:", errMembres);
    await supabase.from("preinscriptions").delete().eq("id", preins.id);
    return NextResponse.json(
      { error: "Impossible d'enregistrer les membres" },
      { status: 500 },
    );
  }

  // TODO P1 : envoi email récap au foyer + notif admin (ADMIN_NOTIF_EMAIL)

  return NextResponse.json(
    { id: preins.id, total: devis.total, incohérences },
    { status: 201 },
  );
}
