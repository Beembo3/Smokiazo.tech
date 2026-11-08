"use client";

import { useCallback, useEffect, useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  checkmarkCircle,
  peopleOutline,
  refreshOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";
import { BackLink, Button, Hero, Pill, SectionHead } from "@/components/ui";
import { useSession } from "@/lib/use-session";
import { getSupabase } from "@/lib/supabase";

type ManagedUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  verified: boolean | null;
  created_at: string | null;
};

function initials(user: ManagedUser) {
  const source = (user.name || user.email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function joinedLabel(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-PH", { month: "short", year: "numeric" });
}

export default function StaffDirectoryPage() {
  const { session } = useSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [error, setError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setError("");
    try {
      const { data, error: queryError } = await getSupabase()
        .from("users")
        .select("id, email, name, role, verified, created_at")
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
    void loadUsers();
  }, [loadUsers]);

  const admins = users.filter((user) => user.role === "admin").length;
  const verified = users.filter((user) => user.verified).length;

  return (
    <main className="screen screen--tabbed">
      <BackLink href="/manage/more" label="More" />
      <Hero page eyebrow="Admin tools · Demo" title="User directory" />

      <div className="section mt-12">
        <div className="card">
          <p className="kicker">Registered accounts</p>
          <p className="small muted mt-8">
            Live snapshot of every profile stored in Supabase. Roles and access
            are assigned by a trusted database administrator, never from the
            sign-up form.
          </p>

          <div className="stats mt-12">
            <div className="stat">
              <p className="stat__value">{loadingUsers ? "…" : users.length}</p>
              <p className="stat__label">Accounts</p>
            </div>
            <div className="stat">
              <p className="stat__value">{loadingUsers ? "…" : admins}</p>
              <p className="stat__label">Admins</p>
            </div>
            <div className="stat">
              <p className="stat__value">{loadingUsers ? "…" : verified}</p>
              <p className="stat__label">Verified</p>
            </div>
          </div>

          <p className="tiny mt-12">
            {loadingUsers
              ? "Loading records from Supabase…"
              : `${users.length - verified} account${users.length - verified === 1 ? "" : "s"} still waiting for email verification.`}
          </p>
        </div>

        <section className="mt-20">
          <SectionHead
            label="Directory"
            aside={
              <button
                type="button"
                className="summary__edit"
                onClick={() => {
                  void loadUsers();
                }}
                disabled={loadingUsers}
              >
                <IonIcon icon={refreshOutline} aria-hidden="true" />{" "}
                {loadingUsers ? "Refreshing…" : "Refresh"}
              </button>
            }
          />

          {error ? (
            <p role="alert" className="field__error mt-8">
              {error}
            </p>
          ) : null}

          <div className="card card--flush list-card">
            {loadingUsers && !users.length ? (
              <p className="small muted" style={{ padding: "14px 0" }}>
                Loading accounts…
              </p>
            ) : users.length ? (
              users.map((user) => {
                const isSelf = user.id === session?.userId;
                return (
                  <div key={user.id} className="row">
                    <span className="row__main admin-row">
                      <span className="avatar" aria-hidden="true">
                        {initials(user)}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span className="user-line">
                          <span className="row__title">
                            {user.name || user.email || "Unnamed account"}
                          </span>
                          {isSelf ? <span className="user-you">You</span> : null}
                        </span>
                        <span className="row__sub" style={{ display: "block" }}>
                          {user.email || "No email"}
                          {joinedLabel(user.created_at)
                            ? ` · joined ${joinedLabel(user.created_at)}`
                            : ""}
                        </span>
                      </span>
                    </span>
                    <span className="user-tags">
                      {user.verified ? (
                        <IonIcon
                          icon={checkmarkCircle}
                          className="user-verified"
                          aria-label="Email verified"
                        />
                      ) : null}
                      <Pill tone={user.role === "admin" ? "brand" : "muted"}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </Pill>
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="empty-state" style={{ padding: "14px 0" }}>
                No accounts found yet. New sign-ups appear here once their
                profile row exists in Supabase.
              </p>
            )}
          </div>

          <p className="tiny mt-12">
            Accounts are created through sign-up and confirmed by email. Creating
            or deleting auth users must go through the Supabase dashboard or a
            trusted server, not the browser.
          </p>
        </section>

        <div className="full-button mt-12">
          <Button variant="outline" href="/manage/more">
            <IonIcon icon={peopleOutline} aria-hidden="true" />
            More staff tools
          </Button>
        </div>

        <p className="tiny mt-12">
          <IonIcon icon={shieldCheckmarkOutline} aria-hidden="true" /> Directory
          reads are limited to authenticated administrators.
        </p>
      </div>
    </main>
  );
}
