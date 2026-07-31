-- natura'bio by yas — Auth + Forum
-- À coller dans Supabase → SQL Editor → Run

-- Profils (liés à auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Membre',
  access_tier text not null default 'free'
    check (access_tier in ('free', 'ebook', 'coaching')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Posts du forum
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  title text not null,
  content text not null,
  agent text not null default 'globale',
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

-- Réponses
create table if not exists public.forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  content text not null,
  is_seed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists forum_posts_created_at_idx on public.forum_posts (created_at desc);
create index if not exists forum_replies_post_id_idx on public.forum_replies (post_id, created_at);

-- Profil auto à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      split_part(new.email, '@', 1),
      'Membre'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.forum_posts enable row level security;
alter table public.forum_replies enable row level security;

-- Profiles
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Forum posts : lecture publique, écriture connectée
drop policy if exists "forum_posts_select" on public.forum_posts;
create policy "forum_posts_select"
  on public.forum_posts for select
  using (true);

drop policy if exists "forum_posts_insert" on public.forum_posts;
create policy "forum_posts_insert"
  on public.forum_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "forum_posts_update_own" on public.forum_posts;
create policy "forum_posts_update_own"
  on public.forum_posts for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "forum_posts_delete_own" on public.forum_posts;
create policy "forum_posts_delete_own"
  on public.forum_posts for delete
  to authenticated
  using (auth.uid() = user_id and is_seed = false);

-- Forum replies
drop policy if exists "forum_replies_select" on public.forum_replies;
create policy "forum_replies_select"
  on public.forum_replies for select
  using (true);

drop policy if exists "forum_replies_insert" on public.forum_replies;
create policy "forum_replies_insert"
  on public.forum_replies for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "forum_replies_delete_own" on public.forum_replies;
create policy "forum_replies_delete_own"
  on public.forum_replies for delete
  to authenticated
  using (auth.uid() = user_id and is_seed = false);

-- Seed (discussions d'exemple) — une seule fois
insert into public.forum_posts (id, user_id, author_name, title, content, agent, is_seed, created_at)
select * from (values
  (
    'a1000000-0000-4000-8000-000000000001'::uuid,
    null::uuid,
    'Amina',
    'Huiles pour l''anxiété et le stress ?',
    'Quelles huiles sont les plus adaptées pour calmer l''anxiété au quotidien sans risque ? J''ai 32 ans, stress de travail, je veux quelque chose de simple.',
    'aromatherapie',
    true,
    '2026-07-10T10:00:00Z'::timestamptz
  ),
  (
    'a1000000-0000-4000-8000-000000000002'::uuid,
    null,
    'Fatima',
    'Respiration pour calmer les insomnies',
    'Je cherche des exercices simples à faire le soir qui agissent vraiment sur le nerf vague. Je me réveille souvent vers 3h.',
    'respiration',
    true,
    '2026-07-12T10:00:00Z'::timestamptz
  ),
  (
    'a1000000-0000-4000-8000-000000000003'::uuid,
    null,
    'Yasmine',
    'Fatigue + grignotage sucre l''après-midi',
    'Dès 15h je m''effondre et je craque sur le sucré. Des pistes naturelles sans régime extrême ?',
    'alimentation',
    true,
    '2026-07-14T10:00:00Z'::timestamptz
  )
) as v(id, user_id, author_name, title, content, agent, is_seed, created_at)
where not exists (select 1 from public.forum_posts where is_seed = true limit 1);

insert into public.forum_replies (post_id, user_id, author_name, content, is_seed, created_at)
select * from (values
  ('a1000000-0000-4000-8000-000000000001'::uuid, null::uuid, 'Sara',
   'Pour moi, un roll-on dilué avec de l''huile essentielle de lavande sur les poignets, associé à deux ou trois respirations lentes, a vraiment aidé. Je n''applique jamais d''huile pure sur la peau.',
   true, '2026-07-10T12:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000001'::uuid, null, 'La Sage (exemple)',
   'Pour l''anxiété du quotidien, commence simplement : diffuse 3 à 4 gouttes de lavande le soir, ou prépare un roll-on (5 ml d''huile végétale + une dizaine de gouttes de lavande). Teste pendant trois soirs et note ton niveau de tension.',
   true, '2026-07-11T09:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000001'::uuid, null, 'Inès',
   'J''ai aussi réduit le café après 14 h et ajouté cinq minutes de cohérence cardiaque. L''huile aide, et le combo avec la respiration fonctionne encore mieux chez moi.',
   true, '2026-07-11T15:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000002'::uuid, null, 'Leila',
   'La 4-7-8 m''a aidée : inspire 4, retiens 7, expire 8, ×4. Dans le noir, sans regarder l''heure si je me réveille.',
   true, '2026-07-12T11:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000002'::uuid, null, 'Nora',
   'Essaie aussi d''expirer plus longtemps que tu n''inspires (par exemple 4 secondes d''inspiration et 6 d''expiration), allongée sur le côté. Sortir le téléphone de la chambre a aussi beaucoup changé mes nuits.',
   true, '2026-07-13T10:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000002'::uuid, null, 'La Sage (exemple)',
   'Pour le nerf vague : cinq minutes de respiration ventrale lente, ou un soupir physiologique (double inspiration puis longue expiration). Tu peux diffuser de la lavande le soir et tenir un rituel fixe trente minutes avant le lit.',
   true, '2026-07-13T16:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000003'::uuid, null, 'Maya',
   'Protéines le matin (œufs / yaourt / amandes) + collations salées m''ont calmé les fringales. Le café seul à jeun empire chez moi.',
   true, '2026-07-14T12:00:00Z'::timestamptz),
  ('a1000000-0000-4000-8000-000000000003'::uuid, null, 'La Sage (exemple)',
   'Stabilise la glycémie : protéines à chaque repas, marche 10 min après le déjeuner, eau avant de grignoter. Teste 7 jours et note énergie /10 à 15h.',
   true, '2026-07-15T09:00:00Z'::timestamptz)
) as v(post_id, user_id, author_name, content, is_seed, created_at)
where not exists (select 1 from public.forum_replies where is_seed = true limit 1);
