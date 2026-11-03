"use client";

import Link from "next/link";
import { IonIcon } from "@ionic/react";
import { closeCircleOutline, chevronForwardOutline } from "ionicons/icons";
import { AppHeader, BackLink, Hero, Notice } from "@/components/ui";
import { Button } from "@/components/ui";
import { useQueryValue } from "@/lib/use-query";

export default function TrackNotFoundPage() {
  const waybill = useQueryValue("wb", "DEMO-26001842");

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/track" />
        <Hero
          page
          eyebrow="Demo state · No match"
          title="Track your shipment"
          sub="No matching record for this waybill."
        />

        <div className="pad mt-12">
          <div className="card">
            <span style={{ color: "var(--brand)", fontSize: 26 }}>
              <IonIcon icon={closeCircleOutline} aria-hidden="true" />
            </span>

            <h2 className="card__title" style={{ marginTop: 8 }}>
              Waybill not found
            </h2>
            <p className="card__sub">
              The search completed, but no shipment matched. Check the number
              against your receipt and try again.
            </p>

            <div className="ro-field mt-12">
              <span className="ro-field__label">Waybill number *</span>
              <span className="ro-field__value">{waybill}</span>
            </div>

            <div className="full-button mt-12">
              <Button variant="brand" href="/track">
                Try tracking again
              </Button>
            </div>
          </div>

          <div className="mt-12">
            <Notice title="Check before you retry">
              Use the waybill number, not a quote or inquiry reference. Keep all
              letters and digits from your receipt.
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
                Still can’t find it?
              </span>
              <span className="row__sub" style={{ display: "block" }}>
                Send the branch a help request.
              </span>
            </span>
            <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
          </Link>

          <p className="tiny mt-12">
            This is a no-match example, not a connection error. You can track
            without signing in.
          </p>
        </div>
      </main>
    </div>
  );
}
