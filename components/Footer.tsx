const FOOTER_LINKS = [
  {
    href: "https://tenup.fft.fr/club/50070493/reservations",
    label: "Ten'Up",
  },
  {
    href: "https://www.helloasso.com/associations/tennis-club-davezieux",
    label: "HelloAsso",
  },
  // P1 — pages à créer
  // { href: "/mentions-legales", label: "Mentions légales" },
  // { href: "/reglement", label: "Règlement intérieur" },
] as const;

export function Footer() {
  return (
    <footer className="bg-noir border-t border-white/10 py-10 px-8">
      <div className="max-w-container mx-auto flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="text-sm text-gris-500 text-center md:text-left">
          <strong className="text-blanc font-semibold">TC Davézieux</strong> ·
          Tennis pour tous depuis 1986
          <br />
          <small>
            Association loi 1901 · SIREN 415 164 821 · Affiliation FFT 50070493
          </small>
        </div>

        <ul className="flex gap-6 flex-wrap justify-center">
          {FOOTER_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gris-500 hover:text-jaune transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <a
            href="https://www.facebook.com/tcdavezieux.tcd"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-10 h-10 rounded-card bg-white/5 border border-white/10 flex items-center justify-center text-base hover:bg-bleu hover:border-bleu transition-colors"
          >
            <span aria-hidden>📘</span>
          </a>
          <a
            href="mailto:tcdavezieuxtennispadel@gmail.com"
            aria-label="Email"
            className="w-10 h-10 rounded-card bg-white/5 border border-white/10 flex items-center justify-center text-base hover:bg-bleu hover:border-bleu transition-colors"
          >
            <span aria-hidden>✉️</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
