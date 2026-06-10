import Link from "next/link";
import {
  SAISON,
  ADHESIONS,
  ALL_COURS,
  REMISES,
  type FormuleKey,
} from "@/config/tarifs";
import { CLUB_CONTACT, TENUP_OFFRES_URL } from "@/config/inscriptions";
import { OffreCard } from "@/components/OffreCard";
import { CoursCard } from "@/components/CoursCard";

export const metadata = {
  title: "Offres & tarifs",
  description: `Toutes les formules d'adhésion, cours, stages et tarifs du club pour la saison ${SAISON}.`,
};

// Regroupements pour la grille (préserve l'ordre logique de présentation)
const ADHESIONS_PRINCIPALES: FormuleKey[] = [
  "adulte_tennis",
  "adulte_padel",
  "adulte_deux",
  "jeune_tennis",
  "jeune_padel",
  "jeune_deux",
  "enfant_tennis",
];
const ADHESIONS_SPECIALES: FormuleKey[] = [
  "exterieur_padel",
  "adulte_accompagnant",
];

const FEATURE_KEYS: Set<FormuleKey> = new Set(["adulte_deux", "jeune_deux"]);

export default function TarifsPage() {
  const coursTenup = ALL_COURS.filter((c) => c.surTenup);
  const coursClub = ALL_COURS.filter((c) => !c.surTenup);

  return (
    <>
      {/* HERO */}
      <section className="bg-bleu text-blanc">
        <div className="container-page py-16 sm:py-20">
          <p className="font-sans uppercase tracking-tight text-jaune text-sm mb-4">
            Saison {SAISON}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Toutes les offres du club
          </h1>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl mb-6">
            Adhésion, cours, stages — tout est inclus sur Ten&apos;Up ou
            disponible auprès du bureau. Choisissez votre formule, cliquez sur
            «&nbsp;S&apos;inscrire&nbsp;» et finalisez en ligne ou au club.
          </p>
          <p className="text-sm text-white/70">
            Tarif tout compris : licence FFT + assurance + accès aux courts avec
            réservation gratuite.
          </p>
        </div>
      </section>

      {/* ADHÉSIONS PRINCIPALES */}
      <section className="container-page py-16">
        <header className="mb-10">
          <p className="font-sans uppercase tracking-tight text-bleu text-sm mb-2">
            Étape 1
          </p>
          <h2 className="text-3xl sm:text-4xl mb-3">L&apos;adhésion au club</h2>
          <p className="text-base text-gris-700 max-w-2xl">
            La base : licence FFT + assurance + accès aux installations.
            Choisissez votre catégorie (adulte / jeune / enfant) et votre
            discipline (tennis, padel ou les deux).
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ADHESIONS_PRINCIPALES.map((key) => (
            <OffreCard
              key={key}
              formule={ADHESIONS[key]}
              feature={FEATURE_KEYS.has(key)}
            />
          ))}
        </div>

        {/* Offres spéciales */}
        <h3 className="text-xl mt-12 mb-6 text-noir/80">Cas particuliers</h3>
        <div className="grid gap-6 sm:grid-cols-2">
          {ADHESIONS_SPECIALES.map((key) => (
            <OffreCard key={key} formule={ADHESIONS[key]} />
          ))}
        </div>
      </section>

      {/* RÉDUCTIONS */}
      <section className="bg-gris-100 py-14">
        <div className="container-page">
          <header className="mb-8">
            <p className="font-sans uppercase tracking-tight text-bleu text-sm mb-2">
              Bon à savoir
            </p>
            <h2 className="text-3xl sm:text-4xl mb-3">Réductions</h2>
            <p className="text-base text-gris-700 max-w-2xl">
              Les remises s&apos;appliquent sur la part adhésion club uniquement
              (jamais sur la licence FFT ni sur les cours). Cumulables sur
              justificatif.
            </p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
            <div className="rounded-card bg-blanc border border-gris-200 p-6">
              <p className="font-sans text-5xl text-bleu mb-2">-20%</p>
              <p className="font-medium mb-1">{REMISES.famille.label}</p>
              <p className="text-sm text-gris-700">
                Appliqué automatiquement dès 2 membres du foyer adhérents.
              </p>
            </div>
            <div className="rounded-card bg-blanc border border-gris-200 p-6">
              <p className="font-sans text-5xl text-bleu mb-2">-10%</p>
              <p className="font-medium mb-1">{REMISES.social.label}</p>
              <p className="text-sm text-gris-700">
                Sur présentation d&apos;un justificatif (carte étudiante,
                attestation France Travail, etc.).
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-gris-700 italic">
            Pour bénéficier d&apos;une réduction, utilisez la{" "}
            <Link href="/inscription" className="font-medium text-bleu-fonce">
              préinscription guidée
            </Link>{" "}
            — le club applique la remise lors de la validation.
          </p>
        </div>
      </section>

      {/* COURS & ENSEIGNEMENT */}
      <section className="container-page py-16">
        <header className="mb-10">
          <p className="font-sans uppercase tracking-tight text-bleu text-sm mb-2">
            Étape 2 — optionnelle
          </p>
          <h2 className="text-3xl sm:text-4xl mb-3">Cours & enseignement</h2>
          <p className="text-base text-gris-700 max-w-2xl">
            En complément de l&apos;adhésion, choisissez un programme adapté à
            votre niveau. Encadré par nos moniteurs diplômés. Les cours ne sont
            pas remisables.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coursTenup.map((c) => (
            <CoursCard key={c.key} offre={c} />
          ))}
        </div>

        {/* Hors Ten'Up */}
        <h3 className="text-xl mt-12 mb-3 text-noir/80">
          Stages & programmes spécifiques
        </h3>
        <p className="text-sm text-gris-700 mb-6 max-w-2xl">
          Ces offres se réservent directement au club (téléphone ou via la
          préinscription en ligne).
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coursClub.map((c) => (
            <CoursCard key={c.key} offre={c} />
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-bleu text-blanc py-14">
        <div className="container-page text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl mb-4">
            Vous ne savez pas quelle formule choisir&nbsp;?
          </h2>
          <p className="text-white/85 mb-6">
            Notre préinscription guidée vous aide à composer la bonne offre en 5
            minutes — pour vous seul ou toute la famille.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inscription"
              className="btn-primary bg-jaune text-noir hover:bg-jaune"
            >
              Préinscription guidée
            </Link>
            <a
              href={TENUP_OFFRES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary bg-white/10 text-blanc hover:bg-white/20"
            >
              Voir sur Ten&apos;Up →
            </a>
          </div>
          <p className="mt-6 text-sm text-white/70">
            Une question&nbsp;? Appelez le {CLUB_CONTACT.telephone}
          </p>
        </div>
      </section>
    </>
  );
}
