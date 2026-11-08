"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonIcon } from "@ionic/react";
import { locationOutline, logOutOutline, scanOutline } from "ionicons/icons";
import {
  AppHeader,
  ArrowUpRight,
  Button,
  Hero,
  IconTile,
  PageShell,
  SectionHead,
} from "@/components/ui";
import { HOME_SERVICES } from "@/lib/demo";
import { useSession } from "@/lib/use-session";

export default function HomePage() {
  const router = useRouter();
  const { signOut } = useSession();
  const [confirming, setConfirming] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!confirming) return;
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !signingOut) setConfirming(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [confirming, signingOut]);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      setConfirming(false);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <PageShell tab="home">
      <AppHeader />

      <main className="screen screen--tabbed">
        <Hero
          eyebrow="Local roots. Everyday connections."
          title={
            <>
              From here.
              <br />
              To what’s next.
            </>
          }
          sub="Track shipments, request branch quotes, and get shipping guidance without booking or payment."
        >
          <div className="hero__actions">
            <Button href="/rates" variant="brand">
              Request a quote
              <ArrowUpRight />
            </Button>
            <Button href="/track" variant="on-dark">
              Track
              <ArrowUpRight />
            </Button>
          </div>
        </Hero>

        <div className="quick-grid mt-12">
          <Link href="/track" className="quick">
            <IonIcon icon={scanOutline} aria-hidden="true" />
            <span className="quick__title">Track</span>
            <span className="quick__text">Enter your waybill number.</span>
          </Link>
          <Link href="/branch" className="quick">
            <IonIcon icon={locationOutline} aria-hidden="true" />
            <span className="quick__title">Branch</span>
            <span className="quick__text">Confirm rates and coverage.</span>
          </Link>
        </div>

        <section className="section mt-20">
          <SectionHead label="A service for your send" aside="3 options" />
          <div className="stack">
            {HOME_SERVICES.map((item) => (
              <Link
                key={item.slug}
                href={`/quote/destination?type=${item.slug}`}
                className="service"
              >
                <IconTile icon={item.icon} />
                <span className="service__body">
                  <span className="service__title">{item.title}</span>
                  <span className="service__text">{item.text}</span>
                </span>
                <span className="service__arrow">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <p className="tiny mt-12" style={{ paddingInline: 2 }}>
            Confirm final rates and availability with the branch.
          </p>
        </section>
        <div className="full-button mt-12" style={{ textAlign: "center" }}>
          <Button variant="outline" onClick={() => setConfirming(true)}>
            Sign out
          </Button>
        </div>
      </main>

      {confirming && (
        <div
          className="confirm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget && !signingOut) setConfirming(false);
          }}
        >
          <div
            className="confirm__card"
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="signout-title"
            aria-describedby="signout-text"
            tabIndex={-1}
          >
            <span className="confirm__icon" aria-hidden="true">
              <IonIcon icon={logOutOutline} />
            </span>
            <h2 className="confirm__title" id="signout-title">
              Sign out?
            </h2>
            <p className="confirm__text" id="signout-text">
              You will need to sign in again to access your 2GO Express
              account. Are you sure you want to sign out?
            </p>
            <div className="confirm__actions">
              <Button
                variant="outline"
                disabled={signingOut}
                onClick={() => setConfirming(false)}
              >
                No, stay
              </Button>
              <Button
                variant="brand"
                loading={signingOut}
                onClick={() => {
                  void handleSignOut();
                }}
              >
                Yes, sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
