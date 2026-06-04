import Link from "next/link";

export function Footer() {
  const saison = process.env.NEXT_PUBLIC_SAISON ?? "2026-2027";
  const email = process.env.NEXT_PUBLIC_CLUB_EMAIL ?? "contact@tc-davezieux.fr";

  return (
    <footer className="bg-ink text-paper mt-24 py-12">
      <div className="container-page grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display uppercase tracking-tight text-xl mb-2">
            Tennis Club Davézieux
          </p>
          <p className="text-sm text-paper/70">
            Saison {saison} — tennis, padel et école de tennis à Davézieux (07).
          </p>
        </div>

        <div>
          <p className="font-display uppercase tracking-tight text-sm mb-3 text-ball">
            Navigation
          </p>
          <ul className="space-y-1 text-sm text-paper/80">
            <li><Link href="/inscription" className="hover:text-ball no-underline">Préinscription</Link></li>
            <li><Link href="/tarifs" className="hover:text-ball no-underline">Tarifs</Link></li>
            <li><Link href="/le-club" className="hover:text-ball no-underline">Le club</Link></li>
            <li><Link href="/contact" className="hover:text-ball no-underline">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display uppercase tracking-tight text-sm mb-3 text-ball">
            Contact
          </p>
          <p className="text-sm text-paper/80">
            <a href={`mailto:${email}`} className="text-paper hover:text-ball">
              {email}
            </a>
          </p>
        </div>
      </div>

      <div className="container-page mt-10 pt-6 border-t border-paper/10 text-xs text-paper/50 flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Tennis Club Davézieux</p>
        <p>Site refondu en {new Date().getFullYear()} — Next.js + Supabase</p>
      </div>
    </footer>
  );
}
