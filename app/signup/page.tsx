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

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useSession();
  const [form, setForm] = useState({
    name: "Alex D.",
    email: "alex@example.com",
    password: "password123",
    confirm: "password123",
  });
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const submit = () => {
    const found: Record<string, string> = {};
    if (!form.name.trim()) found.name = "Enter your full name.";
    if (!emailPattern.test(form.email.trim())) found.email = "Enter a valid email address.";
    if (form.password.length < 8) found.password = "Use at least 8 characters.";
    if (form.password !== form.confirm) found.confirm = "Passwords do not match.";
    if (!terms) found.terms = "Accept the terms to continue.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    signUp(form.name.trim(), form.email.trim());
    window.setTimeout(() => router.push("/verify-email"), 350);
  };

  return (
    <AuthShell
      headline={
        <>
          Create your
          <br />
          account.
        </>
      }
      sub="Join 2GO Express in Cabanatuan City. Your next connection starts here."
      footer={
        <AuthFooterLink text="Already have an account?" href="/login" label="Sign In" />
      }
    >
      <div className="auth__card">
        <h2 className="auth__title">Sign up</h2>

        <div className="stack mt-16" style={{ gap: 9 }}>
          <TextField
            label="Full name"
            value={form.name}
            onChange={(value) => update("name", value)}
            error={errors.name}
            autoComplete="name"
          />
          <TextField
            label="Email address"
            value={form.email}
            onChange={(value) => update("email", value)}
            type="email"
            inputMode="email"
            error={errors.email}
            autoComplete="email"
          />
          <TextField
            label="Password"
            value={form.password}
            onChange={(value) => update("password", value)}
            type="password"
            error={errors.password}
            autoComplete="new-password"
          />
          <TextField
            label="Confirm password"
            value={form.confirm}
            onChange={(value) => update("confirm", value)}
            type="password"
            error={errors.confirm}
            autoComplete="new-password"
          />

          <div className="check-row" style={{ marginTop: 2 }}>
            <IonCheckbox mode="md"
              checked={terms}
              aria-label="Agree to the terms and privacy policy"
              onIonChange={(event) => {
                setTerms(event.detail.checked);
                setErrors((current) => ({ ...current, terms: "" }));
              }}
            />
            <span>
              I agree to the{" "}
              <Link href="/legal/terms" className="link">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/legal/privacy" className="link">
                Privacy Policy
              </Link>
              .
            </span>
          </div>
          {errors.terms ? <span className="field__error">{errors.terms}</span> : null}

          <div className="full-button mt-12">
            <Button variant="brand" onClick={submit} loading={loading}>
              Create Account
              <ArrowUpRight size={13} />
            </Button>
          </div>
        </div>
      </div>

      <p className="auth__legal">
        Optional account · verify your email after signing up. Guest tracking and
        quote requests stay available.
      </p>
    </AuthShell>
  );
}

