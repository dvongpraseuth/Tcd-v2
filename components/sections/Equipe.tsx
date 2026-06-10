interface MembreProps {
  initiales: string;
  nom: string;
  role: string;
  diplome: string;
  gradient: string;
}

const EQUIPE: MembreProps[] = [
  {
    initiales: "AB",
    nom: "Alexandre Begot",
    role: "Directeur Sportif",
    diplome:
      "Brevet d'État · Moniteur de Padel — Responsable école de tennis & compétition",
    gradient: "linear-gradient(135deg, #2E3B8C, #3D4FA6)",
  },
  {
    initiales: "VB",
    nom: "Vincent Bonvalot",
    role: "Enseignant tous publics",
    diplome: "Cours enfants et adultes — Suivi personnalisé",
    gradient: "linear-gradient(135deg, #E0A820, #F2C94C)",
  },
  {
    initiales: "SR",
    nom: "Samuel Reynaud",
    role: "Assistant Moniteur",
    diplome: "Initiateur Fédéral — Encadrement école de tennis",
    gradient: "linear-gradient(135deg, #495057, #343A40)",
  },
];

export function Equipe() {
  return (
    <section id="equipe" className="py-24 px-5 sm:px-8 bg-gris-50">
      <div className="max-w-container mx-auto">
        <div className="section-label">L&apos;équipe</div>
        <h2 className="text-4xl sm:text-5xl font-extrabold -tracking-[1.5px] leading-tight mb-4 text-noir">
          Nos <em className="text-bleu">enseignants</em>
        </h2>
        <p className="text-base sm:text-[17px] text-gris-700 leading-relaxed max-w-xl mb-12">
          Une équipe pédagogique passionnée et diplômée pour vous accompagner à
          chaque étape.
        </p>

        <div className="grid gap-5 md:grid-cols-3">
          {EQUIPE.map((m) => (
            <article
              key={m.nom}
              className="bg-blanc rounded-card-lg p-9 border border-gris-200 text-center transition-all hover:shadow-tcd-lg hover:-translate-y-1"
            >
              <div
                className="rounded-full mx-auto mb-5 flex items-center justify-center text-4xl font-extrabold text-blanc"
                style={{
                  background: m.gradient,
                  width: 88,
                  height: 88,
                }}
              >
                {m.initiales}
              </div>
              <h3 className="text-lg font-bold mb-1 -tracking-[0.2px]">
                {m.nom}
              </h3>
              <div className="text-[13px] text-bleu font-semibold mb-3">
                {m.role}
              </div>
              <p className="text-xs text-gris-500 leading-relaxed">
                {m.diplome}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
