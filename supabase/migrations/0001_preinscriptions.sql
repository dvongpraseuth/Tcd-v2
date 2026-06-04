-- ============================================================
-- TCD — Schéma preinscriptions saison 2026-2027
-- Brief §5 — 2 tables liées + RLS anon insert / auth read+update
-- ============================================================

-- Foyer (1 préinscription = 1 foyer)
create table if not exists public.preinscriptions (
  id                uuid primary key default gen_random_uuid(),

  -- Coordonnées foyer
  email             text not null,
  telephone         text not null,
  code_postal       text not null,
  ville             text not null,
  adresse           text,

  -- Situation
  type_inscription  text not null check (type_inscription in ('solo', 'famille')),
  situation_sociale boolean not null default false,
  notes_libres      text,

  -- Tunnel : Porte A (Ten'Up CB) ou Porte B (paiement local chèque/espèces)
  porte_choisie     text check (porte_choisie in ('tenup', 'local')),

  -- Workflow admin
  statut            text not null default 'en_attente'
                    check (statut in ('en_attente', 'valide', 'paye', 'refuse')),
  notes_admin       text,

  -- Source de vérité montant (calculé serveur à la soumission, snapshot du devis)
  total_calcule     integer not null check (total_calcule >= 0),
  remise_type       text check (remise_type in ('famille', 'sociale')),
  remise_montant    integer not null default 0 check (remise_montant >= 0),

  -- Métadonnées
  saison            text not null default '2026-2027',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_preinscriptions_statut on public.preinscriptions(statut);
create index if not exists idx_preinscriptions_saison on public.preinscriptions(saison);
create index if not exists idx_preinscriptions_created_at on public.preinscriptions(created_at desc);

-- Membres du foyer (1..N par préinscription)
create table if not exists public.preinscription_membres (
  id                  uuid primary key default gen_random_uuid(),
  preinscription_id   uuid not null references public.preinscriptions(id) on delete cascade,

  -- Identité
  nom                 text not null,
  prenom              text not null,
  date_naissance      date not null,
  sexe                text not null check (sexe in ('F', 'M', 'X')),

  -- Profil calculé côté serveur (cache pour requêtes admin)
  profil              text not null check (profil in ('enfant', 'jeune', 'adulte')),

  -- Choix saison
  cours               text,
  stages              text[] not null default '{}',
  tennis_sante        boolean not null default false,

  -- Snapshot tarifaire à la soumission
  adhesion            integer not null check (adhesion >= 0),
  cours_montant       integer not null default 0 check (cours_montant >= 0),
  stages_montant      integer not null default 0 check (stages_montant >= 0),
  tennis_sante_montant integer not null default 0 check (tennis_sante_montant >= 0),

  created_at          timestamptz not null default now()
);

create index if not exists idx_membres_preinscription on public.preinscription_membres(preinscription_id);

-- Trigger updated_at auto
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
-- RLS — brief §5
-- ============================================================
alter table public.preinscriptions enable row level security;
alter table public.preinscription_membres enable row level security;

-- ANON : peut INSERT (formulaire public), pas de SELECT
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

-- AUTHENTICATED (admin connecté) : SELECT + UPDATE sur les 2 tables
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
