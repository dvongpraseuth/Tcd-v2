"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Identifiants invalides");
      setPending(false);
      return;
    }
    // next vient de searchParams (string libre) — on cast en Route après validation basique
    const safeNext = (next.startsWith("/") ? next : "/admin") as Route;
    router.push(safeNext);
    router.refresh();
  }

  return (
    <div className="container-page py-20 max-w-md">
      <h1 className="text-3xl mb-6">Connexion admin</h1>
      <form onSubmit={submit} className="card-paper space-y-4">
        <label className="block">
          <span className="block text-xs font-medium uppercase tracking-tight text-ink/60 mb-1">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-paper-dark rounded-lg bg-white"
          />
        </label>
        <label className="block">
          <span className="block text-xs font-medium uppercase tracking-tight text-ink/60 mb-1">
            Mot de passe
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-paper-dark rounded-lg bg-white"
          />
        </label>
        {error && <p className="text-flag text-sm">{error}</p>}
        <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-50">
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
      <p className="text-xs text-ink/50 mt-4 text-center">
        Accès réservé au bureau du club. Compte créé par le webmestre.
      </p>
    </div>
  );
}
