import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[620px] flex items-center bg-bleu overflow-hidden -mt-[72px] pt-[72px]"
    >
      {/* Background image */}
      <Image
        src="/images/drone-complexe-bleu.jpg"
        alt="Vue aérienne du complexe sportif"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_40%] z-0"
      />
      {/* Overlay gradient */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(30, 42, 110, 0.92) 0%, rgba(30, 42, 110, 0.75) 50%, rgba(30, 42, 110, 0.6) 100%), radial-gradient(ellipse at 20% 80%, rgba(242, 201, 76, 0.15) 0%, transparent 60%)",
        }}
      />
      {/* Yellow blob accent */}
      <div
        aria-hidden
        className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-jaune opacity-[0.06] blur-[80px] z-[1]"
      />

      <div className="container-page relative z-10 py-14 sm:py-16 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-jaune/15 border border-jaune/30 text-jaune px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-wide mb-5">
            <span aria-hidden>🎾</span> Depuis 1986 à Davézieux
          </div>
          <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-extrabold text-blanc -tracking-[2px] leading-[1.05] mb-5">
            Tennis &amp; Padel
            <br />
            pour <em className="text-jaune">tous</em>
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-lg mb-7 font-light">
            4 courts de tennis, 2 pistes de padel, une école labellisée et une
            équipe passionnée au cœur de l&apos;Ardèche.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://tenup.fft.fr/club/50070493/reservations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-card px-6 py-3 bg-jaune text-bleu-fonce font-semibold text-sm transition-all hover:bg-jaune-clair hover:-translate-y-0.5 hover:shadow-tcd-jaune"
            >
              Réservation Adhérents →
            </a>
            <a
              href="https://www.anybuddyapp.com/club-davezieux-tennis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-card px-6 py-3 bg-transparent text-blanc border-[1.5px] border-white/30 font-semibold text-sm transition-all hover:border-blanc hover:bg-white/10 hover:-translate-y-0.5"
            >
              Réservation Guest →
            </a>
          </div>
          <div className="mt-4">
            <Link
              href="/inscription"
              className="text-sm text-white/60 hover:text-jaune transition-colors underline decoration-jaune/40 decoration-2 underline-offset-4"
            >
              Préinscription saison 2026-2027 →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 animate-fade-in-up-delay">
          <StatCard featured number="~270" label="adhérents" full />
          <StatCard number="4" label="courts tennis" />
          <StatCard number="2" label="pistes padel" />
          <StatCard number="8" label="équipes championnat" />
          <StatCard number="8h–22h" label="accès courts" />
          <StatCard number="40+" label="ans d'existence" />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  number,
  label,
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
      className={`${full ? "col-span-3" : ""} ${
        featured
          ? "bg-jaune/10 border-jaune/20"
          : "bg-white/[0.07] border-white/10"
      } backdrop-blur-md border rounded-card px-4 py-3.5 transition-all hover:bg-white/[0.12] hover:-translate-y-0.5`}
    >
      <div className="text-2xl sm:text-3xl font-extrabold text-jaune -tracking-[1px]">
        {number}
      </div>
      <div className="text-[12px] text-white/60 mt-0.5 font-normal leading-tight">
        {label}
      </div>
    </div>
  );
}
