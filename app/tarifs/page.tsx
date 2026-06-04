import Link from "next/link";
import {
  SAISON,
  ADHESION,
  ALL_COURS,
  ALL_STAGES,
  TENNIS_SANTE,
  REMISES,
} from "@/config/tarifs";

export const metadata = {
  title: "Tarifs",
  description: `Tarifs de l'adhésion, des cours, des stages et du tennis santé — saison ${SAISON}.`,
};

export default function TarifsPage() {
  return (
    <div className="container-page py-16">
      <header className="mb-12">
        <p className="font-display uppercase tracking-tight text-court text-sm mb-2">
          Saison {SAISON}
        </p>
        <h1 className="text-4xl sm:text-5xl mb-4">Tarifs</h1>
        <p className="text-lg text-ink/70 max-w-2xl">
          Une adhésion par membre + un supplément cours optionnel. Les remises
          famille et sociale s'appliquent sur la part adhésion uniquement.
        </p>
      </header>

      {/* Adhésion */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl mb-6">Adhésion club</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            titre="Adulte"
            sousTitre="18 ans et +"
            prix={ADHESION.adulte}
          />
          <Card
            titre="Jeune"
            sousTitre="6 à 17 ans"
            prix={ADHESION.jeune}
          />
          <Card
            titre="Enfant"
            sousTitre="moins de 6 ans"
            prix={ADHESION.enfant}
          />
        </div>
      </section>

      {/* Cours */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl mb-6">Cours collectifs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ALL_COURS.map((c) => (
            <Card
              key={c.key}
              titre={c.label}
              sousTitre={eligibiliteLabel(c.eligibilite)}
              prix={c.prix}
            />
          ))}
        </div>
      </section>

      {/* Stages */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl mb-6">Stages vacances</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ALL_STAGES.map((s) => (
            <Card
              key={s.key}
              titre={s.label}
              sousTitre={eligibiliteLabel(s.eligibilite)}
              prix={s.prix}
            />
          ))}
        </div>
      </section>

      {/* Tennis Santé */}
      <section className="mb-12">
        <h2 className="text-2xl sm:text-3xl mb-6">Tennis Santé</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            titre={TENNIS_SANTE.label}
            sousTitre="Sur prescription médicale"
            prix={TENNIS_SANTE.prix}
          />
        </div>
      </section>

      {/* Remises */}
      <section className="mb-12 card-paper bg-ball/30 border-ball">
        <h2 className="text-2xl sm:text-3xl mb-4">Remises</h2>
        <ul className="space-y-3 text-base">
          <li>
            <strong className="font-display uppercase tracking-tight text-court">
              {REMISES.famille.label}
            </strong>{" "}
            : −{Math.round(REMISES.famille.taux * 100)} % sur la part adhésion
            dès {REMISES.famille.seuilMembres} membres dans le foyer.
          </li>
          <li>
            <strong className="font-display uppercase tracking-tight text-court">
              {REMISES.sociale.label}
            </strong>{" "}
            : −{Math.round(REMISES.sociale.taux * 100)} % sur la part adhésion
            (étudiant, demandeur d'emploi, RSA — justificatif demandé).
          </li>
        </ul>
        <p className="text-sm text-ink/70 mt-4 italic">
          Les remises ne sont pas cumulables — la plus avantageuse est
          automatiquement appliquée.
        </p>
      </section>

      <div className="text-center pt-8 border-t border-paper-dark">
        <Link href="/inscription" className="btn-primary">
          Préinscrire ma famille
        </Link>
      </div>
    </div>
  );
}

interface CardProps {
  titre: string;
  sousTitre?: string;
  prix: number;
}

function Card({ titre, sousTitre, prix }: CardProps) {
  return (
    <div className="card-paper flex items-center justify-between gap-4">
      <div>
        <p className="font-display uppercase tracking-tight text-base">{titre}</p>
        {sousTitre && (
          <p className="text-sm text-ink/60 mt-1">{sousTitre}</p>
        )}
      </div>
      <p className="font-display text-3xl text-court whitespace-nowrap">
        {prix}&nbsp;€
      </p>
    </div>
  );
}

function eligibiliteLabel(e: {
  ageMin?: number;
  ageMax?: number;
  sexe?: "F" | "M" | "X";
}): string {
  const parts: string[] = [];
  if (e.ageMin !== undefined && e.ageMax !== undefined) {
    parts.push(`${e.ageMin}-${e.ageMax} ans`);
  } else if (e.ageMin !== undefined) {
    parts.push(`${e.ageMin} ans et +`);
  }
  if (e.sexe === "F") parts.push("féminin");
  return parts.join(" · ");
}
