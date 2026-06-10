import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieSetItem = { name: string; value: string; options?: CookieOptions };

/**
 * Rafraîchit la session auth côté serveur entre 2 navigations.
 * Appelé depuis middleware.ts racine.
 *
 * Protège /admin/* et /api/admin/* — redirige vers /login si pas auth.
 *
 * Si les env vars Supabase ne sont pas définies (déploiement preview sans
 * config, dev sans .env.local), on no-op et on bloque la zone admin par
 * sécurité (redirige vers /login qui affichera l'erreur de connexion).
 */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;
  const isAdminZone = path.startsWith("/admin") || path.startsWith("/api/admin");

  // Pas de Supabase configuré → on laisse passer le public et on redirige
  // l'admin vers /login (qui affichera "non configuré" si besoin).
  if (!supabaseUrl || !supabaseKey) {
    if (isAdminZone) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieSetItem[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Convention : getUser() (jamais getSession()) côté serveur
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminZone && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
