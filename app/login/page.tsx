"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonCheckbox } from "@ionic/react";
import { ArrowUpRight, Button } from "@/components/ui";
import { TextField } from "@/components/form";
import { AuthFooterLink, AuthShell } from "@/components/auth";
import { emailPattern } from "@/lib/demo";
import { useSession } from "@/lib/use-session";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("password123");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = () => {
    const found: { email?: string; password?: string } = {};
    if (!emailPattern.test(email.trim())) found.email = "Enter a valid email address.";
    if (password.length < 8) found.password = "Enter your password (8+ characters).";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    signIn(email.trim(), password);
    window.setTimeout(() => router.push("/account"), 350);
  };

  return (
    <AuthShell
      headline={
        <>
          Sign in to
          <br />
          your account.
        </>
      }
      sub="Continue with your email and password to access your 2GO Express account."
      footer={<AuthFooterLink text="or" href="/signup" label="Create an Account" />}
    >
      <div className="auth__card">
        <h2 className="auth__title">Sign in</h2>
        <p className="auth__sub">Use your email and password to continue.</p>

        <div className="stack mt-16" style={{ gap: 9 }}>
          <TextField
            label="Email address"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setErrors((current) => ({ ...current, email: undefined }));
            }}
            type="email"
            inputMode="email"
            error={errors.email}
            autoComplete="email"
          />

          <TextField
            label="Password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors((current) => ({ ...current, password: undefined }));
            }}
            type="password"
            error={errors.password}
            autoComplete="current-password"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginTop: 2,
            }}
          >
            <div className="check-row" style={{ alignItems: "center" }}>
              <IonCheckbox mode="md"
                checked={remember}
                aria-label="Remember me"
                onIonChange={(event) => setRemember(event.detail.checked)}
              />
              <span style={{ fontWeight: 600, fontSize: 11.5 }}>Remember me</span>
            </div>
            <Link href="/forgot-password" className="link" style={{ fontSize: 11.5 }}>
              Forgot password?
            </Link>
          </div>

          <div className="full-button mt-12">
            <Button variant="brand" onClick={submit} loading={loading}>
              Sign In
              <ArrowUpRight size={13} />
            </Button>
          </div>
        </div>

        <p className="tiny" style={{ marginTop: 12 }}>
          Confirm final rates and availability with the branch.
        </p>
      </div>

      <p className="auth__legal">
        Demo sign-in only. Guest tracking and quote requests work without an
        account.
      </p>
    </AuthShell>
  );
}