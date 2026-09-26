-- Run this in the Supabase Dashboard -> SQL Editor.

create table if not exists public.requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  category    text not null check (category in ('complaint', 'maintenance')),
  message     text not null check (char_length(message) > 0),
  status      text not null default 'open' check (status in ('open', 'closed')),
  created_at  timestamptz not null default now()
);

alter table public.requests enable row level security;

-- Users can read only their own requests.
create policy "Users can view own requests"
  on public.requests for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create requests only for themselves.
create policy "Users can insert own requests"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = user_id);

-- No update/delete policies: closing a request (status = 'closed') is done
-- by an admin in the Supabase dashboard or with the service_role key server-side.
