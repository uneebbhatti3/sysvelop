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

-- Admin auth tables (user, session, account, verification) belong to Better Auth
-- and are created by `npm run db:migrate` from src/lib/auth-config.ts, not from this file.
-- The hand-rolled session table they replace:
drop table if exists admin_sessions;
-- Two-factor authentication was removed (owner decision, Nov 2026); drop what it created.
drop table if exists "twoFactor";
alter table if exists "user" drop column if exists "twoFactorEnabled";
