"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Button } from "@/components/ui";
import { TextField } from "@/components/form";
import { AuthFooterLink, AuthShell } from "@/components/auth";
import { emailPattern } from "@/lib/demo";
import { useSession } from "@/lib/use-session";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useSession();
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
      await signIn(email.trim(), password);
      router.replace("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      headline={<>Sign in to<br />your account.</>}
      sub="Continue with your email and password to access your 2GO Express account."
      footer={<AuthFooterLink text="or" href="/signup" label="Create an Account" />}
    >
      <div className="auth__card">
        <h2 className="auth__title">Sign in</h2>
        <p className="auth__sub">Use your email and password to continue.</p>
        <form onSubmit={(event) => { event.preventDefault(); void submit(); }} className="stack mt-16" style={{ gap: 9 }}>
          <TextField label="Email address" value={email} onChange={(value) => {
            setEmail(value); setErrors((previous) => ({ ...previous, email: undefined }));
          }} type="email" inputMode="email" error={errors.email} autoComplete="email" />
          <TextField label="Password" value={password} onChange={(value) => {
            setPassword(value); setErrors((previous) => ({ ...previous, password: undefined }));
          }} type="password" error={errors.password} autoComplete="current-password" />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/forgot-password" className="link" style={{ fontSize: 11.5 }}>Forgot password?</Link>
          </div>
          {error && <p role="alert" className="field__error">{error}</p>}
          <div className="full-button mt-12">
            <Button variant="brand" onClick={() => { void submit(); }} loading={loading}>
              Sign In <ArrowUpRight size={13} />
            </Button>
          </div>
        </form>
      </div>
      <p className="auth__legal">Sign in with your registered account. Admins can use the <Link href="/admin" className="link">admin login</Link>.</p>
    </AuthShell>
  );
}
