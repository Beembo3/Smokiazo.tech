"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonIcon } from "@ionic/react";
import {
  businessOutline,
  chatbubbleEllipsesOutline,
  checkmarkCircle,
  chevronForwardOutline,
  ellipsisHorizontalOutline,
  gridOutline,
  peopleOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";
import {
  AppHeader,
  ArrowUpRight,
  Button,
  Hero,
  Pill,
  SectionHead,
} from "@/components/ui";
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

  const openDirectory = () => {
    document
      .getElementById("user-directory")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading || !session || session.role !== "admin") {
    return (
      <div className="app">
        <AppHeader badge="Admin access" />
        <main className="screen" aria-busy="true">
          <p className="pad mt-16 small muted">Checking administrator access…</p>
        </main>
      </div>
    );
  }

  const admins = users.filter((user) => user.role === "admin").length;
  const verified = users.filter((user) => user.verified).length;
  const total = users.length;

  return (
    <div className="app">
      <AppHeader
        badge={
          <>
            <IonIcon icon={shieldCheckmarkOutline} aria-hidden="true" />
            Admin access
          </>
        }
      />

      <main className="screen screen--tabbed">
        <Hero page eyebrow="Cabanatuan · Admin workspace" title="Admin overview" />

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
                <p className="stat__value">{loadingUsers ? "…" : total}</p>
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
                : `${total - verified} account${total - verified === 1 ? "" : "s"} still waiting for email verification.`}
            </p>
          </div>

          <div className="full-button mt-12">
            <Button variant="brand" onClick={openDirectory}>
              Open user directory · {loadingUsers ? "…" : total}
              <ArrowUpRight size={13} />
            </Button>
          </div>

          <section className="mt-20">
            <SectionHead label="Admin tools" />
            <div className="card card--flush list-card">
              <button type="button" className="row" onClick={openDirectory}>
                <span className="row__main admin-row">
                  <span className="icon-tile icon-tile--sm" aria-hidden="true">
                    <IonIcon icon={peopleOutline} />
                  </span>
                  <span>
                    <span className="row__title" style={{ display: "block" }}>
                      User directory
                    </span>
                    <span className="row__sub" style={{ display: "block" }}>
                      Names, emails, roles and verification state
                    </span>
                  </span>
                </span>
                <IonIcon
                  icon={chevronForwardOutline}
                  className="row__chevron"
                  aria-hidden="true"
                />
              </button>

              <Link href="/branch" className="row">
                <span className="row__main admin-row">
                  <span className="icon-tile icon-tile--sm" aria-hidden="true">
                    <IonIcon icon={businessOutline} />
                  </span>
                  <span>
                    <span className="row__title" style={{ display: "block" }}>
                      Branch profile
                    </span>
                    <span className="row__sub" style={{ display: "block" }}>
                      Approved Cabanatuan details and draft preview
                    </span>
                  </span>
                </span>
                <IonIcon
                  icon={chevronForwardOutline}
                  className="row__chevron"
                  aria-hidden="true"
                />
              </Link>

              <Link href="/help" className="row">
                <span className="row__main admin-row">
                  <span className="icon-tile icon-tile--sm" aria-hidden="true">
                    <IonIcon icon={chatbubbleEllipsesOutline} />
                  </span>
                  <span>
                    <span className="row__title" style={{ display: "block" }}>
                      Support &amp; help
                    </span>
                    <span className="row__sub" style={{ display: "block" }}>
                      Report an issue or review branch assistance
                    </span>
                  </span>
                </span>
                <IonIcon
                  icon={chevronForwardOutline}
                  className="row__chevron"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>

          <section className="mt-20" id="user-directory">
            <SectionHead
              label="User directory"
              aside={
                <button
                  type="button"
                  className="summary__edit"
                  onClick={() => {
                    void loadUsers();
                  }}
                  disabled={loadingUsers}
                >
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
                  const isSelf = user.id === session.userId;
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
              Accounts are created through sign-up and confirmed by email.
              Creating or deleting auth users must go through the Supabase
              dashboard or a trusted server, not the browser.
            </p>
          </section>

          <p className="tiny mt-16" style={{ paddingInline: 2 }}>
            Signed in as {session.email}. Roles can only be changed by a database
            administrator.
          </p>

          <div className="full-button mt-12">
            <Button variant="outline" onClick={() => { void logout(); }}>
              Sign out
            </Button>
          </div>
        </div>
      </main>

      <nav className="tabbar" aria-label="Admin">
        <Link href="/manage" className="tab" aria-current="page">
          <IonIcon icon={gridOutline} aria-hidden="true" />
          Overview
        </Link>
        <button type="button" className="tab" onClick={openDirectory}>
          <IonIcon icon={peopleOutline} aria-hidden="true" />
          Directory
        </button>
        <Link href="/help" className="tab">
          <IonIcon icon={chatbubbleEllipsesOutline} aria-hidden="true" />
          Support
        </Link>
        <Link href="/account" className="tab">
          <IonIcon icon={ellipsisHorizontalOutline} aria-hidden="true" />
          More
        </Link>
      </nav>
    </div>
  );
}
