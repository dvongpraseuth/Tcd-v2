interface EcoleCardProps {
  icon: string;
  title: string;
  age: string;
  desc: string;
}

const CARDS: EcoleCardProps[] = [
  {
    icon: "🌟",
    title: "Mini-Tennis",
    age: "4 – 6 ans",
    desc: "25 séances d'1h le mercredi. Découverte ludique du tennis. À partir de 85 €.",
  },
  {
    icon: "🚀",
    title: "Galaxie Tennis",
    age: "6 – 13 ans",
    desc: "25-30 séances d'1h30. Progression par niveaux (blanc → rouge). À partir de 120 €.",
  },
  {
    icon: "🎯",
    title: "Ados & Adultes",
    age: "14 ans et +",
    desc: "25-30 séances d'1h15. Cours dames et hommes. À partir de 130 €.",
  },
  {
    icon: "🏆",
    title: "Pôle Compétition",
    age: "6 – 18 ans",
    desc: "Programme spécifique avec entraînement hebdomadaire supplémentaire. À partir de 195 €.",
  },
  {
    icon: "♿",
    title: "Tennis Adapté",
    age: "En partenariat avec l'IME ENVOL",
    desc: "Depuis 2015, séances le mercredi matin au gymnase de Jossols. Encadrement par Alexandre Begot.",
  },
  {
    icon: "💚",
    title: "Tennis & Padel Santé",
    age: "Label FFT Tennis Santé",
    desc: "Programme Cœur de Douceur. 15-20 séances d'1h. 50 €. Référents : P.A. Breuil, C. Mercier.",
  },
];

export function Ecole() {
  return (
    <section id="ecole" className="py-14 sm:py-16 px-5 sm:px-8 bg-bleu relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(242, 201, 76, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-container mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-jaune mb-4">
          <span className="w-6 h-0.5 bg-jaune" />
          École de tennis
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold -tracking-[1.5px] leading-tight mb-4 text-blanc">
          Apprendre, progresser,
          <br />
          <em className="text-jaune">s&apos;amuser</em>
        </h2>
        <p className="text-base sm:text-[17px] text-white/70 leading-relaxed max-w-xl mb-8">
          Du mini-tennis au pôle compétition, notre équipe pédagogique
          accompagne chaque joueur selon son âge et ses objectifs.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <article
              key={c.title}
              className="bg-white/[0.06] backdrop-blur-sm border border-white/10 rounded-card p-6 transition-all hover:bg-white/[0.12] hover:-translate-y-1"
            >
              <div className="text-3xl mb-4" aria-hidden>
                {c.icon}
              </div>
              <h3 className="text-[17px] font-bold text-blanc mb-2">
                {c.title}
              </h3>
              <div className="text-[13px] text-jaune font-semibold mb-2">
                {c.age}
              </div>
              <p className="text-[13px] text-white/55 leading-relaxed">
                {c.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
