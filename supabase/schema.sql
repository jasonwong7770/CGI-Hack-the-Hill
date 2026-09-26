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

-- Every new account is a customer by default. Promote trusted staff accounts
-- manually from the Supabase SQL editor (example at the bottom of this file).
create table if not exists public.profiles (
  id   uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'employee'))
);

insert into public.profiles (id, role)
select id, 'customer' from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;
grant select on public.profiles to authenticated;

-- Human-readable identifier for staff/customer management screens. The anon
-- key can't read auth.users directly, so we keep a copy here. This is a
-- point-in-time copy taken at signup; it will not track later email changes
-- in auth.users, which is an accepted limitation for this app's scope.
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is distinct from u.email;

-- Widen the role constraint to add 'manager'. Look up the actual constraint
-- name (e.g. via `\d public.profiles`) if this default name doesn't match.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('customer', 'employee', 'manager'));

create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, email) values (new.id, 'customer', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.create_customer_profile();

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can view own requests" on public.requests;
create policy "Users can view own requests"
  on public.requests for select
  to authenticated
  using (auth.uid() = user_id);

-- Looks up the caller's own role bypassing RLS (security definer), so
-- policies can check "am I an employee/manager?" without re-triggering
-- profiles' own row-level security. Querying public.profiles directly from
-- inside a profiles (or requests) policy causes Postgres to re-evaluate every
-- profiles SELECT policy for the inner query too, including this one, which
-- previously caused "infinite recursion detected in policy for relation
-- profiles" (42P17) on every read once the manager policies were added.
create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

drop policy if exists "Employees can view all requests" on public.requests;
create policy "Employees can view all requests"
  on public.requests for select
  to authenticated
  using (public.current_user_role() in ('employee', 'manager'));

drop policy if exists "Users can insert own requests" on public.requests;
create policy "Users can insert own requests"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Employees can close requests" on public.requests;
create policy "Employees can close requests"
  on public.requests for update
  to authenticated
  using (public.current_user_role() in ('employee', 'manager'))
  with check (public.current_user_role() in ('employee', 'manager'));

revoke update on public.requests from authenticated;
grant update (status) on public.requests to authenticated;

drop policy if exists "Managers can view all profiles" on public.profiles;
create policy "Managers can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.current_user_role() = 'manager');

drop policy if exists "Managers can update other profiles role" on public.profiles;
create policy "Managers can update other profiles role"
  on public.profiles for update
  to authenticated
  using (auth.uid() <> id and public.current_user_role() = 'manager')
  with check (auth.uid() <> id and public.current_user_role() = 'manager');

revoke update on public.profiles from authenticated;
grant update (role) on public.profiles to authenticated;

-- To promote an existing trusted account to employee, run this as a Supabase
-- administrator after replacing the email address:
-- update public.profiles
-- set role = 'employee'
-- where id = (select id from auth.users where email = 'staff@example.com');

-- To promote an existing trusted account to manager, run this as a Supabase
-- administrator after replacing the email address:
-- update public.profiles
-- set role = 'manager'
-- where id = (select id from auth.users where email = 'manager@example.com');
