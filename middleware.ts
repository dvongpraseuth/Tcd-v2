import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (err) {
    // Garde-fou : ne JAMAIS faire crasher le middleware.
    // Mieux vaut laisser passer la requête que renvoyer un 500 sur toute la page.
    console.error("[middleware] error caught:", err);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    /**
     * Match toutes les requêtes SAUF :
     * - _next/static (assets)
     * - _next/image (optim)
     * - favicon, sitemap, robots
     * - fichiers statiques avec extension
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
