"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonIcon, IonToast, IonToggle } from "@ionic/react";
import { chevronForwardOutline } from "ionicons/icons";
import { AppHeader, BackLink, Hero, StickyActions } from "@/components/ui";
import { TextField } from "@/components/form";
import { useSession } from "@/lib/use-session";
import { STORAGE_KEYS, usePersistentState } from "@/lib/use-persistent-state";

export default function AccountPage() {
  const router = useRouter();
  const { session, signOut, updateProfile } = useSession();
  const [notifications, setNotifications] = usePersistentState<boolean>(
    STORAGE_KEYS.notifications,
    true,
  );
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState("");

  const profile = session ?? {
    name: "Alex D.",
    email: "alex@example.com",
    verified: false,
  };

  const startEditing = () => {
    setName(profile.name);
    setEmail(profile.email);
    setEditing(true);
  };

  const saveProfile = () => {
    updateProfile(name.trim() || profile.name, email.trim() || profile.email);
    setEditing(false);
    setToast("Profile updated (demo).");
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/" />
        <Hero page eyebrow="Optional account · Demo profile" title="Account & privacy" />

        <p className="small muted pad mt-12">
          An account is optional. Track and request a quote without signing in.
        </p>

        <div className="pad mt-12">
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="kicker">Profile</span>
              <button type="button" className="summary__edit" onClick={startEditing}>
                Edit
              </button>
            </div>

            <p className="value" style={{ marginTop: 4 }}>
              {profile.name}
            </p>
            <p className="small muted" style={{ marginTop: 1 }}>
              {profile.email}
            </p>

            <div className="divider mt-16" />

            <Link href="/verify-email" className="row">
              <span className="row__main">
                <span className="row__title" style={{ display: "block", fontWeight: 700 }}>
                  {profile.verified ? "Email verified" : "Email not verified"}
                </span>
                <span className="row__sub" style={{ display: "block" }}>
                  {profile.verified
                    ? "Your account email is verified."
                    : "Send or manage verification email"}
                </span>
              </span>
              <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
            </Link>

            <Link href="/requests" className="row">
              <span className="row__title">My requests</span>
              <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
            </Link>
          </div>

          <div className="card mt-12">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span>
                <span className="row__title" style={{ display: "block" }}>
                  Request update emails
                </span>
                <span className="row__sub" style={{ display: "block" }}>
                  {notifications ? "On" : "Off"} · no promotional emails
                </span>
              </span>
              <IonToggle mode="md"
                checked={notifications}
                aria-label="Request update emails"
                onIonChange={(event) => setNotifications(event.detail.checked)}
              />
            </div>
            <p className="kicker" style={{ marginTop: 14 }}>
              Notification preferences
            </p>
          </div>

          <div className="card mt-12">
            <Link href="/forgot-password" className="row">
              <span className="row__main">
                <span className="row__title" style={{ display: "block" }}>
                  Password recovery
                </span>
                <span className="row__sub" style={{ display: "block" }}>
                  Send a reset link to your email
                </span>
              </span>
              <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
            </Link>

            <Link href="/legal/privacy" className="row">
              <span className="row__main">
                <span className="row__title" style={{ display: "block" }}>
                  Privacy Policy
                </span>
                <span className="row__sub" style={{ display: "block" }}>
                  Draft · approval required before launch
                </span>
              </span>
              <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
            </Link>

            <Link href="/legal/terms" className="row">
              <span className="row__main">
                <span className="row__title" style={{ display: "block" }}>
                  Terms &amp; Conditions
                </span>
                <span className="row__sub" style={{ display: "block" }}>
                  Draft · approval required before launch
                </span>
              </span>
              <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
            </Link>
          </div>

          <div className="full-button mt-16">
            <button
              type="button"
              className="row"
              style={{ justifyContent: "center", border: "1px solid var(--line-2)", borderRadius: 12, background: "var(--surface)", minHeight: 46, fontWeight: 600, fontSize: 13 }}
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              Sign out
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button
              type="button"
              className="summary__edit"
              onClick={() => setConfirmDelete(true)}
            >
              Delete account ›
            </button>
          </div>

          <p className="tiny mt-12" style={{ textAlign: "center" }}>
            Deletion opens a separate confirmation. Review data effects and
            confirm your identity before continuing.
          </p>

          <p className="tiny mt-16" style={{ textAlign: "center" }}>
            <Link href="/screens" className="link">
              Demo screen index
            </Link>
          </p>
        </div>
      </main>

      <StickyActions back={{ href: "/" }} primary={{ label: "Back to home", href: "/" }} />

      {editing ? (
        <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-label="Edit profile">
          <div className="sheet">
            <p className="sheet__title">Edit profile</p>
            <TextField label="Full name" value={name} onChange={setName} />
            <TextField
              label="Email address"
              value={email}
              onChange={setEmail}
              type="email"
              inputMode="email"
            />
            <p className="sheet__text">
              Changing your email returns you to verification in the real app.
            </p>
            <div className="sheet__actions">
              <button
                type="button"
                className="row"
                style={{ justifyContent: "center", border: "1px solid var(--line-2)", borderRadius: 12, minHeight: 46 }}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ flex: 1, border: 0, borderRadius: 12, background: "var(--brand)", color: "#fff", fontWeight: 700, minHeight: 46, fontSize: 13 }}
                onClick={saveProfile}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDelete ? (
        <div className="sheet-backdrop" role="dialog" aria-modal="true" aria-label="Delete account">
          <div className="sheet">
            <p className="sheet__title">Delete account?</p>
            <p className="sheet__text">
              This demo removes the local profile only. In production, deletion
              needs recent identity confirmation, an explicit final action, and a
              clear explanation of what is deleted versus retained.
            </p>
            <div className="sheet__actions">
              <button
                type="button"
                className="row"
                style={{ justifyContent: "center", border: "1px solid var(--line-2)", borderRadius: 12, minHeight: 46 }}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{ flex: 1, border: 0, borderRadius: 12, background: "var(--ink)", color: "#fff", fontWeight: 700, minHeight: 46, fontSize: 13 }}
                onClick={() => {
                  setConfirmDelete(false);
                  signOut();
                  setToast("Account deleted (demo).");
                  router.push("/");
                }}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <IonToast mode="md"
        isOpen={Boolean(toast)}
        message={toast}
        duration={2200}
        position="bottom"
        onDidDismiss={() => setToast("")}
      />
    </div>
  );
}

