import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase SERVICE ROLE — serveur uniquement, jamais exposé au client.
 *
 * Pourquoi il existe (26/08/2026, panne de la préinscription en prod) :
 * la route /api/preinscriptions faisait `.insert(...).select("id")` avec le
 * client ANON. Or la RLS du schéma (0001_preinscriptions.sql) n'accorde à
 * `anon` que INSERT — pas SELECT, exprès : les préinscriptions contiennent
 * des données personnelles qu'un visiteur ne doit jamais pouvoir relire.
 * PostgREST exige une policy SELECT pour retourner la ligne insérée →
 * erreur 42501 « new row violates row-level security », donc 500 sur le
 * formulaire. La mauvaise réponse aurait été d'ouvrir SELECT à anon ; la
 * bonne est celle-ci : la route serveur, qui valide tout via zod et calcule
 * les tarifs elle-même, écrit avec la clé service.
 *
 * À n'importer QUE depuis des Route Handlers / Server Actions.
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error(
      "Supabase env vars manquantes : configurez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sur Vercel.",
    );
  }

  return createSupabaseClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
