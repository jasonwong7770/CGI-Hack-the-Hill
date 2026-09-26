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

create or replace function public.create_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role) values (new.id, 'customer')
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

drop policy if exists "Employees can view all requests" on public.requests;
create policy "Employees can view all requests"
  on public.requests for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'employee'
    )
  );

drop policy if exists "Users can insert own requests" on public.requests;
create policy "Users can insert own requests"
  on public.requests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Employees can close requests" on public.requests;
create policy "Employees can close requests"
  on public.requests for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'employee'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'employee'
    )
  );

revoke update on public.requests from authenticated;
grant update (status) on public.requests to authenticated;

-- To promote an existing trusted account to employee, run this as a Supabase
-- administrator after replacing the email address:
-- update public.profiles
-- set role = 'employee'
-- where id = (select id from auth.users where email = 'staff@example.com');
