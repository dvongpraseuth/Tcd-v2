export function PadelSlotCTA() {
  return (
    <section
      className="py-16 px-6"
      style={{
        background:
          "linear-gradient(135deg, #1E2A6E 0%, #2E3B8C 50%, #3D4FA6 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-12 justify-center">
        <div className="flex-1 min-w-[280px] text-blanc">
          <div className="text-sm font-semibold text-jaune uppercase tracking-[2px] mb-3">
            Nouveau
          </div>
          <h2 className="font-serif italic text-3xl font-bold leading-[1.2] mb-4 text-blanc">
            Trouvez des partenaires
            <br />
            pour un <span className="text-jaune">padel</span>
          </h2>
          <p className="text-base opacity-85 leading-relaxed mb-2">
            Fini les groupes WhatsApp ! Avec PadelSlot, organisez vos parties
            en quelques clics : créez un match, trouvez des joueurs, discutez
            et jouez.
          </p>
          <ul className="list-none p-0 mt-5">
            {[
              "Gratuit pour les membres du club",
              "Organisez une partie en 30 secondes",
              "Chat intégré entre joueurs",
              "Gestion des désistements automatique",
            ].map((item) => (
              <li
                key={item}
                className="py-1.5 text-[15px] text-white/90 flex items-center gap-2.5"
              >
                <span className="text-jaune font-bold" aria-hidden>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-shrink-0 text-center">
          <a
            href="https://padelslot.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-jaune text-bleu-fonce font-extrabold text-[17px] rounded-card transition-all hover:-translate-y-1 shadow-tcd-jaune"
          >
            🏸 Rejoindre PadelSlot →
          </a>
          <p className="text-white/50 text-[13px] mt-3">
            Accessible sur mobile et ordinateur
          </p>
        </div>
      </div>
    </section>
  );
}
