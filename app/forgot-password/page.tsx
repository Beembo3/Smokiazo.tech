"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { TextField } from "@/components/form";
import { AuthShell } from "@/components/auth";
import { emailPattern } from "@/lib/demo";
import { Notice } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("alex@example.com");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <AuthShell
      headline={
        <>
          Get back into
          <br />
          your account.
        </>
      }
      sub="Use your email to request a password recovery link. Guest features remain available."
      footer={
        <Link href="/login" className="link">
          ‹ Back to Sign in
        </Link>
      }
    >
      <div className="auth__card">
        <h2 className="auth__title" style={{ fontSize: 22 }}>
          Forgot password
        </h2>
        <p className="auth__sub">Enter the email you use for your account.</p>

        <div className="mt-16">
          <TextField
            label="Email address *"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setError("");
            }}
            type="email"
            inputMode="email"
            error={error}
            autoComplete="email"
          />
        </div>

        <div className="full-button mt-12">
          <Button variant="brand" onClick={submit}>
            Send recovery link
          </Button>
        </div>

        {sent ? (
          <div className="mt-12">
            <Notice title="Request submitted · demo feedback">
              If an account uses this email, recovery instructions will be sent.
              Check your inbox and spam folder.
            </Notice>
          </div>
        ) : null}
      </div>

      <p className="auth__legal">
        Demo email only. This message does not confirm whether an account exists.
      </p>
    </AuthShell>
  );
}
