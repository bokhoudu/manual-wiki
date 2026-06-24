create extension if not exists pgcrypto;

create table if not exists public.manuals (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  brand text not null,
  model_name text,
  category text,
  manual_url text,
  summary_ko text,
  quick_guide text[],
  troubleshooting jsonb,
  translation_status text default 'draft',
  status text default 'pending',
  contributor_id uuid references auth.users(id) on delete set null,
  contributor_email text,
  contributor_nickname text,
  created_at timestamp with time zone default now()
);

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  manual_id uuid references public.manuals(id) on delete cascade,
  type text,
  content text,
  contributor_id uuid references auth.users(id) on delete set null,
  contributor_email text,
  status text default 'pending',
  created_at timestamp with time zone default now()
);

alter table public.manuals enable row level security;
alter table public.suggestions enable row level security;

create policy "Anyone can read manuals"
  on public.manuals for select
  using (true);

create policy "Authenticated users can create pending manuals"
  on public.manuals for insert
  to authenticated
  with check (
    auth.uid() = contributor_id
    and coalesce(status, 'pending') = 'pending'
  );

create policy "Users can read own suggestions"
  on public.suggestions for select
  using (auth.uid() = contributor_id);

create policy "Authenticated users can create pending suggestions"
  on public.suggestions for insert
  to authenticated
  with check (
    auth.uid() = contributor_id
    and coalesce(status, 'pending') = 'pending'
  );

create index if not exists manuals_created_at_idx on public.manuals (created_at desc);
create index if not exists manuals_brand_idx on public.manuals (brand);
create index if not exists manuals_category_idx on public.manuals (category);
create index if not exists suggestions_manual_id_idx on public.suggestions (manual_id);
