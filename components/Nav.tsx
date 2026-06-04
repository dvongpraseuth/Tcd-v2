import Link from "next/link";

const LIENS = [
  { href: "/le-club", label: "Le club" },
  { href: "/tennis", label: "Tennis" },
  { href: "/padel", label: "Padel" },
  { href: "/ecole", label: "École" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-paper-dark">
      <nav className="container-page flex items-center justify-between h-16">
        <Link
          href="/"
          className="font-display uppercase tracking-tight text-xl text-court no-underline"
        >
          TC&nbsp;Davézieux
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {LIENS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-ink/80 hover:text-court no-underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/inscription" className="btn-primary text-sm py-2 px-4">
              Préinscription
            </Link>
          </li>
        </ul>

        {/* TODO P1 : burger mobile — pour P0 on garde le CTA visible */}
        <div className="md:hidden">
          <Link href="/inscription" className="btn-primary text-sm py-2 px-4">
            Inscription
          </Link>
        </div>
      </nav>
    </header>
  );
}
