import Link from "next/link";

export function DecouverteEte() {
  return (
    <section className="py-12 sm:py-14 px-5 sm:px-8 bg-jaune-pale relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] rounded-full bg-jaune/30 blur-[80px]"
      />

      <div className="max-w-container mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-bleu text-jaune text-xs font-bold uppercase tracking-[2px] px-4 py-2 rounded-full mb-5">
            ☀️ Pour vos amis cet été
          </div>
          <h2 className="text-4xl sm:text-[36px] font-extrabold -tracking-[1.5px] leading-tight mb-5 text-bleu-fonce">
            Faites-leur découvrir
            <br />
            le <em className="text-bleu">club</em>
          </h2>
          <p className="text-base sm:text-[17px] text-gris-800 leading-relaxed mb-6 max-w-xl">
            Vos amis ne sont pas encore licenciés FFT ? Pendant l&apos;été
            2027, le club proposera des offres «&nbsp;découverte&nbsp;» avec
            licence courte (Tennis 56 €, Padel 56 €, Tennis &amp; Padel 66
            €) — l&apos;occasion idéale pour leur faire goûter au club avant
            l&apos;inscription complète.
          </p>
          <p className="text-sm text-gris-700 mb-6">
            Les offres seront activées sur Ten&apos;Up dès leur ouverture. En
            attendant, parlez-en autour de vous !
          </p>
          <Link href="/inscription" className="btn-bleu">
            Parrainer un ami →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <DecouverteCard sport="Tennis" prix={56} emoji="🎾" />
          <DecouverteCard sport="Padel" prix={56} emoji="🏸" />
          <DecouverteCard sport="Combo" prix={66} emoji="🎾🏸" featured />
        </div>
      </div>
    </section>
  );
}

function DecouverteCard({
  sport,
  prix,
  emoji,
  featured = false,
}: {
  sport: string;
  prix: number;
  emoji: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-card border text-center transition-all hover:-translate-y-1 ${
        featured
          ? "bg-bleu border-bleu text-blanc shadow-tcd-lg"
          : "bg-blanc border-gris-200"
      }`}
    >
      <div className="text-3xl mb-2" aria-hidden>
        {emoji}
      </div>
      <div
        className={`text-xs uppercase font-semibold mb-1 tracking-wider ${
          featured ? "text-jaune" : "text-bleu"
        }`}
      >
        {sport}
      </div>
      <div
        className={`text-3xl font-extrabold -tracking-[1px] ${
          featured ? "text-jaune" : "text-bleu"
        }`}
      >
        {prix}€
      </div>
      <div
        className={`text-xs mt-1 ${
          featured ? "text-white/70" : "text-gris-500"
        }`}
      >
        découverte été
      </div>
    </div>
  );
}
