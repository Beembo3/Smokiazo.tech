"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IonIcon, IonToast, IonToggle } from "@ionic/react";
import { chevronForwardOutline, personOutline } from "ionicons/icons";
import { Button, Hero, Pill } from "@/components/ui";
import { useSession } from "@/lib/use-session";
import { STORAGE_KEYS, usePersistentState } from "@/lib/use-persistent-state";

function initials(name: string | null, email: string | null) {
  const source = (name || email || "Staff").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export default function StaffAccountPage() {
  const router = useRouter();
  const { session, signOut } = useSession();
  const [notifications, setNotifications] = usePersistentState<boolean>(
    STORAGE_KEYS.notifications,
    true,
  );
  const [toast, setToast] = useState("");

  const name = session?.name || "Current staff member";
  const email = session?.email || "authorized account";

  const logout = async () => {
    try {
      await signOut();
      router.replace("/admin");
      router.refresh();
    } catch {
      setToast("Unable to sign out.");
    }
  };

  return (
    <main className="screen screen--tabbed">
      <Hero
        page
        eyebrow="Staff settings · Demo profile"
        title="Account & access"
      />

      <div className="section mt-12">
        <div className="card">
          <div className="account-profile">
            <span className="avatar" aria-hidden="true">
              {initials(session?.name ?? null, session?.email ?? null)}
            </span>
            <div>
              <p className="card__title">{name}</p>
              <p className="small muted">{email}</p>
            </div>
          </div>
          <div className="staff-status-row mt-12">
            <Pill>Agent</Pill>
            <span className="tiny">Branch scope: Cabanatuan City, Nueva Ecija</span>
          </div>
        </div>

        <div className="card mt-12">
          <p className="kicker">Permissions · Assigned, not self-selected</p>
          <div className="meta-block">
            <p className="meta-block__title">Agent</p>
            <p className="small muted mt-8">
              Review, assign and reply to branch requests. View approved branch
              information.
            </p>
          </div>
          <div className="meta-block">
            <p className="meta-block__title">Manager</p>
            <p className="small muted mt-8">
              Agent permissions, plus verified branch publishing and access
              management through an authorized process.
            </p>
          </div>
        </div>

        <div className="card mt-12">
          <div className="toggle-row">
            <span>
              <span className="row__title" style={{ display: "block" }}>
                Request notifications
              </span>
              <span className="row__sub" style={{ display: "block" }}>
                {notifications ? "On" : "Off"} · in-app preference only
              </span>
            </span>
            <IonToggle
              mode="md"
              checked={notifications}
              aria-label="Request notifications"
              onIonChange={(event) => setNotifications(event.detail.checked)}
            />
          </div>
          <p className="tiny mt-12">
            No customer details in notification previews.
          </p>
        </div>

        <Link href="/forgot-password" className="account-link">
          <IonIcon icon={personOutline} aria-hidden="true" />
          Account recovery
          <IonIcon
            icon={chevronForwardOutline}
            className="row__chevron"
            aria-hidden="true"
          />
        </Link>

        <div className="full-button mt-12">
          <Button variant="outline" onClick={() => void logout()}>
            Sign out
          </Button>
        </div>

        <p className="tiny mt-12">
          Need access changed? Contact your authorized manager. Roles cannot be
          switched here.
        </p>
      </div>

      <IonToast
        mode="md"
        isOpen={Boolean(toast)}
        message={toast}
        duration={2200}
        position="bottom"
        onDidDismiss={() => setToast("")}
      />
    </main>
  );
}
