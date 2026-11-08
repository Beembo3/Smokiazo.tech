# Supabase Admin Account Setup Guide

This guide walks you through creating an admin account in Supabase so that the `/admin` → `/manage` flow works.

## Prerequisites
- Supabase project configured with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The `supabase/migrations/` files already applied (see `AUTH_SETUP.md`)

## Step 1: Apply Database Migrations
Run each migration in the Supabase SQL Editor (or via `supabase db push`):

**Migration 1:** `20261107000000_create_users.sql`
**Migration 2:** `20261107000001_sync_and_harden_users.sql`

These create the `public.users` table, RLS policies, the `is_admin()` function, and triggers.

## Step 2: Create a Supabase Auth User
Go to **Supabase Dashboard → Authentication → Users → Add user**:

- **Email:** `admin@2go.com` (or your preferred admin email)
- **Password:** `admin123` (or any secure password — the user will reset it)
- **Confirm email:** Checked

Alternatively, use the Supabase Admin API or `supabase auth signup`.

## Step 3: Assign the Admin Role via SQL
This is the critical step. The `users_protect_role` trigger blocks any client-side role changes. You must run SQL as a database administrator:

```sql
-- Find the user's profile ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@2go.com';

-- Then update the public.users table role
UPDATE public.users SET role = 'admin' WHERE id = '<USER_ID_FROM_STEP_2>';

-- Example (replace the ID):
UPDATE public.users SET role = 'admin' WHERE id = '00000000-0000-0000-0000-000000000000';
```

Or in a single SQL statement:

```sql
UPDATE public.users 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@2go.com');
```

## Step 4: Verify the Setup
1. **Sign out** of any existing Supabase session
2. **Visit** `http://localhost:3000/admin`
3. **Sign in** with:
   - Email: `admin@2go.com`
   - Password: `admin123`
4. **You should be redirected** to `http://localhost:3000/manage`
5. The staff workspace should load with all 10 demo screens visible

## Step 5: Optional — Change the Default Password
After signing in for the first time, the user should:
1. Go to `/forgot-password` or use Supabase Auth dashboard
2. Set a new secure password
3. The `verified` flag auto-sets when email confirmation completes

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| `/admin` shows "Checking staff access…" then redirects to `/admin` | `users` table not migrated or RLS not enabled | Re-run both migrations in SQL Editor |
| "Invalid login" after signing in | Password incorrect, or user not confirmed | Reset password via Supabase Dashboard; ensure email is confirmed |
| `/manage` shows "Checking staff access…" then blank | `role` not set to `'admin'` in `public.users` | Run the `UPDATE public.users SET role = 'admin'` SQL |
| Users can change their own role to `admin` | `prevent_role_escalation()` trigger not active | Ensure migration 1 ran completely; the trigger blocks ALL role changes except via SQL Editor/service-role API |

## Quick SQL Reference

```sql
-- Verify current state
SELECT id, email, role, verified FROM public.users WHERE email = 'admin@2go.com';

-- Make admin (run once)
UPDATE public.users SET role = 'admin' WHERE email = 'admin@2go.com';

-- Verify it stuck
SELECT id, email, role FROM public.users WHERE email = 'admin@2go.com';
```

## Security Reminder
- ⛔ Never expose `service-role` key in the browser
- ⛔ The `role` column has `check (role in ('user', 'admin'))` — only `'user'` or `'admin'` allowed
- ⛔ The `prevent_role_escalation()` trigger blocks ALL role changes from the client
- ✅ Only database administrators (SQL Editor or service-role) can change roles
- ✅ The `is_admin()` function is used by `proxy.ts` RLS policies

## After Setup
- Sign in at `/admin` with the admin credentials
- `/manage` should display the full staff workspace
- All 10 staff screens are accessible: overview, inbox, detail, reply, support, lookup, branch profile, account, more, directory
- Sign out, then sign in again to verify the session persists

---
*This guide mirrors the checks in `AUTH_SETUP.md` steps 3–5. If you encounter issues, verify the migrations ran without errors and the `public.users` table has the correct `role` value.*