"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ADHESIONS,
  formuleKeyFor,
  type Categorie,
  type FormuleKey,
  type CoursKey,
} from "@/config/tarifs";
import { routerInscription } from "@/config/inscriptions";
import { calculerDevis, type MembreInput } from "@/lib/compute-totals";
import { coursEligibles } from "@/lib/eligibilite-cours";

/**
 * ============================================================
 * FUNNEL D'INSCRIPTION TCD — saison 2026-2027
 *
 * Porté du prototype Claude Desktop
 * `_handoff-2026-06-09/formulaire-inscription-2026-27.html`
 * vers React Client Component.
 *
 * Architecture :
 * - useState (mode, membres[], pos, coords)
 * - Liste d'écrans dérivée du mode (seul / famille)
 * - Calcul live du devis via lib/compute-totals
 * - Routage final : simple → deep-link Ten'Up | complexe → fiche Supabase
 * ============================================================
 */

type Mode = "seul" | "famille" | null;
type ScreenType =
  | "mode"
  | "count"
  | "cat"
  | "act"
  | "cours"
  | "red"
  | "recap"
  | "cart"
  | "coords";
interface Screen {
  t: ScreenType;
  m?: number;
}

interface Coords {
  email: string;
  telephone: string;
  codePostal: string;
  ville: string;
  adresse: string;
  notes: string;
}

const emptyMembre = (): MembreInput => ({
  categorie: "adulte",
  sexe: "H",
  activite: "tennis",
  exterieur: false,
  cours: [],
  remiseSocialeDemandee: false,
});

const emptyCoords = (): Coords => ({
  email: "",
  telephone: "",
  codePostal: "",
  ville: "",
  adresse: "",
  notes: "",
});

export default function InscriptionForm() {
  const [mode, setMode] = useState<Mode>(null);
  const [count, setCount] = useState<number | null>(null);
  const [membres, setMembres] = useState<MembreInput[]>([]);
  const [pos, setPos] = useState(0);
  const [coords, setCoords] = useState<Coords>(emptyCoords());
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<
    | { kind: "idle" }
    | { kind: "ok"; total: number }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const screens: Screen[] = useMemo(() => {
    if (mode === "seul") {
      return [
        { t: "mode" },
        { t: "cat", m: 0 },
        { t: "act", m: 0 },
        { t: "cours", m: 0 },
        { t: "red", m: 0 },
        { t: "recap" },
      ];
    }
    if (mode === "famille") {
      if (!count) return [{ t: "mode" }, { t: "count" }];
      const a: Screen[] = [{ t: "mode" }, { t: "count" }];
      for (let i = 0; i < count; i++) {
        a.push({ t: "cat", m: i }, { t: "act", m: i }, { t: "cours", m: i });
      }
      a.push({ t: "cart" });
      return a;
    }
    return [{ t: "mode" }];
  }, [mode, count]);

  const currentPos = Math.min(pos, screens.length - 1);
  const screen = screens[currentPos];
  const onCoordsScreen = pos >= screens.length;

  const devis = useMemo(() => {
    if (membres.length === 0) return null;
    return calculerDevis({
      mode: mode === "famille" ? "famille" : "seul",
      membres,
    });
  }, [mode, membres]);

  const routage = useMemo(() => {
    if (!devis || membres.length === 0) return null;
    const m0 = membres[0];
    if (!m0.categorie || !m0.activite) return null;
    const fkey = formuleKeyFor(m0.categorie, m0.activite, m0.exterieur);
    return routerInscription({
      nombreMembres: membres.length,
      remisesSocialeDemandees: membres.some((m) => m.remiseSocialeDemandee),
      formuleKey: fkey,
      aChoisiCours: membres.some((m) => m.cours.length > 0),
      tenupId: ADHESIONS[fkey].tenupId,
    });
  }, [devis, membres]);

  const updateMembre = (i: number, patch: Partial<MembreInput>) => {
    setMembres((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)),
    );
  };

  const canNext = (): boolean => {
    if (onCoordsScreen) return canNextCoords(coords);
    if (!screen) return false;
    if (screen.t === "mode") return mode !== null;
    if (screen.t === "count") return count !== null;
    if (screen.t === "cat") {
      const m = membres[screen.m!];
      return !!m?.categorie && !!m?.sexe;
    }
    if (screen.t === "act") return !!membres[screen.m!]?.activite;
    return true;
  };

  const next = () => {
    if (canNext() && currentPos < screens.length - 1) {
      setPos(currentPos + 1);
      window.scrollTo(0, 0);
    }
  };
  const prev = () => {
    if (onCoordsScreen) {
      setPos(screens.length - 1);
      return;
    }
    if (currentPos > 0) {
      setPos(currentPos - 1);
      window.scrollTo(0, 0);
    }
  };

  const selectMode = (m: Mode) => {
    setMode(m);
    if (m === "seul") {
      setCount(1);
      setMembres([emptyMembre()]);
    } else {
      setCount(null);
      setMembres([]);
    }
    setPos(1);
  };

  const selectCount = (n: number) => {
    setCount(n);
    setMembres((prev) => {
      const arr = [...prev];
      while (arr.length < n) arr.push(emptyMembre());
      arr.length = n;
      return arr;
    });
    setPos(2);
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitState({ kind: "idle" });
    try {
      const res = await fetch("/api/preinscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: mode === "famille" ? "famille" : "seul",
          membres: membres.map((m) => ({
            nom: "À compléter",
            prenom: "À compléter",
            dateNaissance: "2000-01-01",
            categorie: m.categorie,
            sexe: m.sexe,
            activite: m.activite,
            exterieur: m.exterieur,
            cours: m.cours,
            remiseSocialeDemandee: m.remiseSocialeDemandee,
          })),
          email: coords.email,
          telephone: coords.telephone,
          codePostal: coords.codePostal,
          ville: coords.ville,
          adresse: coords.adresse || undefined,
          notesLibres: coords.notes || undefined,
          routageInitial: "complexe",
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setSubmitState({ kind: "ok", total: data.total });
    } catch (e) {
      setSubmitState({
        kind: "error",
        message: e instanceof Error ? e.message : "Erreur inconnue",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitState.kind === "ok") {
    return (
      <div className="container-page py-16 max-w-xl">
        <div className="rounded-card bg-blanc border-2 border-bleu p-8 text-center">
          <h1 className="text-3xl mb-4 text-bleu">
            Préinscription reçue&nbsp;!
          </h1>
          <p className="text-lg mb-6">
            Votre dossier a bien été transmis au bureau du club.
            <br />
            Un membre vous recontacte sous 48 h pour finaliser
            l&apos;inscription.
          </p>
          <p className="font-sans text-4xl text-bleu mb-2">
            {submitState.total.toFixed(2)} €
          </p>
          <p className="text-sm text-gris-700 mb-6">
            Estimation — montant final confirmé par le club selon vos
            justificatifs.
          </p>
          <Link href="/" className="btn-secondary">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8 sm:py-12 max-w-2xl">
      <header className="mb-8">
        <p className="font-sans uppercase tracking-tight text-bleu text-sm mb-1">
          Saison 2026-2027
        </p>
        <h1 className="text-3xl sm:text-4xl">Préinscription guidée</h1>
      </header>

      <div className="flex gap-1 mb-6" aria-hidden>
        {screens.map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i <= currentPos ? "bg-bleu" : "bg-gris-100"
            }`}
          />
        ))}
        {onCoordsScreen && <div className="flex-1 h-1.5 rounded-full bg-bleu" />}
      </div>

      <div className="rounded-card bg-blanc border border-gris-200 p-6 sm:p-8 min-h-[300px]">
        {onCoordsScreen ? (
          <ScreenCoords
            coords={coords}
            onChange={setCoords}
            onSubmit={submit}
            submitting={submitting}
            error={
              submitState.kind === "error" ? submitState.message : null
            }
          />
        ) : (
          <>
            {screen?.t === "mode" && (
              <ScreenMode mode={mode} onSelect={selectMode} />
            )}
            {screen?.t === "count" && (
              <ScreenCount count={count} onSelect={selectCount} />
            )}
            {screen?.t === "cat" && screen.m !== undefined && (
              <ScreenCat
                mIndex={screen.m}
                total={membres.length}
                membre={membres[screen.m]}
                onPatch={(patch) => updateMembre(screen.m!, patch)}
              />
            )}
            {screen?.t === "act" && screen.m !== undefined && (
              <ScreenAct
                mIndex={screen.m}
                total={membres.length}
                membre={membres[screen.m]}
                onPatch={(patch) => updateMembre(screen.m!, patch)}
              />
            )}
            {screen?.t === "cours" && screen.m !== undefined && (
              <ScreenCours
                mIndex={screen.m}
                total={membres.length}
                membre={membres[screen.m]}
                onPatch={(patch) => updateMembre(screen.m!, patch)}
              />
            )}
            {screen?.t === "red" && screen.m !== undefined && (
              <ScreenRed
                membre={membres[screen.m]}
                onPatch={(patch) => updateMembre(screen.m!, patch)}
              />
            )}
            {(screen?.t === "recap" || screen?.t === "cart") && devis && (
              <ScreenRecap
                devis={devis}
                routage={routage}
                onProceedSimple={() => {
                  if (routage?.kind === "simple") {
                    window.open(routage.tenupUrl, "_blank");
                  }
                }}
                onProceedComplexe={() => setPos(screens.length)}
              />
            )}
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="text-sm text-gris-700">
          Total estimé
          <span className="block font-sans text-2xl text-bleu">
            {devis ? `${devis.total.toFixed(2)} €` : "—"}
          </span>
        </div>
        <div className="flex gap-2">
          {(currentPos > 0 || onCoordsScreen) && (
            <button
              onClick={prev}
              className="btn-secondary text-sm py-2 px-4"
            >
              Précédent
            </button>
          )}
          {!onCoordsScreen && currentPos < screens.length - 1 && (
            <button
              onClick={next}
              disabled={!canNext()}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ÉCRANS ──────────────────────────────────────────────────

function ScreenMode({
  mode,
  onSelect,
}: {
  mode: Mode;
  onSelect: (m: Mode) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl text-bleu mb-2">
        Vous vous inscrivez seul ou en famille&nbsp;?
      </h2>
      <p className="text-sm text-gris-700 mb-6">
        La famille (2 membres et +) ouvre droit à -20% sur les adhésions.
      </p>
      <div className="grid gap-3">
        <Choice selected={mode === "seul"} onClick={() => onSelect("seul")}>
          <strong>Inscription seule</strong>
        </Choice>
        <Choice
          selected={mode === "famille"}
          onClick={() => onSelect("famille")}
        >
          <strong>Famille</strong>
          <span className="block text-sm text-gris-700">
            Plusieurs membres · -20% appliqué automatiquement
          </span>
        </Choice>
      </div>
    </div>
  );
}

function ScreenCount({
  count,
  onSelect,
}: {
  count: number | null;
  onSelect: (n: number) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl text-bleu mb-2">Combien de personnes&nbsp;?</h2>
      <p className="text-sm text-gris-700 mb-6">
        On enregistrera chaque membre l&apos;un après l&apos;autre.
      </p>
      <div className="grid grid-cols-5 gap-2">
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => onSelect(n)}
            className={`py-4 rounded-card border-2 font-sans text-xl transition-colors ${
              count === n
                ? "bg-bleu text-blanc border-bleu"
                : "bg-blanc border-gris-200 hover:border-bleu"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScreenCat({
  mIndex,
  total,
  membre,
  onPatch,
}: {
  mIndex: number;
  total: number;
  membre: MembreInput;
  onPatch: (p: Partial<MembreInput>) => void;
}) {
  return (
    <div>
      {total > 1 && (
        <p className="text-xs font-sans uppercase tracking-tight text-bleu mb-2">
          Membre {mIndex + 1} sur {total}
        </p>
      )}
      <h2 className="text-2xl text-bleu mb-2">Catégorie d&apos;âge</h2>
      <p className="text-sm text-gris-700 mb-6">
        Le genre sert à proposer les bons cours (Dame / Homme).
      </p>
      <div className="grid gap-3 mb-6">
        {(
          [
            ["adulte", "Adulte", "18 ans et +"],
            ["jeune", "Jeune", "7 à 17 ans"],
            ["enfant", "Enfant", "moins de 6 ans"],
          ] as [Categorie, string, string][]
        ).map(([v, t, d]) => (
          <Choice
            key={v}
            selected={membre.categorie === v}
            onClick={() =>
              onPatch({
                categorie: v,
                activite: v === "enfant" ? "tennis" : membre.activite,
                exterieur: false,
                cours: [],
              })
            }
          >
            <strong>{t}</strong>
            <span className="block text-sm text-gris-700">{d}</span>
          </Choice>
        ))}
      </div>
      <p className="text-sm font-medium mb-3">Genre</p>
      <div className="grid grid-cols-2 gap-3">
        <Choice
          selected={membre.sexe === "F"}
          onClick={() => onPatch({ sexe: "F", cours: [] })}
        >
          <strong>Femme</strong>
        </Choice>
        <Choice
          selected={membre.sexe === "H"}
          onClick={() => onPatch({ sexe: "H", cours: [] })}
        >
          <strong>Homme</strong>
        </Choice>
      </div>
    </div>
  );
}

function ScreenAct({
  mIndex,
  total,
  membre,
  onPatch,
}: {
  mIndex: number;
  total: number;
  membre: MembreInput;
  onPatch: (p: Partial<MembreInput>) => void;
}) {
  if (membre.categorie === "enfant") {
    const fk = ADHESIONS.enfant_tennis;
    return (
      <div>
        {total > 1 && (
          <p className="text-xs font-sans uppercase tracking-tight text-bleu mb-2">
            Membre {mIndex + 1} sur {total}
          </p>
        )}
        <h2 className="text-2xl text-bleu mb-2">Adhésion enfant</h2>
        <p className="text-sm text-gris-700 mb-6">
          Pour les moins de 6 ans, seule l&apos;offre Tennis est disponible.
        </p>
        <Choice selected onClick={() => onPatch({ activite: "tennis" })}>
          <div className="flex items-baseline justify-between">
            <span>
              <strong>Tennis</strong>
              <span className="block text-sm text-gris-700">
                licence + assurance + accès courts
              </span>
            </span>
            <span className="font-sans text-xl text-bleu">
              {fk.total} €
            </span>
          </div>
        </Choice>
      </div>
    );
  }

  const cat = membre.categorie;
  const tennisKey = `${cat}_tennis` as FormuleKey;
  const padelKey = `${cat}_padel` as FormuleKey;
  const deuxKey = `${cat}_deux` as FormuleKey;

  return (
    <div>
      {total > 1 && (
        <p className="text-xs font-sans uppercase tracking-tight text-bleu mb-2">
          Membre {mIndex + 1} sur {total}
        </p>
      )}
      <h2 className="text-2xl text-bleu mb-2">Adhésion + licence</h2>
      <p className="text-sm text-gris-700 mb-6">
        Tout compris : licence FFT + assurance + accès aux courts.
      </p>
      <div className="grid gap-3">
        <ActChoice
          selected={membre.activite === "tennis" && !membre.exterieur}
          label="Tennis"
          price={ADHESIONS[tennisKey].total}
          onClick={() => onPatch({ activite: "tennis", exterieur: false })}
        />
        <ActChoice
          selected={membre.activite === "padel" && !membre.exterieur}
          label="Padel"
          price={ADHESIONS[padelKey].total}
          onClick={() => onPatch({ activite: "padel", exterieur: false })}
        />
        <ActChoice
          selected={membre.activite === "deux"}
          label="Tennis & Padel"
          sublabel="la formule la plus avantageuse"
          price={ADHESIONS[deuxKey].total}
          onClick={() => onPatch({ activite: "deux", exterieur: false })}
          feature
        />
      </div>
      {membre.categorie === "adulte" && membre.activite === "padel" && (
        <div className="mt-4">
          <Choice
            selected={membre.exterieur}
            onClick={() =>
              onPatch({
                exterieur: !membre.exterieur,
                remiseSocialeDemandee: false,
              })
            }
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={membre.exterieur} />
              <span>
                <strong>
                  Je suis déjà licencié dans un autre club
                </strong>
                <span className="block text-sm text-gris-700">
                  Padel seul · tarif extérieur 170 € · sans réduction
                </span>
              </span>
            </div>
          </Choice>
        </div>
      )}
    </div>
  );
}

function ScreenCours({
  mIndex,
  total,
  membre,
  onPatch,
}: {
  mIndex: number;
  total: number;
  membre: MembreInput;
  onPatch: (p: Partial<MembreInput>) => void;
}) {
  const eligibles = coursEligibles(membre.categorie, membre.sexe);

  const toggleCours = (key: CoursKey) => {
    const has = membre.cours.includes(key);
    onPatch({
      cours: has
        ? membre.cours.filter((k) => k !== key)
        : [...membre.cours, key],
    });
  };

  return (
    <div>
      {total > 1 && (
        <p className="text-xs font-sans uppercase tracking-tight text-bleu mb-2">
          Membre {mIndex + 1} sur {total}
        </p>
      )}
      <h2 className="text-2xl text-bleu mb-2">Cours & enseignement</h2>
      <p className="text-sm text-gris-700 mb-6">
        Optionnel — plusieurs choix possibles. Les cours ne sont pas remisés.
      </p>
      <div className="grid gap-3">
        <Choice
          selected={membre.cours.length === 0}
          onClick={() => onPatch({ cours: [] })}
        >
          <div className="flex items-center gap-3">
            <Checkbox checked={membre.cours.length === 0} />
            <strong>Sans enseignement</strong>
          </div>
        </Choice>
        {eligibles.map((c) => {
          const on = membre.cours.includes(c.key as CoursKey);
          return (
            <Choice
              key={c.key}
              selected={on}
              onClick={() => toggleCours(c.key as CoursKey)}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex items-center gap-3">
                  <Checkbox checked={on} />
                  <span>
                    <strong>{c.label}</strong>
                    <span className="block text-xs text-gris-700">
                      {c.description}
                    </span>
                  </span>
                </span>
                <span className="font-sans text-base text-bleu whitespace-nowrap">
                  {c.prix} €
                </span>
              </div>
            </Choice>
          );
        })}
      </div>
    </div>
  );
}

function ScreenRed({
  membre,
  onPatch,
}: {
  membre: MembreInput;
  onPatch: (p: Partial<MembreInput>) => void;
}) {
  const formuleKey = formuleKeyFor(
    membre.categorie,
    membre.activite,
    membre.exterieur,
  );
  const blocked = !ADHESIONS[formuleKey].remiseApplicable;

  if (blocked) {
    return (
      <div>
        <h2 className="text-2xl text-bleu mb-2">Réductions</h2>
        <p className="text-sm text-gris-700 mb-6">
          Le tarif licencié extérieur n&apos;ouvre pas droit aux réductions.
        </p>
        <p className="text-sm italic">Aucune réduction applicable.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl text-bleu mb-2">Réductions applicables</h2>
      <p className="text-sm text-gris-700 mb-6">
        Sur justificatif. S&apos;applique à la part adhésion club.
      </p>
      <Choice
        selected={membre.remiseSocialeDemandee}
        onClick={() =>
          onPatch({ remiseSocialeDemandee: !membre.remiseSocialeDemandee })
        }
      >
        <div className="flex items-center gap-3">
          <Checkbox checked={membre.remiseSocialeDemandee} />
          <strong>-10% Couple / Étudiant / Chômeur</strong>
        </div>
      </Choice>
      <p className="text-xs text-gris-700 mt-4">
        La réduction -20% «&nbsp;famille&nbsp;» n&apos;est pas disponible pour
        une inscription seule.
      </p>
    </div>
  );
}

function ScreenRecap({
  devis,
  routage,
  onProceedSimple,
  onProceedComplexe,
}: {
  devis: NonNullable<ReturnType<typeof calculerDevis>>;
  routage: ReturnType<typeof routerInscription> | null;
  onProceedSimple: () => void;
  onProceedComplexe: () => void;
}) {
  return (
    <div>
      <h2 className="text-2xl text-bleu mb-2">Récapitulatif</h2>
      <p className="text-sm text-gris-700 mb-6">
        Estimation.{" "}
        {routage?.kind === "simple"
          ? "L'inscription et le paiement se font sur Ten'Up."
          : "Un membre du bureau vous recontactera pour finaliser."}
      </p>

      {devis.membres.map((m, i) => (
        <div
          key={i}
          className="mb-4 rounded-card border border-gris-200 overflow-hidden"
        >
          <div className="bg-gris-100 px-4 py-2 font-sans uppercase tracking-tight text-sm">
            Membre {i + 1} · {m.formuleLabel}
          </div>
          <div className="p-4 text-sm space-y-1">
            <Row
              label={`Licence FFT (${m.licence} €) + Adhésion (${m.adhesion} €)`}
            >
              {(m.licence + m.adhesion).toFixed(2)} €
            </Row>
            {m.composantesRemise.famille > 0 && (
              <Row label="-20% famille" highlight>
                - {(m.adhesion * m.composantesRemise.famille).toFixed(2)} €
              </Row>
            )}
            {m.composantesRemise.sociale > 0 && (
              <Row label="-10% étudiant / chômeur" highlight>
                - {(m.adhesion * m.composantesRemise.sociale).toFixed(2)} €
              </Row>
            )}
            {m.coursDetail.map((c) => (
              <Row key={c.key} label={c.label}>
                {c.prix.toFixed(2)} €
              </Row>
            ))}
            <Row label={`Sous-total membre ${i + 1}`} subtotal>
              {m.sousTotal.toFixed(2)} €
            </Row>
          </div>
        </div>
      ))}

      <div className="bg-bleu text-blanc rounded-card p-4 flex justify-between items-baseline mb-4">
        <span className="font-sans uppercase tracking-tight">Total</span>
        <span className="font-sans text-2xl text-jaune">
          {devis.total.toFixed(2)} €
        </span>
      </div>

      {routage?.kind === "simple" ? (
        <button
          onClick={onProceedSimple}
          className="btn-primary w-full bg-jaune text-noir hover:bg-jaune"
        >
          Finaliser sur Ten&apos;Up →
        </button>
      ) : (
        <>
          <p className="text-sm text-gris-700 mb-3">
            {routage?.raison ??
              "Cette inscription nécessite un traitement par le club."}
          </p>
          <button onClick={onProceedComplexe} className="btn-primary w-full">
            Continuer (mes coordonnées)
          </button>
        </>
      )}
    </div>
  );
}

function ScreenCoords({
  coords,
  onChange,
  onSubmit,
  submitting,
  error,
}: {
  coords: Coords;
  onChange: (c: Coords) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const set = (k: keyof Coords, v: string) => onChange({ ...coords, [k]: v });
  const valid = canNextCoords(coords);
  return (
    <div>
      <h2 className="text-2xl text-bleu mb-2">Vos coordonnées</h2>
      <p className="text-sm text-gris-700 mb-6">
        Pour que le bureau vous recontacte. Vos données restent au club.
      </p>
      <div className="grid gap-3">
        <Field
          label="Email"
          type="email"
          value={coords.email}
          onChange={(v) => set("email", v)}
        />
        <Field
          label="Téléphone"
          type="tel"
          value={coords.telephone}
          onChange={(v) => set("telephone", v)}
        />
        <div className="grid grid-cols-3 gap-3">
          <Field
            label="Code postal"
            value={coords.codePostal}
            onChange={(v) => set("codePostal", v)}
            inputMode="numeric"
            maxLength={5}
          />
          <div className="col-span-2">
            <Field
              label="Ville"
              value={coords.ville}
              onChange={(v) => set("ville", v)}
            />
          </div>
        </div>
        <Field
          label="Adresse (optionnel)"
          value={coords.adresse}
          onChange={(v) => set("adresse", v)}
        />
        <label className="block">
          <span className="text-sm font-medium block mb-1">
            Notes / situation particulière (optionnel)
          </span>
          <textarea
            value={coords.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={3}
            className="w-full rounded-card border border-gris-200 bg-blanc px-3 py-2 text-sm"
          />
        </label>
      </div>
      {error && (
        <p className="text-sm text-red-700 mt-4 p-3 bg-red-50 rounded-card">
          {error}
        </p>
      )}
      <button
        onClick={onSubmit}
        disabled={!valid || submitting}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Envoi en cours…" : "Envoyer ma préinscription"}
      </button>
    </div>
  );
}

// ── PETITS COMPOSANTS ───────────────────────────────────────

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left w-full rounded-card border-2 px-4 py-3 transition-colors ${
        selected
          ? "border-bleu bg-bleu/5"
          : "border-gris-200 bg-blanc hover:border-bleu-clair"
      }`}
    >
      {children}
    </button>
  );
}

function ActChoice({
  selected,
  label,
  sublabel,
  price,
  onClick,
  feature = false,
}: {
  selected: boolean;
  label: string;
  sublabel?: string;
  price: number;
  onClick: () => void;
  feature?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-card border-2 px-4 py-3 transition-colors flex items-baseline justify-between gap-3 ${
        selected
          ? feature
            ? "border-jaune bg-jaune/10"
            : "border-bleu bg-bleu/5"
          : "border-gris-200 bg-blanc hover:border-bleu-clair"
      }`}
    >
      <span>
        <strong>{label}</strong>
        {sublabel && (
          <span className="block text-xs text-gris-700">{sublabel}</span>
        )}
      </span>
      <span className="font-sans text-xl text-bleu">{price} €</span>
    </button>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-blanc text-xs font-bold ${
        checked ? "bg-bleu border-bleu" : "bg-blanc border-gris-200"
      }`}
    >
      {checked && "✓"}
    </span>
  );
}

function Row({
  label,
  children,
  highlight = false,
  subtotal = false,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
  subtotal?: boolean;
}) {
  return (
    <div
      className={`flex justify-between py-1 ${
        subtotal
          ? "border-t border-gris-200 mt-2 pt-2 font-sans uppercase tracking-tight text-bleu"
          : highlight
            ? "text-bleu-fonce font-medium"
            : ""
      }`}
    >
      <span>{label}</span>
      <span>{children}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "numeric" | "text" | "tel" | "email";
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium block mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
        maxLength={maxLength}
        className="w-full rounded-card border border-gris-200 bg-blanc px-3 py-2 text-sm"
      />
    </label>
  );
}

function canNextCoords(c: Coords): boolean {
  return (
    c.email.length > 3 &&
    c.email.includes("@") &&
    c.telephone.length >= 8 &&
    /^\d{5}$/.test(c.codePostal) &&
    c.ville.length > 0
  );
}
