/**
 * Avertissement « file d'attente Ten'Up ».
 *
 * Pourquoi : en période d'inscriptions, la FFT active une salle d'attente
 * (queue-it) sur TOUT tenup.fft.fr — vérifié le 25/08/2026, même la page club
 * nue y passe. Ce n'est pas un bug de notre lien, et la file conserve bien la
 * destination (paramètre `t=`) : une fois passé, l'adhérent arrive sur la
 * bonne offre.
 *
 * Le vrai problème est donc de PERCEPTION : sans prévenir, l'adhérent croit
 * que le site est cassé et ferme l'onglet — ce qui lui fait perdre sa place.
 * Le prévenir avant le clic transforme « ça bugue » en « j'attends ».
 *
 * Même logique que l'encart de préparation Ten'Up de PadelSlot (EVOL-004).
 */
export function FileAttenteTenup({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-card border border-jaune bg-jaune-pale px-4 py-3 text-sm text-gris-800 ${className}`}
    >
      <p className="font-bold text-bleu-fonce mb-1">
        ⏳ Ten&apos;Up peut vous mettre en file d&apos;attente
      </p>
      <p className="leading-relaxed">
        Pendant la période d&apos;inscriptions, la FFT régule l&apos;accès à
        Ten&apos;Up. Si un écran d&apos;attente s&apos;affiche,{" "}
        <strong>c&apos;est normal — ne fermez pas la page</strong> : vous
        perdriez votre place. Vous serez redirigé automatiquement vers la bonne
        offre.
      </p>
      <p className="mt-2 text-gris-700">
        L&apos;attente est généralement plus courte tôt le matin ou en soirée.
      </p>
    </div>
  );
}
