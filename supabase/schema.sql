-- =====================================================================
--  SEDRA COMMAND CENTER — Schéma Supabase
--  À coller dans : Supabase > SQL Editor > New query > Run
--  Idempotent : peut être relancé sans casser l'existant.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. PROFILS & RÔLE ADMIN
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'user' check (role in ('admin','user')),
  company_name    text default 'Sedra-dev',
  company_siret   text,
  company_address text,
  created_at  timestamptz not null default now()
);

-- Le tout premier compte créé devient automatiquement admin.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    case when not exists (select 1 from public.profiles where role = 'admin') then 'admin' else 'user' end
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ---------------------------------------------------------------------
-- 2. CLIENTS
-- ---------------------------------------------------------------------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  company     text,
  email       text,
  phone       text,
  website     text,
  city        text,
  country     text default 'France',
  status      text not null default 'actif' check (status in ('prospect','actif','inactif')),
  notes       text
);

-- ---------------------------------------------------------------------
-- 3. LEADS (demandes entrantes)
-- ---------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  phone       text,
  company     text,
  website     text,
  source      text not null default 'contact' check (source in ('contact','audit_seo','whatsapp','email','autre')),
  service     text,
  budget      text,
  message     text,
  status      text not null default 'nouveau' check (status in ('nouveau','contacte','qualifie','converti','perdu')),
  is_read     boolean not null default false,
  client_id   uuid references public.clients(id) on delete set null,
  notes       text
);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------
-- 4. PROJETS & TÂCHES
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  client_id   uuid references public.clients(id) on delete cascade,
  name        text not null,
  type        text not null default 'vitrine' check (type in ('vitrine','ecommerce','app','ia','seo','autre')),
  status      text not null default 'cadrage' check (status in ('cadrage','dev','recette','livre','pause')),
  budget      numeric(10,2) default 0,
  start_date  date,
  due_date    date,
  progress    int not null default 0 check (progress between 0 and 100),
  position    int not null default 0,
  description text
);

create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  done        boolean not null default false,
  due_date    date,
  position    int not null default 0
);

-- ---------------------------------------------------------------------
-- 5. DEVIS & FACTURES
-- ---------------------------------------------------------------------
create table if not exists public.quotes (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  number      text unique,
  client_id   uuid references public.clients(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  status      text not null default 'brouillon' check (status in ('brouillon','envoye','accepte','refuse')),
  items       jsonb not null default '[]'::jsonb,   -- [{label, qty, unit_price}]
  total       numeric(10,2) not null default 0,
  issued_at   date default current_date,
  valid_until date
);

create table if not exists public.invoices (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  number      text unique,
  client_id   uuid references public.clients(id) on delete cascade,
  project_id  uuid references public.projects(id) on delete set null,
  quote_id    uuid references public.quotes(id) on delete set null,
  status      text not null default 'brouillon' check (status in ('brouillon','envoyee','payee','en_retard')),
  items       jsonb not null default '[]'::jsonb,
  total       numeric(10,2) not null default 0,
  issued_at   date default current_date,
  due_at      date,
  paid_at     date
);

-- ---------------------------------------------------------------------
-- 6. FORFAIT SÉRÉNITÉ
-- ---------------------------------------------------------------------
create table if not exists public.subscriptions (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  plan          text not null default 'serenite',
  amount        numeric(10,2) not null default 10,
  status        text not null default 'actif' check (status in ('actif','pause','resilie')),
  started_at    date not null default current_date,
  next_billing  date,
  site_url      text
);

-- ---------------------------------------------------------------------
-- 7. AUDITS SEO
-- ---------------------------------------------------------------------
create table if not exists public.seo_audits (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  url             text not null,
  lead_id         uuid references public.leads(id) on delete set null,
  client_id       uuid references public.clients(id) on delete set null,
  status          text not null default 'a_faire' check (status in ('a_faire','en_cours','envoye')),
  score_perf      int check (score_perf between 0 and 100),
  score_seo       int check (score_seo between 0 and 100),
  score_access    int check (score_access between 0 and 100),
  score_best      int check (score_best between 0 and 100),
  recommendations jsonb not null default '[]'::jsonb
);

-- ---------------------------------------------------------------------
-- 8. JOURNAL D'ACTIVITÉ (alimenté automatiquement)
-- ---------------------------------------------------------------------
create table if not exists public.activity_log (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null,          -- lead | client | project | invoice | quote | subscription | audit
  action      text not null,          -- created | updated | status
  title       text not null,
  entity_id   uuid
);
create index if not exists activity_created_idx on public.activity_log (created_at desc);

create or replace function public.log_activity()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  t text := tg_argv[0];
  label text;
begin
  label := case t
    when 'lead'         then 'Nouveau lead : ' || new.name
    when 'client'       then 'Nouveau client : ' || coalesce(new.company, new.name)
    when 'project'      then 'Projet : ' || new.name
    when 'invoice'      then 'Facture ' || coalesce(new.number,'') || ' — ' || new.total || ' €'
    when 'quote'        then 'Devis ' || coalesce(new.number,'') || ' — ' || new.total || ' €'
    when 'subscription' then 'Forfait Sérénité ' || new.status
    when 'audit'        then 'Audit SEO : ' || new.url
    else t end;

  if tg_op = 'INSERT' then
    insert into public.activity_log (type, action, title, entity_id) values (t, 'created', label, new.id);
  elsif tg_op = 'UPDATE' and (to_jsonb(new)->>'status') is distinct from (to_jsonb(old)->>'status') then
    insert into public.activity_log (type, action, title, entity_id)
    values (t, 'status', label || ' → ' || (to_jsonb(new)->>'status'), new.id);
  end if;
  return new;
end $$;

do $$
declare r record;
begin
  for r in select * from (values
    ('leads','lead'),('clients','client'),('projects','project'),('invoices','invoice'),
    ('quotes','quote'),('subscriptions','subscription'),('seo_audits','audit')
  ) as x(tbl, kind) loop
    execute format('drop trigger if exists trg_log_%1$s on public.%1$s', r.tbl);
    execute format(
      'create trigger trg_log_%1$s after insert or update on public.%1$s
       for each row execute function public.log_activity(%2$L)', r.tbl, r.kind);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 9. SÉCURITÉ RLS — tout est réservé à l'admin
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['clients','leads','projects','tasks','quotes','invoices','subscriptions','seo_audits','activity_log'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin_all" on public.%I', t);
    execute format('create policy "admin_all" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

alter table public.profiles enable row level security;
drop policy if exists "own_profile_select" on public.profiles;
drop policy if exists "own_profile_update" on public.profiles;
create policy "own_profile_select" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own_profile_update" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

-- ---------------------------------------------------------------------
-- 10. RPC PUBLIQUE : formulaire du site sedra-dev.com
--     Appel : supabase.rpc('submit_lead', {...}) avec la clé anon.
--     Anti-spam : honeypot + max 3 envois / email / heure.
-- ---------------------------------------------------------------------
create or replace function public.submit_lead(
  p_name text, p_email text, p_message text default null,
  p_phone text default null, p_company text default null, p_website text default null,
  p_source text default 'contact', p_service text default null, p_budget text default null,
  p_honeypot text default null
) returns json language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if coalesce(p_honeypot,'') <> '' then return json_build_object('ok', true); end if;
  if length(trim(coalesce(p_name,''))) < 2 or p_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Données invalides';
  end if;
  if (select count(*) from public.leads where lower(email) = lower(p_email) and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'Trop de demandes, réessayez plus tard';
  end if;

  insert into public.leads (name, email, phone, company, website, source, service, budget, message)
  values (left(trim(p_name),120), lower(trim(p_email)), left(p_phone,40), left(p_company,120), left(p_website,250),
          case when p_source in ('contact','audit_seo','whatsapp','email','autre') then p_source else 'contact' end,
          left(p_service,120), left(p_budget,60), left(p_message,5000))
  returning id into new_id;

  if p_source = 'audit_seo' and coalesce(p_website,'') <> '' then
    insert into public.seo_audits (url, lead_id) values (p_website, new_id);
  end if;

  return json_build_object('ok', true);
end $$;

revoke all on function public.submit_lead from public;
grant execute on function public.submit_lead to anon, authenticated;

-- ---------------------------------------------------------------------
-- 11. RPC STATS pour l'Overview (admin uniquement)
-- ---------------------------------------------------------------------
create or replace function public.dashboard_stats()
returns json language plpgsql stable security definer set search_path = public as $$
declare result json;
begin
  if not public.is_admin() then raise exception 'Accès refusé'; end if;

  select json_build_object(
    'revenue_month',      (select coalesce(sum(total),0) from invoices where status='payee' and date_trunc('month',paid_at) = date_trunc('month',current_date)),
    'revenue_prev_month', (select coalesce(sum(total),0) from invoices where status='payee' and date_trunc('month',paid_at) = date_trunc('month',current_date - interval '1 month')),
    'mrr',                (select coalesce(sum(amount),0) from subscriptions where status='actif'),
    'subscribers',        (select count(*) from subscriptions where status='actif'),
    'leads_30d',          (select count(*) from leads where created_at > now() - interval '30 days'),
    'leads_prev_30d',     (select count(*) from leads where created_at between now() - interval '60 days' and now() - interval '30 days'),
    'leads_unread',       (select count(*) from leads where not is_read),
    'projects_active',    (select count(*) from projects where status in ('cadrage','dev','recette')),
    'clients_total',      (select count(*) from clients),
    'conversion_rate',    (select case when count(*)=0 then 0 else round(100.0*count(*) filter (where status='converti')/count(*),1) end from leads),
    'pending_invoices',   (select coalesce(sum(total),0) from invoices where status in ('envoyee','en_retard')),
    'revenue_by_month',   (
      select coalesce(json_agg(json_build_object('month', to_char(m,'YYYY-MM'), 'revenue', coalesce(r.total,0)) order by m),'[]'::json)
      from generate_series(date_trunc('month',current_date) - interval '11 months', date_trunc('month',current_date), interval '1 month') m
      left join (select date_trunc('month',paid_at) mo, sum(total) total from invoices where status='payee' group by 1) r on r.mo = m
    ),
    'leads_by_source',    (select coalesce(json_object_agg(source, c),'{}'::json) from (select source, count(*) c from leads group by source) s),
    'funnel',             (select json_build_object(
                              'leads',     (select count(*) from leads),
                              'qualifies', (select count(*) from leads where status in ('qualifie','converti')),
                              'devis',     (select count(*) from quotes where status in ('envoye','accepte')),
                              'signes',    (select count(*) from quotes where status='accepte')))
  ) into result;
  return result;
end $$;

revoke all on function public.dashboard_stats from public, anon;
grant execute on function public.dashboard_stats to authenticated;

-- ---------------------------------------------------------------------
-- 12. TEMPS RÉEL
-- ---------------------------------------------------------------------
do $$
begin
  begin alter publication supabase_realtime add table public.leads;        exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.activity_log; exception when duplicate_object then null; end;
end $$;
