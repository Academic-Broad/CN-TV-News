-- Run this SQL in your Supabase SQL Editor to create the articles table.
-- Go to: https://supabase.com/dashboard → your project → SQL Editor → paste & run.

create table if not exists articles (
  id          uuid primary key default gen_random_uuid(),
  title       text        not null,
  slug        text        not null unique,
  category    text        not null,
  content     text        not null default '',
  summary     text        not null default '',
  image       text        not null default '',
  status      text        not null default 'draft' check (status in ('draft', 'published')),
  author_id   text        not null default 'admin',
  tags        text[]      not null default '{}',
  view_count  integer     not null default 0,
  is_breaking boolean     not null default false,
  is_featured boolean     not null default false,
  published_at timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_articles_slug        on articles (slug);
create index if not exists idx_articles_category    on articles (category);
create index if not exists idx_articles_status      on articles (status);
create index if not exists idx_articles_published_at on articles (published_at desc);
create index if not exists idx_articles_view_count  on articles (view_count desc);

-- Optional: auto-update updated_at on row change
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger articles_updated_at
  before update on articles
  for each row
  execute function update_updated_at();
