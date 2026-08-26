"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const SECTIONS = [
  { href: "/", label: "Accueil" },
  { href: "/#installations", label: "Installations" },
  { href: "/#ecole", label: "École" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/#equipe", label: "Équipe" },
  { href: "/#contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gris-200 transition-shadow ${
        scrolled ? "shadow-tcd-sm" : ""
      }`}
    >
      <nav className="max-w-container mx-auto flex items-center justify-between px-8 h-[72px]">
        <Link href="/" className="flex items-center gap-3.5 text-bleu">
          <Image
            src="/logo-tcd.jpg"
            alt="TC Davézieux"
            width={48}
            height={48}
            className="rounded-full object-cover"
            priority
          />
          {/* 26/08 (David, « ça bave en haut ») : sur mobile le badge cassait
              en deux lignes à côté du nom (« TENNIS & » / « PADEL » décalés).
              whitespace-nowrap sur le nom ET le badge, et le badge ne
              s'affiche qu'à partir de sm — sur petit écran le logo + le nom
              suffisent, le titre de l'onglet dit déjà le reste. */}
          <span className="flex items-center whitespace-nowrap font-bold text-[18px] -tracking-tight">
            TC Davézieux
            <span className="hidden sm:inline-block whitespace-nowrap text-jaune bg-bleu px-2 py-0.5 rounded text-[11px] tracking-[1px] ml-2 font-bold uppercase">
              Tennis &amp; Padel
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-2">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="text-sm font-medium text-gris-700 px-4 py-2 rounded-lg transition-colors hover:text-bleu hover:bg-gris-100"
              >
                {s.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/inscription"
              className="bg-bleu text-blanc font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:bg-bleu-fonce hover:-translate-y-0.5 hover:shadow-tcd-lg"
            >
              Préinscription →
            </Link>
          </li>
        </ul>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-noir my-1.5" />
          <span className="block w-6 h-0.5 bg-noir my-1.5" />
          <span className="block w-6 h-0.5 bg-noir my-1.5" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-blanc border-t border-gris-200">
          <ul className="flex flex-col p-4 gap-1">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className="block px-4 py-3 text-gris-700 hover:bg-gris-100 rounded-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/inscription"
                className="block px-4 py-3 bg-bleu text-blanc rounded-lg font-semibold text-center mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Préinscription →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
