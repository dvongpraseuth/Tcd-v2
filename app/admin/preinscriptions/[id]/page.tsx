import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface MembreRow {
  id: string;
  prenom: string;
  nom: string;
  date_naissance: string;
  sexe: "F" | "M" | "X";
  profil: "enfant" | "jeune" | "adulte";
  cours: string | null;
  stages: string[];
  tennis_sante: boolean;
  adhesion: number;
  cours_montant: number;
  stages_montant: number;
  tennis_sante_montant: number;
}

export default async function PreinscriptionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: preins, error: errP } = await supabase
    .from("preinscriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (errP || !preins) return notFound();

  const { data: membres } = await supabase
    .from("preinscription_membres")
    .select("*")
    .eq("preinscription_id", id)
    .order("date_naissance", { ascending: true });

  return (
    <div className="container-page py-12 max-w-3xl">
      <Link href="/admin" className="text-sm text-court underline mb-6 inline-block">
        ← Retour à la liste
      </Link>

      <header className="mb-8">
        <p className="font-display uppercase tracking-tight text-court text-sm mb-1">
          Préinscription · {preins.saison}
        </p>
        <h1 className="text-3xl">{preins.email}</h1>
        <p className="text-sm text-ink/60 mt-1">
          Reçue le {new Date(preins.created_at).toLocaleString("fr-FR")}
        </p>
      </header>

      <section className="card-paper mb-6">
        <h2 className="text-xl mb-4">Coordonnées</h2>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-ink/60">Téléphone</dt>
          <dd>{preins.telephone}</dd>
          <dt className="text-ink/60">Ville</dt>
          <dd>{preins.code_postal} {preins.ville}</dd>
          {preins.adresse && (
            <>
              <dt className="text-ink/60">Adresse</dt>
              <dd>{preins.adresse}</dd>
            </>
          )}
          <dt className="text-ink/60">Type</dt>
          <dd>{preins.type_inscription === "famille" ? "Famille" : "Solo"}</dd>
          {preins.situation_sociale && (
            <>
              <dt className="text-ink/60">Tarif social</dt>
              <dd>Oui (justificatif à demander)</dd>
            </>
          )}
        </dl>
      </section>

      <section className="card-paper mb-6">
        <h2 className="text-xl mb-4">Membres ({membres?.length ?? 0})</h2>
        <ul className="space-y-3">
          {(membres as MembreRow[] | null)?.map((m) => (
            <li key={m.id} className="border-b border-paper-dark pb-3 last:border-0">
              <p className="font-medium">{m.prenom} {m.nom}</p>
              <p className="text-sm text-ink/60">
                {m.profil} · né(e) {new Date(m.date_naissance).toLocaleDateString("fr-FR")} · {m.sexe}
              </p>
              <p className="text-sm mt-1">
                Adhésion {m.adhesion} €
                {m.cours_montant > 0 && ` · Cours ${m.cours} ${m.cours_montant} €`}
                {m.stages_montant > 0 && ` · Stages ${m.stages_montant} €`}
                {m.tennis_sante && ` · Tennis Santé ${m.tennis_sante_montant} €`}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-paper mb-6 bg-ball/20 border-ball">
        <h2 className="text-xl mb-4">Total</h2>
        <p className="text-3xl font-display text-court">{preins.total_calcule} €</p>
        {preins.remise_montant > 0 && (
          <p className="text-sm text-ink/70 mt-2">
            Remise {preins.remise_type === "famille" ? "famille (−20 %)" : "sociale (−10 %)"} :
            −{preins.remise_montant} € sur la part adhésion
          </p>
        )}
      </section>

      <section className="card-paper">
        <h2 className="text-xl mb-4">Statut</h2>
        <p className="text-sm">
          Actuellement : <strong>{preins.statut}</strong>
        </p>
        <p className="text-xs text-ink/50 mt-4 italic">
          TODO P1 — actions admin (valider, marquer payé, refuser) avec mise à jour du statut.
        </p>
      </section>
    </div>
  );
}
