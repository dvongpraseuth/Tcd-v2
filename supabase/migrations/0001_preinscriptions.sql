-- ============================================================
-- TCD — Schéma preinscriptions saison 2026-2027
-- Modèle aligné HANDOFF Claude Desktop (catégorie + activité déclarées,
-- décomposition licence + adhésion, cours multiples par membre)
-- 2 tables liées + RLS anon insert / auth read+update
-- ============================================================

-- ─── Foyer (1 préinscription = 1 foyer) ────────────────────
create table if not exists public.preinscriptions (
  id                uuid primary key default gen_random_uuid(),

  -- Coordonnées foyer
  email             text not null,
  telephone         text not null,
  code_postal       text not null,
  ville             text not null,
  adresse           text,

  -- Mode
  mode              text not null check (mode in ('seul', 'famille')),
  notes_libres      text,

  -- Routage initial choisi par le tunnel (info pour stats / analyse)
  routage_initial   text check (routage_initial in ('simple', 'complexe')),

  -- Incohérences détectées (catégorie déclarée ≠ âge calculé)
  incoherences      text[],

  -- Workflow admin
  statut            text not null default 'en_attente'
                    check (statut in ('en_attente', 'contacte', 'valide', 'paye', 'refuse')),
  notes_admin       text,

  -- Snapshot tarif (calculé serveur à la soumission)
  total_calcule     numeric(8,2) not null check (total_calcule >= 0),

  -- Métadonnées
  saison            text not null default '2026-2027',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_preinscriptions_statut on public.preinscriptions(statut);
create index if not exists idx_preinscriptions_saison on public.preinscriptions(saison);
create index if not exists idx_preinscriptions_created_at on public.preinscriptions(created_at desc);

-- ─── Membres du foyer (1..N par préinscription) ────────────
create table if not exists public.preinscription_membres (
  id                       uuid primary key default gen_random_uuid(),
  preinscription_id        uuid not null references public.preinscriptions(id) on delete cascade,

  -- Identité
  nom                      text not null,
  prenom                   text not null,
  date_naissance           date not null,
  sexe                     text not null check (sexe in ('F', 'H')),

  -- Choix déclarés
  categorie                text not null check (categorie in ('adulte', 'jeune', 'enfant')),
  activite                 text not null check (activite in ('tennis', 'padel', 'deux')),
  exterieur                boolean not null default false,
  formule_key              text not null,
  cours                    text[] not null default '{}',
  remise_sociale_demandee  boolean not null default false,

  -- Snapshot tarifaire (en €)
  licence                  numeric(8,2) not null check (licence >= 0),
  adhesion_brute           numeric(8,2) not null check (adhesion_brute >= 0),
  montant_remise           numeric(8,2) not null default 0 check (montant_remise >= 0),
  adhesion_nette           numeric(8,2) not null check (adhesion_nette >= 0),
  cours_montant            numeric(8,2) not null default 0 check (cours_montant >= 0),
  sous_total               numeric(8,2) not null check (sous_total >= 0),

  created_at               timestamptz not null default now()
);

create index if not exists idx_membres_preinscription on public.preinscription_membres(preinscription_id);

-- ─── Trigger updated_at ────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_preinscriptions_updated_at on public.preinscriptions;
create trigger trg_preinscriptions_updated_at
  before update on public.preinscriptions
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS — anon insert seul, authenticated lit+update
-- ============================================================
alter table public.preinscriptions enable row level security;
alter table public.preinscription_membres enable row level security;

-- ANON : INSERT seulement (formulaire public), pas de SELECT
drop policy if exists "anon_insert_preinscriptions" on public.preinscriptions;
create policy "anon_insert_preinscriptions"
  on public.preinscriptions for insert
  to anon
  with check (true);

drop policy if exists "anon_insert_membres" on public.preinscription_membres;
create policy "anon_insert_membres"
  on public.preinscription_membres for insert
  to anon
  with check (true);

-- AUTHENTICATED (admin bureau) : full SELECT + UPDATE
drop policy if exists "auth_select_preinscriptions" on public.preinscriptions;
create policy "auth_select_preinscriptions"
  on public.preinscriptions for select
  to authenticated
  using (true);

drop policy if exists "auth_update_preinscriptions" on public.preinscriptions;
create policy "auth_update_preinscriptions"
  on public.preinscriptions for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "auth_select_membres" on public.preinscription_membres;
create policy "auth_select_membres"
  on public.preinscription_membres for select
  to authenticated
  using (true);

drop policy if exists "auth_update_membres" on public.preinscription_membres;
create policy "auth_update_membres"
  on public.preinscription_membres for update
  to authenticated
  using (true)
  with check (true);
