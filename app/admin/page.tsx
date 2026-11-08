"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonIcon } from "@ionic/react";
import { shieldCheckmarkOutline } from "ionicons/icons";
import { ArrowUpRight, Button } from "@/components/ui";
import { TextField } from "@/components/form";
import { AuthShell } from "@/components/auth";
import { emailPattern } from "@/lib/demo";
import { useSession } from "@/lib/use-session";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn, signOut } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (loading) return;
    const found: { email?: string; password?: string } = {};
    if (!emailPattern.test(email.trim())) found.email = "Enter a valid email address.";
    if (!password) found.password = "Enter your password.";
    setErrors(found);
    setError("");
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      const account = await signIn(email.trim(), password);
      if (account.role !== "admin") {
        await signOut();
        setError("This account does not have staff access.");
        return;
      }
      router.replace("/manage");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge={
        <>
          <IonIcon icon={shieldCheckmarkOutline} aria-hidden="true" />
          Staff access
        </>
      }
      headline={
        <>
          Branch support,
          <br />
          from here.
        </>
      }
      sub="Review requests and help customers with your authorized branch account."
      footer={
        <Link href="/" className="link">
          ‹ Return to customer app
        </Link>
      }
    >
      <div className="auth__card">
        <h2 className="auth__title">Staff sign in</h2>
        <p className="auth__sub">
          Authorized branch accounts only. No public staff registration.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
          className="stack mt-16"
          style={{ gap: 9 }}
        >
          <TextField
            label="Staff email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setErrors((previous) => ({ ...previous, email: undefined }));
            }}
            type="email"
            inputMode="email"
            error={errors.email}
            autoComplete="email"
            placeholder="Enter authorized email"
          />
          <TextField
            label="Password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((previous) => ({ ...previous, password: undefined }));
            }}
            type="password"
            error={errors.password}
            autoComplete="current-password"
            passwordToggle
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/forgot-password" className="link" style={{ fontSize: 11.5 }}>
              Forgot password?
            </Link>
          </div>
          {error && <p role="alert" className="field__error">{error}</p>}
          <div className="full-button mt-12">
            <Button variant="brand" onClick={() => { void submit(); }} loading={loading}>
              Sign in to staff access <ArrowUpRight size={13} />
            </Button>
          </div>
        </form>

        <p className="tiny mt-12">
          Use account recovery or your authorized manager if you cannot access
          your branch account.
        </p>
      </div>

      <div className="notice mt-12">
        <IonIcon icon={shieldCheckmarkOutline} aria-hidden="true" />
        <div>
          <p className="notice__title">Restricted access</p>
          <p className="notice__text">
            Design demo only. No staff accounts are provisioned and no requests
            are sent.
          </p>
        </div>
      </div>
    </AuthShell>
  );
}
