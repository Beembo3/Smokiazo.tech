-- Profiles table for 2GO Express, keyed to Supabase Auth users.
-- Safe to run more than once.

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- SECURITY DEFINER so the RLS policy below can read this table without recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "read own profile" on public.users;
create policy "read own profile"
  on public.users for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "update own profile" on public.users;
create policy "update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No INSERT policy on purpose: rows are created by the trigger below.
-- No DELETE policy: accounts are removed through the Auth admin API.

-- Users may edit their profile, but never their own role.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and new.role is distinct from old.role then
    raise exception 'Only a database administrator can change a role';
  end if;
  return new;
end
$$;

drop trigger if exists users_protect_role on public.users;
create trigger users_protect_role
  before update on public.users
  for each row execute function public.prevent_role_escalation();

-- Create the profile row on signup. Required because email confirmation is on,
-- so the client has no session yet and its own INSERT would be blocked by RLS.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, name, role, verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', 'User'),
    'user',
    new.email_confirmed_at is not null
  )
  on conflict (id) do nothing;
  return new;
end
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
