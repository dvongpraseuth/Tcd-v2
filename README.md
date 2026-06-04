# Site Tennis Club Davézieux

Site officiel et tunnel de préinscription pour la saison **2026-2027**.

> Refonte 2026 — la maquette HTML monopage v1 est archivée dans la branche
> `legacy/html-monopage` et dans `_legacy/` pour récupération de contenu.

## Stack

- **Next.js 15.1** (App Router + Server Components + Server Actions)
- **React 19** + **TypeScript strict**
- **Supabase** (Auth + Postgres + RLS) via `@supabase/ssr` 0.5
- **Tailwind CSS 3** avec design tokens custom (palette terrain/papier/balle/drapeau)
- **Zod** pour la validation runtime client + serveur
- **Vitest** (logique métier) + **Playwright** (E2E, plus tard)
- **Vercel** pour l'hébergement (Fluid Compute, Node.js 24)

## Démarrer en local

```bash
# 1. Installer
npm install

# 2. Copier les variables d'env (les remplir avec les valeurs Supabase réelles)
cp .env.local.example .env.local

# 3. Lancer le dev server
npm run dev
# → http://localhost:3000
```

## Variables d'env (`.env.local`)

| Variable | Source | Usage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | dashboard Supabase → API | client + serveur |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | dashboard Supabase → API | client + serveur (RLS active) |
| `SUPABASE_SERVICE_ROLE_KEY` | dashboard Supabase → API | serveur uniquement (admin) |
| `NEXT_PUBLIC_TENUP_URL` | bureau TCD | redirection Porte A (CB Ten'Up FFT) |
| `NEXT_PUBLIC_SAISON` | constante | affichage saison courante |
| `NEXT_PUBLIC_CLUB_EMAIL` | bureau TCD | footer + emails |
| `ADMIN_NOTIF_EMAIL` | gmail technique | destinataire notifications |

## Architecture

### Source de vérité tarifaire

**Un seul fichier** : [`config/tarifs.ts`](./config/tarifs.ts).
Toute la logique de calcul lit ce fichier. Modification d'un tarif = un seul
endroit + bump `SAISON` si nouvelle saison.

### Logique métier (`lib/`)

| Fichier | Responsabilité |
|---|---|
| `profile.ts` | Classification âge → `enfant` / `jeune` / `adulte` au 1er sept |
| `eligibilite-cours.ts` | Filtre cours selon âge + sexe |
| `remises.ts` | Calcul remise famille **XOR** sociale (non cumulables) |
| `compute-totals.ts` | Devis foyer complet (adhésion + cours + stages + remise) |

### Schéma Supabase

2 tables avec RLS :

- `preinscriptions` (1 ligne par foyer)
- `preinscription_membres` (N lignes par foyer)

Politiques :
- **anon** : `INSERT` uniquement (formulaire public)
- **authenticated** : `SELECT` + `UPDATE` (admin connecté)

### Routes

| Route | Type | Rôle |
|---|---|---|
| `/` | page | Home avec hero + 3 portes |
| `/tarifs` | page | Tarifs générés depuis `config/tarifs.ts` |
| `/inscription` | page | Tunnel 7 étapes (Intro → Confirmation) |
| `/le-club, /tennis, /padel, /ecole, /actualites, /contact` | page | Stubs `<EnConstruction/>` |
| `/api/preinscriptions` | POST | Enregistrement préinscription + Zod + recalcul serveur |
| `/login` | page | Connexion admin Supabase |
| `/admin` | page | Tableau de bord préinscriptions |

## Tests

```bash
npm test           # Vitest une fois
npm run test:watch # Mode watch
npm run test:e2e   # Playwright (TODO P1)
```

**Résultats ancrés** (brief §10, gardiens des tarifs) :
- famille 2 adultes + 1 jeune École → `338+130-68=400€`
- femme adulte + cours Dames étudiante → `130+140-13=257€`

Si ces tests cassent, c'est que les tarifs ont divergé du brief — **pas le test**.

## Déploiement

1. Créer le projet Supabase depuis `tcdavezieux.technique@gmail.com`
2. Appliquer la migration `supabase/migrations/0001_preinscriptions.sql`
3. Créer un utilisateur admin dans Supabase Auth (email/password)
4. Importer le repo `Tcd-v2` sur Vercel depuis le même Gmail
5. Coller les vars d'env Vercel (cf section ci-dessus)
6. Trigger un deploy → preview URL

## Conventions

- **Toujours** `getUser()` côté serveur, jamais `getSession()`
- **Jamais** `SUPABASE_SERVICE_ROLE_KEY` côté client (RLS contournée)
- Recalcul du devis côté serveur dans la route POST (jamais trust client)
- Code postal → ville via `https://geo.api.gouv.fr/communes` avec repli saisie libre
- Tests à jour avant chaque commit qui touche `lib/` ou `config/`

## Bloqueurs côté bureau du club

- URL Ten'Up TCD exacte (pour `NEXT_PUBLIC_TENUP_URL`)
- Format d'export ADOC validé (capture écran à fournir)
- Confirmation borne 6 ans pour la tranche "jeune" (hypothèse retenue par défaut)
- Validation des tarifs avec Séb Roux (valeur "jeune" calée à 78 € sur le test ancré §10)

## Licence

Propriété du Tennis Club Davézieux — usage interne uniquement.
