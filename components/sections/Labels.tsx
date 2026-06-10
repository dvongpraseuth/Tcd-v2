import Image from "next/image";

const LABELS = [
  {
    type: "img" as const,
    img: "/images/label-tennis-sante.jpg",
    alt: "Label Tennis Santé",
    text: ["Label", "Tennis Santé"],
  },
  { type: "icon" as const, icon: "♿", text: ["Accessibilité", "PMR complète"] },
  { type: "icon" as const, icon: "🤝", text: ["Économie Sociale", "et Solidaire"] },
  { type: "icon" as const, icon: "🎾", text: ["Club affilié", "FFT"] },
  { type: "icon" as const, icon: "🎓", text: ["Pass Région", "accepté"] },
];

export function Labels() {
  return (
    <section className="py-20 px-5 sm:px-8 bg-blanc">
      <div className="max-w-container mx-auto">
        <div className="section-label">Labels &amp; Certifications</div>
        <div className="flex justify-center gap-8 sm:gap-12 flex-wrap py-10 border-t border-b border-gris-200">
          {LABELS.map((l, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 min-w-[88px]"
            >
              {l.type === "img" ? (
                <Image
                  src={l.img}
                  alt={l.alt}
                  width={56}
                  height={56}
                  className="h-14 w-auto object-contain rounded-lg"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gris-100 flex items-center justify-center text-2xl">
                  <span aria-hidden>{l.icon}</span>
                </div>
              )}
              <div className="text-[13px] font-semibold text-gris-700 text-center leading-tight">
                {l.text.map((t, j) => (
                  <div key={j}>{t}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
