import Image from "next/image";

interface InstallCardProps {
  img: string;
  alt: string;
  title: string;
  desc: string;
  tags: string[];
  extra?: React.ReactNode;
}

const INSTALLS: InstallCardProps[] = [
  {
    img: "/images/tennis-match-jeune.jpg",
    alt: "Match de tennis jeunes sur les courts du TCD",
    title: "4 Courts de Tennis",
    desc: "2 courts en béton poreux (rénovés en 2015) et 2 courts en résine, tous éclairés et en extérieur.",
    tags: ["Béton poreux × 2", "Résine × 2", "Éclairage"],
  },
  {
    img: "/images/padel-action-babolat.jpg",
    alt: "Action sur piste de padel",
    title: "2 Pistes de Padel",
    desc: "Pistes PHOENIX et CONSERVATEUR en gazon synthétique, éclairées. Tournois P25 à P2000 autorisés.",
    tags: ["Gazon synthétique", "Éclairage", "⭐ 4.3/5"],
    extra: (
      <a
        href="https://padelslot.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-bleu text-blanc font-bold text-[15px] rounded-card transition-all hover:-translate-y-0.5 hover:shadow-tcd-lg"
      >
        🏸 Trouver des partenaires →
      </a>
    ),
  },
  {
    img: "/images/equipe-club-region.jpg",
    alt: "Équipe du club au club house",
    title: "Club House",
    desc: "Bar, cuisine, terrasse avec barbecue, salle de jeux, TV, Wi-Fi. Le lieu de vie du club après vos matchs.",
    tags: ["Bar", "Terrasse", "BBQ", "Wi-Fi"],
  },
];

export function Installations() {
  return (
    <section id="installations" className="py-14 sm:py-16 px-5 sm:px-8 bg-blanc">
      <div className="max-w-container mx-auto">
        <div className="section-label">Nos installations</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold -tracking-[1.5px] leading-tight mb-4 text-noir">
          Un complexe <em className="text-bleu">complet</em>
        </h2>
        <p className="text-base sm:text-[17px] text-gris-700 leading-relaxed max-w-xl mb-8">
          Au cœur du complexe sportif de Jossols, profitez d&apos;installations
          modernes et éclairées, accessibles toute l&apos;année.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {INSTALLS.map((i) => (
            <article
              key={i.title}
              className="bg-blanc rounded-card-lg overflow-hidden border border-gris-200 transition-all hover:shadow-tcd-lg hover:-translate-y-1 group"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={i.img}
                  alt={i.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"
                />
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold mb-2 -tracking-[0.3px]">
                  {i.title}
                </h3>
                <p className="text-sm text-gris-700 leading-relaxed mb-4">
                  {i.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {i.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-medium px-3 py-1 rounded-md bg-gris-100 text-gris-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {i.extra}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
