import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase côté navigateur (Client Components uniquement).
 * Utilisé pour les interactions auth (login admin) — pas pour les écritures
 * publiques (celles-ci passent par la route /api/preinscriptions).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
