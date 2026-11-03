"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader, BackLink, Hero, Notice, Pill, StickyActions } from "@/components/ui";
import { SEED_REQUESTS, type StoredRequest } from "@/lib/demo";
import { readJSON, STORAGE_KEYS } from "@/lib/use-persistent-state";

export default function InquiryReceivedPage() {
  const [request, setRequest] = useState<StoredRequest>(
    SEED_REQUESTS.find((item) => item.kind === "inquiry") ?? SEED_REQUESTS[1],
  );

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");
    const all = readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS);
    const found =
      all.find((item) => item.id === ref) ?? all.find((r) => r.kind === "inquiry");
    if (found) setRequest(found);
  }, []);

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/services" />
        <Hero
          page
          eyebrow="Demo confirmation"
          title="Inquiry received"
          sub="This example has not sent a real inquiry."
        />

        <div className="pad mt-12">
          <div className="card">
            <p style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>
              {request.id}
            </p>
            <div className="mt-12">
              <Pill>{request.status}</Pill>
            </div>

            <div className="kv mt-16">
              <div className="kv__row">
                <span className="kv__label">Special service</span>
                <span className="kv__value">
                  {request.detail?.service ?? "Business shipments"} ·{" "}
                  {request.summary} {request.destination}
                </span>
              </div>
              <div className="kv__row">
                <span className="kv__label">Reply channel</span>
                <span className="kv__value">
                  Email · a•••@{request.channel?.split("@")[1] ?? "example.com"}
                </span>
              </div>
            </div>
          </div>

          <div className="card mt-12">
            <h2 className="form-title">The branch will review</h2>
            <p className="small muted" style={{ marginTop: 6 }}>
              Your shipment needs, service availability and packing requirements.
              They may ask for more details by email.
            </p>
            <p className="small muted" style={{ marginTop: 8 }}>
              Keep this inquiry reference when contacting support.
            </p>
          </div>

          <div className="mt-12">
            <Notice title="Service is not yet confirmed">
              This is an inquiry, not a booking. No schedule, payment or service
              acceptance is created.
            </Notice>
          </div>

          <p className="tiny mt-12">
            Guest access?{" "}
            <Link href={`/requests/${request.id}`} className="link">
              View inquiry
            </Link>{" "}
            using your confirmation link.
          </p>
        </div>
      </main>

      <StickyActions
        back={{ href: "/services" }}
        primary={{ label: "View inquiry", href: `/requests/${request.id}` }}
      />
    </div>
  );
}
