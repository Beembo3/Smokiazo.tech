"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { TextField } from "@/components/form";
import { AuthShell } from "@/components/auth";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [done, setDone] = useState(false);

  const submit = () => {
    const found: { password?: string; confirm?: string } = {};
    if (password.length < 12) found.password = "Use at least 12 characters.";
    if (confirm !== password) found.confirm = "Passwords do not match. Re-enter your new password.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setDone(true);
  };

  return (
    <AuthShell
      headline={
        <>
          Choose a new
          <br />
          password.
        </>
      }
      sub="Open this screen from your recovery email. Password examples are hidden."
      footer={
        <Link href="/login" className="link">
          ‹ Back to Sign in
        </Link>
      }
    >
      <div className="auth__card">
        {done ? (
          <>
            <h2 className="auth__title" style={{ fontSize: 22 }}>
              Password reset
            </h2>
            <p className="auth__sub">
              Your password has been updated. Sign in with your new password.
            </p>
            <div className="full-button mt-16">
              <Button variant="brand" href="/login">
                Return to Sign in
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="auth__title" style={{ fontSize: 22 }}>
              Reset password
            </h2>

            <div className="stack mt-16" style={{ gap: 9 }}>
              <TextField
                label="New password *"
                value={password}
                onChange={(value) => {
                  setPassword(value);
                  setErrors((current) => ({ ...current, password: undefined }));
                }}
                type="password"
                passwordToggle
                error={errors.password}
                autoComplete="new-password"
              />
              <p className="form-note" style={{ marginTop: -4 }}>
                Use at least 12 characters. Avoid reused or commonly guessed
                passwords.
              </p>

              <TextField
                label="Confirm password *"
                value={confirm}
                onChange={(value) => {
                  setConfirm(value);
                  setErrors((current) => ({ ...current, confirm: undefined }));
                }}
                type="password"
                passwordToggle
                error={errors.confirm}
                autoComplete="new-password"
              />

              <div className="full-button mt-12">
                <Button variant="brand" onClick={submit}>
                  Reset password
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <p className="auth__legal">
        Demo reset only. Token validation, mismatch states and password policy are
        not wired to a backend.
      </p>
    </AuthShell>
  );
}
