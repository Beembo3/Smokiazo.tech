"use client";

import Link from "next/link";
import { AppHeader } from "@/components/ui";

export function AuthShell({
  headline,
  sub,
  children,
  footer,
}: {
  headline: React.ReactNode;
  sub?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="app">
      <div className="auth">
        <AppHeader variant="dark" />

        <div className="auth__top">
          <div className="auth__headline">
            <p className="hero__eyebrow">Local roots. Everyday connections.</p>
            <h1>{headline}</h1>
            {sub ? <p>{sub}</p> : null}
          </div>
        </div>

        <div className="auth__sheet">
          <div className="auth__handle" aria-hidden="true" />
          {children}
          {footer ? <div className="auth__footer">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function AuthFooterLink({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) {
  return (
    <>
      {text}{" "}
      <Link href={href} className="link">
        {label}
      </Link>
    </>
  );
}
