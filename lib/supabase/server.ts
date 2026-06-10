import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieSetItem = { name: string; value: string; options?: CookieOptions };

/**
 * Client Supabase côté serveur (Server Components, Route Handlers, Server Actions).
 *
 * Convention TCD :
 * - getUser() pour l'identité (jamais getSession() côté server)
 * - RLS toujours active — pas de service_role ici
 * - service_role réservé aux routes /api/admin/* (autre client à part)
 *
 * Lève une erreur explicite si les env vars manquent (au lieu du `!` non-null
 * assertion qui crashait silencieusement le middleware en preview).
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase env vars manquantes : configurez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sur Vercel.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieSetItem[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Appelé depuis un Server Component → ignoré, le middleware s'en charge
        }
      },
    },
  });
}
