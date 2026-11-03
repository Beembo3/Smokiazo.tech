"use client";

import { useState } from "react";
import Link from "next/link";
import { IonIcon, IonToast } from "@ionic/react";
import { chevronForwardOutline, mailOpenOutline } from "ionicons/icons";
import { Button, Pill } from "@/components/ui";
import { AuthShell } from "@/components/auth";
import { useSession } from "@/lib/use-session";

export default function VerifyEmailPage() {
  const { session } = useSession();
  const [toast, setToast] = useState(false);
  const email = session?.email ?? "alex@example.com";

  return (
    <AuthShell
      headline={
        <>
          One more step.
          <br />
          Verify your email.
        </>
      }
      sub="Email verification is for your optional account. You can still track and request a quote as a guest."
      footer={
        <Link href="/login" className="link">
          ‹ Return to Sign in
        </Link>
      }
    >
      <div className="auth__card">
        <Pill>Verification sent · demo</Pill>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <span className="icon-tile">
            <IonIcon icon={mailOpenOutline} aria-hidden="true" />
          </span>
          <h2 className="auth__title" style={{ fontSize: 21 }}>
            Check your inbox
          </h2>
        </div>

        <p className="value" style={{ marginTop: 12 }}>
          a•••@example.com
        </p>
        <p className="auth__sub" style={{ marginTop: 6 }}>
          Follow the link in the verification email sent to {email}, then return to
          Sign in. Check your spam folder if needed.
        </p>

        <div className="full-button mt-16">
          <Button variant="brand" onClick={() => setToast(true)}>
            Resend verification email
          </Button>
        </div>

        <Link href="/account" className="row mt-12">
          <span className="row__title">Change email address</span>
          <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
        </Link>
      </div>

      <p className="auth__legal">
        Illustrative sent state only. Email delivery and verification depend on the
        configured provider.
      </p>

      <IonToast mode="md"
        isOpen={toast}
        message="Verification email resent (demo)."
        duration={2200}
        position="bottom"
        onDidDismiss={() => setToast(false)}
      />
    </AuthShell>
  );
}

