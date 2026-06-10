import Image from "next/image";

const ITEMS = [
  {
    icon: "📍",
    label: "Adresse",
    value: (
      <>
        Rue des Fonds, Complexe de Jossols
        <br />
        07430 Davézieux
      </>
    ),
  },
  { icon: "📞", label: "Téléphone", value: "04 75 67 73 72 · 07 81 39 78 02" },
  {
    icon: "✉️",
    label: "Email",
    value: (
      <a
        href="mailto:tcdavezieuxtennispadel@gmail.com"
        className="text-jaune hover:underline"
      >
        tcdavezieuxtennispadel@gmail.com
      </a>
    ),
  },
  { icon: "🕐", label: "Horaires courts", value: "8h – 22h · Toute l'année" },
  {
    icon: "🅿️",
    label: "Accès",
    value:
      "Parking gratuit · Place PMR · Depuis le centre, direction Vernosc-lès-Annonay",
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 px-5 sm:px-8 bg-noir text-blanc relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-bleu opacity-15 blur-[100px]"
      />

      <div className="max-w-container mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-jaune mb-4">
          <span className="w-6 h-0.5 bg-jaune" />
          Nous trouver
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold -tracking-[1.5px] leading-tight mb-4 text-blanc">
          Venir au <em className="text-jaune">club</em>
        </h2>
        <p className="text-base sm:text-[17px] text-white/50 leading-relaxed max-w-xl mb-12">
          Complexe sportif de Jossols, au cœur de Davézieux. Courts accessibles
          de 8h à 22h toute l&apos;année.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-6">
            {ITEMS.map((it) => (
              <div key={it.label} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-card bg-jaune/10 flex items-center justify-center text-lg flex-shrink-0">
                  <span aria-hidden>{it.icon}</span>
                </div>
                <div>
                  <div className="text-xs text-gris-500 uppercase tracking-wider font-semibold mb-1">
                    {it.label}
                  </div>
                  <div className="text-base text-blanc font-medium">
                    {it.value}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-card bg-jaune/10 flex items-center justify-center text-lg flex-shrink-0">
                <span aria-hidden>📱</span>
              </div>
              <div>
                <div className="text-xs text-gris-500 uppercase tracking-wider font-semibold mb-1">
                  App Ten&apos;Up
                </div>
                <div className="text-base text-blanc font-medium">
                  Scannez pour réserver un court
                </div>
                <Image
                  src="/images/qr-tenup.png"
                  alt="QR Code Ten'Up"
                  width={120}
                  height={120}
                  className="mt-3 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="rounded-card-lg overflow-hidden h-[420px] bg-gris-800 border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2812.5!2d4.70339!3d45.251816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47f5a5d0b0b0b0b0%3A0x0!2sComplexe+sportif+Jossols%2C+Rue+des+Fonds%2C+07430+Dav%C3%A9zieux!5e1!3m2!1sfr!2sfr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte Tennis Club Davézieux"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
