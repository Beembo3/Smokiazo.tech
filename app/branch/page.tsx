"use client";

import { IonIcon } from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import { AppHeader, BackLink, Hero, Notice, StickyActions } from "@/components/ui";

const CHECKS = [
  "Pack the item securely and list its contents.",
  "Measure packed weight and dimensions.",
  "Keep your waybill or request reference.",
  "Ask about restrictions and coverage first.",
];

export default function BranchPage() {
  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/" />
        <Hero
          page
          eyebrow="Cabanatuan City · Nueva Ecija"
          title="Your Cabanatuan branch"
        />

        <div className="pad mt-12">
          <div className="card">
            <div className="kv">
              <div className="kv__row">
                <span className="kv__label">Street address</span>
                <span className="kv__value">Pending branch confirmation</span>
              </div>
              <div className="kv__row">
                <span className="kv__label">Opening hours</span>
                <span className="kv__value">Pending branch confirmation</span>
              </div>
              <div className="kv__row">
                <span className="kv__label">Phone / email</span>
                <span className="kv__value">Pending branch confirmation</span>
              </div>
            </div>

            <p className="tiny" style={{ marginTop: 12 }}>
              Call and directions are unavailable until verified. No map pin is
              shown.
            </p>
          </div>

          <div className="card mt-12">
            <h2 className="form-title">Before you visit</h2>
            <ul className="checklist mt-12">
              {CHECKS.map((item) => (
                <li key={item}>
                  <IonIcon icon={checkmarkCircle} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12">
            <Notice title="Need branch information?">
              Use Help to ask for verified details before travelling. Coverage,
              rates and item acceptance require branch review.
            </Notice>
          </div>
        </div>
      </main>

      <StickyActions
        back={{ href: "/" }}
        primary={{ label: "Help & report an issue", href: "/help" }}
      />
    </div>
  );
}
