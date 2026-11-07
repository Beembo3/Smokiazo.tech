-- Keep public.users in sync with auth.users, and lock down writable columns.
-- Safe to run more than once.

-- When a user confirms their email or changes it, mirror it onto the profile.
create or replace function public.sync_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
     set email = new.email,
         verified = (new.email_confirmed_at is not null)
   where id = new.id;
  return new;
end
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row execute function public.sync_user_profile();

-- Users may only edit their display name. Email, role and verified are
-- maintained by the auth sync trigger or by a trusted database administrator.
revoke update on public.users from authenticated;
grant update (name) on public.users to authenticated;
