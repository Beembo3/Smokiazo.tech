"use client";

import Link from "next/link";
import { IonIcon } from "@ionic/react";
import { alertCircleOutline, chevronForwardOutline } from "ionicons/icons";
import { AppHeader, BackLink, Hero, Notice } from "@/components/ui";
import { Button } from "@/components/ui";
import { useQueryValue } from "@/lib/use-query";

export default function TrackErrorPage() {
  const waybill = useQueryValue("wb", "DEMO-OFFLINE");

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/track" />
        <Hero
          page
          eyebrow="Demo state · Connection error"
          title="Track your shipment"
          sub="Your waybill is saved on this screen."
        />

        <div className="pad mt-12">
          <div className="card">
            <span style={{ color: "var(--brand)", fontSize: 26 }}>
              <IonIcon icon={alertCircleOutline} aria-hidden="true" />
            </span>

            <h2 className="card__title" style={{ marginTop: 8 }}>
              We couldn’t load tracking
            </h2>
            <p className="card__sub">
              You may be offline, or the tracking service may be unavailable.
              Check your connection and retry.
            </p>

            <div className="ro-field mt-12">
              <span className="ro-field__label">Waybill number *</span>
              <span className="ro-field__value">{waybill}</span>
            </div>

            <div className="full-button mt-12">
              <Button variant="brand" href={`/track?wb=${encodeURIComponent(waybill)}`}>
                Retry
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <Notice title="This is not a “not found” result">
              The search did not complete. We cannot tell whether this waybill has
              a matching shipment until tracking is available.
            </Notice>
          </div>

          <Link
            href="/help"
            className="card mt-12"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>
              <span className="row__title" style={{ display: "block" }}>
                Help &amp; report an issue
              </span>
              <span className="row__sub" style={{ display: "block" }}>
                You can retry as a guest. No sign-in needed.
              </span>
            </span>
            <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  );
}
