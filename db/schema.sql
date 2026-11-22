-- Sysvelop contact backend. Idempotent: safe to run more than once (npm run db:migrate).

create table if not exists enquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 254),
  company     text not null default '' check (char_length(company) <= 120),
  need        text not null,
  message     text not null check (char_length(message) between 1 and 4000),
  status      text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

-- Email notifications were removed; drop the column from databases created before that.
alter table enquiries drop column if exists emailed;

create index if not exists enquiries_created_at_idx on enquiries (created_at desc);

-- Sliding-window rate limit for admin login attempts. Keys are HMAC hashes, never raw IPs.
create table if not exists rate_limit_hits (
  key     text not null,
  hit_at  timestamptz not null default now()
);

create index if not exists rate_limit_hits_key_idx on rate_limit_hits (key, hit_at);

-- Content managed from the admin dashboard. The shape of `data` is validated by
-- src/lib/content-schema.ts. `version` detects two tabs editing the same item.
create table if not exists case_studies (
  id            uuid primary key default gen_random_uuid(),
  published     boolean not null default false,
  position      serial,
  version       int not null default 0,
  updated_at    timestamptz not null default now(),
  data          jsonb not null check (jsonb_typeof(data) = 'object'),
  image         bytea check (octet_length(image) <= 716800),
  image_id      uuid unique,
  image_width   int,
  image_height  int,
  check (num_nulls(image, image_id, image_width, image_height) in (0, 4))
);

create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  published   boolean not null default false,
  position    serial,
  version     int not null default 0,
  updated_at  timestamptz not null default now(),
  data        jsonb not null check (jsonb_typeof(data) = 'object')
);

-- Testimonials, added in the dashboard or sent by clients through the share link.
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  source      text not null check (source in ('client', 'manual')),
  name        text not null,
  role        text not null default '',
  company     text not null default '',
  quote       text not null
);
-- Nothing is public until the owner publishes it.
alter table testimonials add column if not exists published boolean not null default false;

-- At most one share link. No row means it is turned off.
create table if not exists testimonial_link (
  id     boolean primary key default true check (id),
  token  text not null
);

-- Records one-time seeds, so re-running the migration never restores deleted content.
create table if not exists content_seeds (
  key         text primary key,
  applied_at  timestamptz not null default now()
);

-- Admin auth tables (user, session, account, verification) belong to Better Auth
-- and are created by `npm run db:migrate` from src/lib/auth-config.ts, not from this file.
-- The hand-rolled session table they replace:
drop table if exists admin_sessions;
-- Two-factor authentication was removed (owner decision, Nov 2026); drop what it created.
drop table if exists "twoFactor";
alter table if exists "user" drop column if exists "twoFactorEnabled";
