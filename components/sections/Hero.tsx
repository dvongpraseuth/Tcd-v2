import Link from "next/link";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-bleu overflow-hidden pt-[72px]"
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(30, 42, 110, 0.92) 0%, rgba(30, 42, 110, 0.85) 50%, rgba(30, 42, 110, 0.7) 100%), radial-gradient(ellipse at 20% 80%, rgba(242, 201, 76, 0.15) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-jaune opacity-[0.06] blur-[80px] z-0"
      />

      <div className="container-page relative z-10 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-jaune/15 border border-jaune/30 text-jaune px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide mb-7">
            <span aria-hidden>🎾</span> Depuis 1986 à Davézieux
          </div>
          <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-extrabold text-blanc -tracking-[2px] leading-[1.05] mb-6">
            Tennis &amp; Padel
            <br />
            pour <em className="text-jaune">tous</em>
          </h1>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-lg mb-10 font-light">
            4 courts de tennis, 2 pistes de padel, une école labellisée et une
            équipe passionnée au cœur de l&apos;Ardèche.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://tenup.fft.fr/club/50070493/reservations"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Réservation Adhérents →
            </a>
            <Link href="/inscription" className="btn-outline">
              Préinscription saison →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 animate-fade-in-up-delay">
          <StatCard featured number="~270" label="adhérents cette saison" icon="📊" />
          <StatCard number="4" label="courts de tennis éclairés" />
          <StatCard number="2" label="pistes de padel" />
          <StatCard number="8" label="équipes en championnat" />
          <StatCard number="8h–22h" label="accès courts toute l'année" full />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  number,
  label,
  icon,
  featured = false,
  full = false,
}: {
  number: string;
  label: string;
  icon?: string;
  featured?: boolean;
  full?: boolean;
}) {
  return (
    <div
      className={`${full ? "col-span-2" : ""} ${
        featured
          ? "col-span-2 bg-jaune/10 border-jaune/20"
          : "bg-white/[0.07] border-white/10"
      } backdrop-blur-md border rounded-card p-6 sm:p-7 transition-all hover:bg-white/[0.12] hover:-translate-y-1`}
    >
      {icon && <div className="text-3xl mb-3" aria-hidden>{icon}</div>}
      <div className="text-3xl sm:text-4xl font-extrabold text-jaune -tracking-[1px]">
        {number}
      </div>
      <div className="text-[13px] text-white/60 mt-1 font-normal">{label}</div>
    </div>
  );
}
