"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { calculerDevis } from "@/lib/compute-totals";
import { coursEligibles } from "@/lib/eligibilite-cours";
import { ALL_STAGES } from "@/config/tarifs";
import type { Sexe, CoursKey, StageKey } from "@/config/tarifs";
import { preinscriptionSchema, type PreinscriptionInput } from "./schema";

type Step =
  | "intro"
  | "membres"
  | "cours"
  | "situations"
  | "coordonnees"
  | "recap"
  | "confirmation";

interface MembreState {
  nom: string;
  prenom: string;
  dateNaissance: string; // YYYY-MM-DD
  sexe: Sexe;
  cours: CoursKey | null;
  stages: StageKey[];
  tennisSante: boolean;
}

const membreVide = (): MembreState => ({
  nom: "",
  prenom: "",
  dateNaissance: "",
  sexe: "M",
  cours: null,
  stages: [],
  tennisSante: false,
});

export default function InscriptionForm() {
  const [step, setStep] = useState<Step>("intro");
  const [typeInscription, setTypeInscription] = useState<"solo" | "famille">("solo");
  const [membres, setMembres] = useState<MembreState[]>([membreVide()]);
  const [situationSociale, setSituationSociale] = useState(false);
  const [coords, setCoords] = useState({
    email: "",
    telephone: "",
    codePostal: "",
    ville: "",
    adresse: "",
  });
  const [communes, setCommunes] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  /* ---------- Devis live ---------- */
  const devisLive = useMemo(() => {
    const membresValides = membres.filter((m) => m.dateNaissance);
    if (membresValides.length === 0) return null;
    return calculerDevis({
      membres: membresValides.map((m) => ({
        dateNaissance: new Date(m.dateNaissance),
        sexe: m.sexe,
        cours: m.cours,
        stages: m.stages,
        tennisSante: m.tennisSante,
      })),
      situationSociale,
    });
  }, [membres, situationSociale]);

  /* ---------- Helpers membres ---------- */
  const updateMembre = (idx: number, patch: Partial<MembreState>) => {
    setMembres((m) => m.map((x, i) => (i === idx ? { ...x, ...patch } : x)));
  };
  const ajouterMembre = () => setMembres((m) => [...m, membreVide()]);
  const retirerMembre = (idx: number) =>
    setMembres((m) => (m.length === 1 ? m : m.filter((_, i) => i !== idx)));

  /* ---------- Code postal → ville ---------- */
  const lookupCommune = async (cp: string) => {
    if (!/^\d{5}$/.test(cp)) return;
    try {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?codePostal=${cp}&fields=nom&limit=10`,
      );
      if (!res.ok) return;
      const data = (await res.json()) as Array<{ nom: string }>;
      setCommunes(data.map((c) => c.nom));
      if (data.length === 1) setCoords((c) => ({ ...c, ville: data[0].nom }));
    } catch {
      // Repli silencieux — l'utilisateur saisira la ville manuellement
    }
  };

  /* ---------- Soumission ---------- */
  const submit = async () => {
    setSubmitting(true);
    setErrors({});

    const payload: PreinscriptionInput = {
      typeInscription,
      membres: membres.map((m) => ({
        nom: m.nom,
        prenom: m.prenom,
        dateNaissance: m.dateNaissance,
        sexe: m.sexe,
        cours: m.cours,
        stages: m.stages,
        tennisSante: m.tennisSante,
      })),
      situationSociale,
      email: coords.email,
      telephone: coords.telephone,
      codePostal: coords.codePostal,
      ville: coords.ville,
      adresse: coords.adresse || undefined,
    };

    const parse = preinscriptionSchema.safeParse(payload);
    if (!parse.success) {
      const errs: Record<string, string> = {};
      parse.error.issues.forEach((iss) => {
        errs[iss.path.join(".")] = iss.message;
      });
      setErrors(errs);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/preinscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parse.data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erreur serveur" }));
        setErrors({ _form: err.error ?? "Erreur lors de l'envoi" });
        setSubmitting(false);
        return;
      }
      const data = (await res.json()) as { id: string };
      setReferenceId(data.id);
      setStep("confirmation");
    } catch {
      setErrors({ _form: "Connexion impossible — réessayez" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ============================================================
   * Rendu par étape
   * ============================================================ */

  return (
    <div className="container-page py-12 max-w-3xl">
      <StepIndicator step={step} />

      {step === "intro" && (
        <Section titre="Bienvenue au TC Davézieux">
          <p className="mb-6 text-ink/70">
            Préinscription saison {process.env.NEXT_PUBLIC_SAISON ?? "2026-2027"}.
            En ~5 minutes, vous décrivez votre famille, vous choisissez vos cours
            et le club valide votre dossier.
          </p>
          <fieldset className="space-y-3 mb-6">
            <legend className="font-display uppercase tracking-tight text-sm text-court mb-2">
              Vous préinscrivez
            </legend>
            {(["solo", "famille"] as const).map((t) => (
              <label key={t} className="flex items-center gap-3 cursor-pointer card-paper">
                <input
                  type="radio"
                  name="type"
                  value={t}
                  checked={typeInscription === t}
                  onChange={() => {
                    setTypeInscription(t);
                    if (t === "solo") setMembres([membreVide()]);
                  }}
                />
                <span className="font-medium">
                  {t === "solo" ? "Un seul membre (moi)" : "Plusieurs membres (famille)"}
                </span>
              </label>
            ))}
          </fieldset>
          <NextButton onClick={() => setStep("membres")}>Continuer</NextButton>
        </Section>
      )}

      {step === "membres" && (
        <Section titre={typeInscription === "famille" ? "Les membres du foyer" : "Vos informations"}>
          <div className="space-y-6 mb-6">
            {membres.map((m, idx) => (
              <fieldset key={idx} className="card-paper">
                <legend className="font-display uppercase tracking-tight text-sm text-court mb-3">
                  Membre {idx + 1}
                  {membres.length > 1 && (
                    <button
                      type="button"
                      onClick={() => retirerMembre(idx)}
                      className="ml-3 text-xs text-flag underline"
                    >
                      retirer
                    </button>
                  )}
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Prénom">
                    <input
                      className="input"
                      value={m.prenom}
                      onChange={(e) => updateMembre(idx, { prenom: e.target.value })}
                    />
                  </Field>
                  <Field label="Nom">
                    <input
                      className="input"
                      value={m.nom}
                      onChange={(e) => updateMembre(idx, { nom: e.target.value })}
                    />
                  </Field>
                  <Field label="Date de naissance">
                    <input
                      type="date"
                      className="input"
                      value={m.dateNaissance}
                      onChange={(e) => updateMembre(idx, { dateNaissance: e.target.value })}
                    />
                  </Field>
                  <Field label="Sexe">
                    <select
                      className="input"
                      value={m.sexe}
                      onChange={(e) => updateMembre(idx, { sexe: e.target.value as Sexe })}
                    >
                      <option value="F">Féminin</option>
                      <option value="M">Masculin</option>
                      <option value="X">Non précisé</option>
                    </select>
                  </Field>
                </div>
              </fieldset>
            ))}
            {typeInscription === "famille" && membres.length < 8 && (
              <button type="button" onClick={ajouterMembre} className="btn-secondary text-sm">
                + Ajouter un membre
              </button>
            )}
          </div>
          <Navigation onBack={() => setStep("intro")} onNext={() => setStep("cours")} />
        </Section>
      )}

      {step === "cours" && (
        <Section titre="Cours et stages">
          <p className="mb-4 text-ink/70 text-sm">
            Le club propose des cours selon l'âge et le sexe. Choisissez 1 cours
            max par membre (optionnel). Les stages sont indépendants.
          </p>
          <div className="space-y-4 mb-6">
            {membres.map((m, idx) => {
              const elig = m.dateNaissance
                ? coursEligibles(
                    { dateNaissance: new Date(m.dateNaissance), sexe: m.sexe },
                    2026,
                  )
                : [];
              return (
                <fieldset key={idx} className="card-paper">
                  <legend className="font-display uppercase tracking-tight text-sm text-court mb-3">
                    {m.prenom || `Membre ${idx + 1}`}
                  </legend>
                  {elig.length === 0 ? (
                    <p className="text-sm text-ink/60 italic">
                      Aucun cours éligible (ou date de naissance manquante).
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`cours-${idx}`}
                          checked={m.cours === null}
                          onChange={() => updateMembre(idx, { cours: null })}
                        />
                        <span>Pas de cours</span>
                      </label>
                      {elig.map((c) => (
                        <label key={c.key} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`cours-${idx}`}
                            checked={m.cours === c.key}
                            onChange={() => updateMembre(idx, { cours: c.key })}
                          />
                          <span>
                            {c.label} <span className="text-court font-medium">+{c.prix} €</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {ALL_STAGES.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-paper-dark">
                      <p className="text-sm font-medium mb-2">Stages vacances</p>
                      <div className="space-y-1">
                        {ALL_STAGES.map((s) => (
                          <label key={s.key} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={m.stages.includes(s.key)}
                              onChange={(e) =>
                                updateMembre(idx, {
                                  stages: e.target.checked
                                    ? [...m.stages, s.key]
                                    : m.stages.filter((x) => x !== s.key),
                                })
                              }
                            />
                            <span className="text-sm">
                              {s.label} <span className="text-court">+{s.prix} €</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </fieldset>
              );
            })}
          </div>
          <Navigation onBack={() => setStep("membres")} onNext={() => setStep("situations")} />
        </Section>
      )}

      {step === "situations" && (
        <Section titre="Situations particulières">
          <label className="flex items-start gap-3 card-paper mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={situationSociale}
              onChange={(e) => setSituationSociale(e.target.checked)}
              className="mt-1"
            />
            <div>
              <p className="font-medium">Tarif social (−10 % sur l'adhésion)</p>
              <p className="text-sm text-ink/60">
                Au moins un membre du foyer est étudiant, demandeur d'emploi, ou bénéficiaire du RSA.
                Justificatif demandé à la validation.
              </p>
            </div>
          </label>
          <p className="text-sm text-ink/60 italic mb-6">
            La remise famille (−20 % dès 2 membres) est appliquée automatiquement
            le cas échéant. Les remises ne sont pas cumulables : on garde la plus avantageuse.
          </p>
          <Navigation onBack={() => setStep("cours")} onNext={() => setStep("coordonnees")} />
        </Section>
      )}

      {step === "coordonnees" && (
        <Section titre="Vos coordonnées">
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            <Field label="Email" error={errors["email"]}>
              <input
                type="email"
                className="input"
                value={coords.email}
                onChange={(e) => setCoords((c) => ({ ...c, email: e.target.value }))}
              />
            </Field>
            <Field label="Téléphone" error={errors["telephone"]}>
              <input
                type="tel"
                className="input"
                value={coords.telephone}
                onChange={(e) => setCoords((c) => ({ ...c, telephone: e.target.value }))}
              />
            </Field>
            <Field label="Code postal" error={errors["codePostal"]}>
              <input
                className="input"
                value={coords.codePostal}
                onChange={(e) => {
                  const cp = e.target.value;
                  setCoords((c) => ({ ...c, codePostal: cp }));
                  if (/^\d{5}$/.test(cp)) lookupCommune(cp);
                }}
              />
            </Field>
            <Field label="Ville" error={errors["ville"]}>
              {communes.length > 1 ? (
                <select
                  className="input"
                  value={coords.ville}
                  onChange={(e) => setCoords((c) => ({ ...c, ville: e.target.value }))}
                >
                  <option value="">— choisir —</option>
                  {communes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="input"
                  value={coords.ville}
                  onChange={(e) => setCoords((c) => ({ ...c, ville: e.target.value }))}
                />
              )}
            </Field>
            <Field label="Adresse (optionnel)" className="sm:col-span-2">
              <input
                className="input"
                value={coords.adresse}
                onChange={(e) => setCoords((c) => ({ ...c, adresse: e.target.value }))}
              />
            </Field>
          </div>
          <Navigation onBack={() => setStep("situations")} onNext={() => setStep("recap")} />
        </Section>
      )}

      {step === "recap" && devisLive && (
        <Section titre="Récapitulatif">
          <div className="card-paper mb-6">
            <p className="font-display uppercase tracking-tight text-sm text-court mb-3">
              Membres du foyer
            </p>
            <ul className="space-y-2 mb-4">
              {membres.map((m, idx) => {
                const d = devisLive.membres[idx];
                return (
                  <li key={idx} className="text-sm flex justify-between border-b border-paper-dark pb-2">
                    <span>
                      <strong>{m.prenom} {m.nom}</strong> — {d.profil}
                      {m.cours && ` · cours`}
                    </span>
                    <span className="font-medium">{d.sousTotal} €</span>
                  </li>
                );
              })}
            </ul>
            <dl className="space-y-1 text-sm">
              <Line k="Adhésion foyer" v={`${devisLive.adhesionBrute} €`} />
              {devisLive.coursTotal > 0 && <Line k="Cours" v={`+${devisLive.coursTotal} €`} />}
              {devisLive.stagesTotal > 0 && <Line k="Stages" v={`+${devisLive.stagesTotal} €`} />}
              {devisLive.remise.montant > 0 && (
                <Line k={devisLive.remise.label!} v={`−${devisLive.remise.montant} €`} />
              )}
            </dl>
            <p className="mt-4 pt-3 border-t border-paper-dark flex justify-between text-xl font-display">
              <span>Total</span>
              <span className="text-court">{devisLive.total} €</span>
            </p>
          </div>
          {errors._form && <p className="text-flag text-sm mb-4">{errors._form}</p>}
          <Navigation
            onBack={() => setStep("coordonnees")}
            onNext={submit}
            nextLabel={submitting ? "Envoi…" : "Confirmer la préinscription"}
            nextDisabled={submitting}
          />
        </Section>
      )}

      {step === "confirmation" && referenceId && (
        <Section titre="Préinscription enregistrée">
          <div className="card-paper text-center">
            <p className="text-5xl mb-4">🎾</p>
            <p className="mb-4">
              Votre référence : <strong className="font-mono">{referenceId.slice(0, 8)}</strong>
            </p>
            <p className="text-sm text-ink/70 mb-6">
              Le bureau du club va valider votre dossier sous 48-72h ouvrées.
              Vous recevrez un email avec les instructions de paiement (Ten'Up FFT
              pour CB en ligne, ou chèque/espèces sur place).
            </p>
            <Link href="/" className="btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </Section>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--paper-dark);
          border-radius: 0.5rem;
          background: white;
          font-size: 0.95rem;
        }
        .input:focus {
          outline: 2px solid var(--court);
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function StepIndicator({ step }: { step: Step }) {
  const steps: Step[] = ["intro", "membres", "cours", "situations", "coordonnees", "recap"];
  const idx = steps.indexOf(step);
  if (idx < 0) return null;
  return (
    <div className="flex gap-1 mb-6">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1 flex-1 rounded ${i <= idx ? "bg-court" : "bg-paper-dark"}`}
        />
      ))}
    </div>
  );
}

function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h1 className="text-3xl sm:text-4xl mb-6">{titre}</h1>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="block text-xs font-medium uppercase tracking-tight text-ink/60 mb-1">
        {label}
      </span>
      {children}
      {error && <span className="text-flag text-xs mt-1 block">{error}</span>}
    </label>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt>{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function NextButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn-primary">
      {children}
    </button>
  );
}

function Navigation({
  onBack,
  onNext,
  nextLabel = "Continuer",
  nextDisabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <button type="button" onClick={onBack} className="btn-secondary">
        Retour
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="btn-primary disabled:opacity-50"
      >
        {nextLabel}
      </button>
    </div>
  );
}
