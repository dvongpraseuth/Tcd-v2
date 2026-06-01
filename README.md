# Site Tennis Club Davézieux

Site officiel du Tennis Club Davézieux (TCD) — refonte du site emonsite existant.

## Stack

- HTML / CSS pur monopage (pas de framework)
- Google Fonts : Outfit + Playfair Display
- JS minimal (nav mobile uniquement)

## Hébergement cible

- **Cloudflare Pages** (gratuit, illimité)
- Repo GitHub privé, déploiement auto à chaque `git push`
- Domaine : à confirmer avec le bureau TCD
- HTTPS auto (Cloudflare Universal Cert)
- Form contact via Web3Forms (gratuit)
- DNS + email forwarding via Cloudflare (gratuit)
- Analytics : Cloudflare Web Analytics (sans cookie, RGPD-friendly)

**Coût récurrent : 0 €/mois** (hors renouvellement domaine).

## Statut

🟡 **Phase A — préparation** (2026-06-01)

Repo provisoire sous compte perso David, transférable à l'organisation GitHub TCD une fois ouverte par le bureau.

## Plan de migration

Voir [`CoworkZone/Projets/site-tcd/plan-migration-emonsite.md`](../../CoworkZone/Projets/site-tcd/plan-migration-emonsite.md) pour le détail complet (10 sections, 18 frictions cataloguées).

## Structure

```
site-tcd/
├── index.html         # Monopage (8 sections SPA)
├── logo-tcd.jpg       # Logo club
├── images/            # Logos partenaires + QR Ten'Up
├── README.md
└── .gitignore
```

## Sections du site

1. Hero
2. Matchs
3. Installations
4. Partenaires
5. École
6. Tarifs
7. Équipe
8. Témoignages + Contact

## Développement local

Aucune dépendance. Ouvrir `index.html` directement dans le navigateur, ou lancer un serveur statique :

```bash
npx serve .
```

## Contacts club

- Jean-Jacques Personne (président)
- Alex Begot (CM)
- Sébastien Roux (FFT, contact réseau)
