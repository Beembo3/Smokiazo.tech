# Authentication and admin setup

## Vercel environment variables

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for all deployed environments. Redeploy after saving them. Only use the Supabase **anon/publishable** key in the browser; never expose a service-role key.

## Supabase users table

The app signs in through Supabase Authentication and reads profiles from `public.users` with the following fields:

- `id` (UUID matching `auth.users.id`)
- `email` (text)
- `name` (text)
- `role` (text, `user` or `admin`)

The `/manage` page lists records visible under the active account's RLS policies. Configure RLS so authenticated users can read their own profile, and only trusted administrators can read the user list. Never allow users to edit their own `role`. An administrator role must be assigned by a trusted database administrator; it cannot be granted by the registration form. If the table or policies do not exist, Supabase needs to be configured before admin login can succeed.

**Important:** Protect the `users` table's `role` column against updates by ordinary authenticated users. Database-side authorization is essential even though `/manage` also checks the role in Next.js proxy.

## Database migrations

The schema, RLS policies and triggers live in `supabase/migrations/`:

- `20261107000000_create_users.sql` — `public.users`, RLS (own-profile read/update, admin read-all via `is_admin()`), `users_protect_role` and `on_auth_user_created` triggers
- `20261107000001_sync_and_harden_users.sql` — mirrors `auth.users.email`/`email_confirmed_at` onto the profile (`on_auth_user_updated`) and limits the `authenticated` role to `UPDATE (name)` only

Apply with the Supabase CLI (`supabase db push`) or by pasting each file into the SQL Editor. All statements are idempotent.

## Auth redirect URLs

`Site URL` must be the production origin (`https://smokiazo-tech.vercel.app/`). Add these to **Redirect URLs**: the production origin, the custom domain if used, and `http://localhost:3000/**` for local development.

Email links land on the Site URL with `?code=` / `?token_hash=`, which `proxy.ts` exchanges for a session before the auth gate runs.

## Routes

- `/`: home for authenticated visitors; unauthenticated visitors are redirected to `/login`
- `/login`: real Supabase user login
- `/admin`: real Supabase administrator login (publicly accessible sign-in screen)
- `/manage`: admin-only user listing; protected server-side and client-side

Admin user creation and deletion are intentionally not done in the browser. Use Supabase Dashboard or a trusted server using service-role credentials.

## Checks

1. Open `/` in a private window and verify that it redirects to `/login`.
2. Sign in using a registered user; the homepage should open.
3. Try `/manage` as a normal user; it should redirect to `/admin`.
4. Make an account admin from trusted SQL, sign in at `/admin`, and confirm `/manage` displays users.
5. Sign out, refresh `/manage`, and verify the redirect back to `/admin`.
