"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IonIcon } from "@ionic/react";
import { bagCheckOutline } from "ionicons/icons";
import { AppHeader, BackLink, Hero, Notice, Pill, StickyActions } from "@/components/ui";
import { SEED_REQUESTS, type StoredRequest } from "@/lib/demo";
import { readJSON, STORAGE_KEYS } from "@/lib/use-persistent-state";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 1)}•••@${domain}`;
}

export default function QuoteReceivedPage() {
  const [request, setRequest] = useState<StoredRequest>(SEED_REQUESTS[0]);

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    const all = readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS);
    const found = all.find((item) => item.id === ref) ?? all.find((r) => r.kind === "quote");
    if (found) setRequest(found);
  }, []);

  const email = request.detail?.contact?.split(" · ")[1] ?? "alex@example.com";

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/rates" />
        <Hero
          page
          eyebrow="Demo confirmation"
          title="Quote request received"
          sub="This example has not sent a real request."
        />

        <div className="pad mt-12">
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="icon-tile">
                <IonIcon icon={bagCheckOutline} aria-hidden="true" />
              </span>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>
                {request.id}
              </h2>
            </div>

            <div className="mt-12">
              <Pill>{request.status}</Pill>
            </div>

            <div className="mt-16">
              <p className="kicker">Email follow-up</p>
              <p className="value" style={{ marginTop: 2 }}>
                {maskEmail(email)}
              </p>
            </div>

            <div className="mt-12">
              <p className="small muted">
                {request.destination} · {request.summary.replace("parcel", "parcel,")}
              </p>
            </div>
          </div>

          <div className="card mt-12">
            <h2 className="form-title">What happens next</h2>
            <ol className="bullets mt-12">
              <li>The branch reviews destination coverage and package details.</li>
              <li>
                The branch uses your preferred channel to clarify details and
                confirm the quote.
              </li>
              <li>Keep this reference for follow-up.</li>
            </ol>
          </div>

          <div className="mt-12">
            <Notice>
              This is an information request, not a booking. No shipping price or
              service acceptance is confirmed.
            </Notice>
          </div>

          <p className="tiny mt-12">
            Guest access? Open the request from your confirmation{" "}
            <Link href={`/requests/${request.id}`} className="link">
              View request
            </Link>{" "}
            link.
          </p>
        </div>
      </main>

      <StickyActions
        back={{ href: "/rates" }}
        primary={{ label: "View request", href: `/requests/${request.id}` }}
      />
    </div>
  );
}
