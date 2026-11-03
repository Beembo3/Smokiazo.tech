"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useSession } from "@/lib/use-session";
import { getSupabase } from "@/lib/supabase";

type ManagedUser = { id: string; email: string | null; name: string | null; role: string };

export default function ManagePage() {
  const router = useRouter();
  const { session, isLoading, signOut } = useSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [error, setError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const { data, error: queryError } = await getSupabase()
        .from("users")
        .select("id, email, name, role")
        .order("email", { ascending: true });
      if (queryError) throw queryError;
      setUsers((data ?? []) as ManagedUser[]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load users.");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!session || session.role !== "admin") {
      router.replace("/admin");
      return;
    }
    void loadUsers();
  }, [isLoading, session?.role, session?.userId, router, loadUsers]);

  const logout = async () => {
    try {
      await signOut();
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign out.");
    }
  };

  if (isLoading || !session || session.role !== "admin") {
    return <main className="screen" aria-busy="true">Checking administrator access…</main>;
  }

  return (
    <main className="screen">
      <div className="header-bar">
        <h1 className="page-title">Admin Panel</h1>
      </div>
      <div className="admin-content mt-16">
        <h2>Registered Users</h2>
        <p className="small muted mt-8">Signed in as {session.email}. Accounts and roles are stored in Supabase.</p>
        <div className="mt-12">
          <Button variant="outline" onClick={() => { void loadUsers(); }} disabled={loadingUsers}>Refresh Users</Button>
        </div>
        {error && <p role="alert" className="field__error mt-12">{error}</p>}
        {loadingUsers ? <p className="mt-12">Loading users…</p> : (
          <div className="users-list mt-12">
            {users.length ? users.map((user) => (
              <div key={user.id} className="user-item">
                <span><strong>{user.name || user.email || "Unnamed user"}</strong><br />{user.email || "No email"} · {user.role}</span>
              </div>
            )) : <p className="empty-state">No users found. Check the Supabase users table and admin read policy.</p>}
          </div>
        )}
        <p className="tiny mt-12">For security, creating and deleting authentication accounts must be done through a trusted server or the Supabase dashboard, not directly from the browser.</p>
      </div>
      <div className="mt-24">
        <Button variant="outline" onClick={() => { void logout(); }}>Sign Out</Button>
      </div>
    </main>
  );
}
