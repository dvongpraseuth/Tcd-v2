import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = { title: "Tableau de bord admin" };
export const dynamic = "force-dynamic";

interface PreinscriptionRow {
  id: string;
  email: string;
  ville: string;
  type_inscription: "solo" | "famille";
  statut: "en_attente" | "valide" | "paye" | "refuse";
  total_calcule: number;
  saison: string;
  created_at: string;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  const { data: preinscriptions, error } = await supabase
    .from("preinscriptions")
    .select("id, email, ville, type_inscription, statut, total_calcule, saison, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="container-page py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-display uppercase tracking-tight text-court text-sm mb-1">
            Admin · {user.user?.email}
          </p>
          <h1 className="text-3xl">Préinscriptions</h1>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button className="btn-secondary text-sm">Déconnexion</button>
        </form>
      </div>

      {error && <p className="text-flag mb-4">Erreur chargement : {error.message}</p>}

      {(!preinscriptions || preinscriptions.length === 0) && (
        <div className="card-paper text-center py-12">
          <p className="text-ink/60">Aucune préinscription pour l'instant.</p>
        </div>
      )}

      {preinscriptions && preinscriptions.length > 0 && (
        <div className="card-paper overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-paper-dark">
              <tr className="text-left">
                <Th>Date</Th>
                <Th>Email</Th>
                <Th>Ville</Th>
                <Th>Type</Th>
                <Th>Total</Th>
                <Th>Statut</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {(preinscriptions as PreinscriptionRow[]).map((p) => (
                <tr key={p.id} className="border-b border-paper-dark/50">
                  <Td>{new Date(p.created_at).toLocaleDateString("fr-FR")}</Td>
                  <Td>{p.email}</Td>
                  <Td>{p.ville}</Td>
                  <Td>{p.type_inscription}</Td>
                  <Td className="font-medium">{p.total_calcule} €</Td>
                  <Td>
                    <StatutBadge statut={p.statut} />
                  </Td>
                  <Td>
                    <Link
                      href={`/admin/preinscriptions/${p.id}`}
                      className="text-court underline text-xs"
                    >
                      Détail
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-3 py-2 font-display uppercase tracking-tight text-xs text-ink/70">
      {children}
    </th>
  );
}

function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className ?? ""}`}>{children}</td>;
}

function StatutBadge({ statut }: { statut: PreinscriptionRow["statut"] }) {
  const styles: Record<PreinscriptionRow["statut"], string> = {
    en_attente: "bg-flag/30 text-ink",
    valide: "bg-ball/40 text-ink",
    paye: "bg-court text-paper",
    refuse: "bg-paper-dark text-ink/60",
  };
  const labels: Record<PreinscriptionRow["statut"], string> = {
    en_attente: "En attente",
    valide: "Validé",
    paye: "Payé",
    refuse: "Refusé",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${styles[statut]}`}>
      {labels[statut]}
    </span>
  );
}
