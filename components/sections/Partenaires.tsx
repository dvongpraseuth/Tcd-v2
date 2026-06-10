import Image from "next/image";

const PARTENAIRES = [
  {
    href: "http://www.intersport.fr/",
    src: "/images/logo-intersport.png",
    alt: "Intersport Davézieux",
    height: 48,
  },
  {
    href: "http://www.babolat.fr/",
    src: "/images/logo-babolat.png",
    alt: "Babolat",
    height: 48,
  },
  {
    href: "http://www.fft.fr",
    src: "/images/logo-fft.png",
    alt: "Fédération Française de Tennis",
    height: 56,
  },
  {
    href: "http://www.ligue.fft.fr/dauphine-savoie/",
    src: "/images/logo-ligue.png",
    alt: "Ligue Dauphiné Savoie",
    height: 56,
  },
  {
    href: "http://www.comite.fft.fr/drome-ardeche/",
    src: "/images/logo-comite.png",
    alt: "Comité Drôme Ardèche",
    height: 56,
  },
  {
    href: "#",
    src: "/images/logo-idclub-ligue.png",
    alt: "iDClub Ligue AURA Tennis",
    height: 48,
  },
] as const;

export function Partenaires() {
  return (
    <section className="py-16 px-8 bg-blanc">
      <div className="max-w-container mx-auto">
        <div className="section-label">Nos partenaires</div>
        <h2 className="text-3xl font-extrabold -tracking-[1.5px] leading-tight mb-10 text-noir">
          Ils nous <em className="text-bleu">soutiennent</em>
        </h2>
        <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap py-6">
          {PARTENAIRES.map((p) => (
            <a
              key={p.alt}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={140}
                height={p.height}
                className="object-contain"
                style={{ height: p.height, width: "auto" }}
              />
            </a>
          ))}
          <a
            href="http://www.davezieux.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-70 hover:opacity-100 transition-opacity text-base font-bold text-noir -tracking-[0.3px]"
          >
            MAIRIE DE DAVÉZIEUX
          </a>
        </div>
      </div>
    </section>
  );
}
