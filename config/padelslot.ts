/**
 * Liens vers PadelSlot depuis le site du TCD — avec traçage d'origine.
 *
 * Constat du 31/08 (8 jours avant la rentrée) : les liens pointaient sur
 * `https://padelslot.fr` NU. Mesure côté PadelSlot : **0 inscrit** portant une
 * origine TCD. Le club pouvait déjà nous amener des joueurs sans qu'on puisse
 * le savoir — et sans mesure, impossible de dire si la campagne d'affiches de
 * la rentrée sert à quelque chose.
 *
 * L'attribution fonctionne côté PadelSlot (c'est elle qui a révélé que ChatGPT
 * est notre 1er canal, et ce soir le 1er inscrit SEO). Il manquait juste le
 * paramètre.
 *
 * Une UTM par SURFACE, pour savoir CE qui marche et pas seulement QUE ça marche.
 */
const BASE = "https://padelslot.fr";

function lien(medium: string): string {
  const p = new URLSearchParams({
    utm_source: "tcd",
    utm_medium: medium,
    utm_campaign: "rentree2026",
  });
  return `${BASE}/?${p.toString()}`;
}

export const PADELSLOT_LINKS = {
  /** Encart principal « Trouvez des partenaires » sur la home. */
  cta: lien("site-cta"),
  /** Lien discret dans le bloc Installations (pistes de padel). */
  installations: lien("site-installations"),
  /** Affiches papier — QR posés au club-house. */
  afficheHall: lien("affiche-hall"),
  /** Affiches papier — bord des pistes de padel. */
  afficheTerrain: lien("affiche-terrain"),
  /** Tunnel de préinscription (écran de confirmation). */
  inscription: lien("inscription"),
} as const;
