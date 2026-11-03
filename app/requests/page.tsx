"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader, BackLink, Hero, Pill, StickyActions } from "@/components/ui";
import { SEED_REQUESTS, type StoredRequest } from "@/lib/demo";
import { readJSON, STORAGE_KEYS } from "@/lib/use-persistent-state";

export default function RequestsPage() {
  const [requests, setRequests] = useState<StoredRequest[]>(SEED_REQUESTS);

  useEffect(() => {
    setRequests(readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS));
  }, []);

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/" />
        <Hero page eyebrow="Optional account · Demo history" title="My requests" />

        <p className="small muted pad mt-12">
          Your quote and service inquiries, not shipment bookings. Showing{" "}
          {requests.length} demo {requests.length === 1 ? "request" : "requests"}.
        </p>

        <div className="pad mt-12">
          <div className="stack">
            {requests.map((request) => (
              <Link key={request.id} href={`/requests/${request.id}`} className="request">
                <span className="request__top">
                  <span className="request__ref">{request.id}</span>
                  <span className="tiny" style={{ margin: 0 }}>
                    Demo
                  </span>
                </span>
                <span className="request__title" style={{ display: "block" }}>
                  {request.title}
                </span>
                <span className="request__meta" style={{ display: "block" }}>
                  {request.destination}
                  <br />
                  {request.summary}
                </span>
                <span className="request__foot">
                  <Pill>{request.status}</Pill>
                  <span className="row__end">
                    View
                    <span aria-hidden="true" style={{ fontSize: 15 }}>
                      ›
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <p className="tiny mt-12">
            Guest? Keep your confirmation reference and use its View request link.
            Sign-in is not required to submit.
          </p>
        </div>
      </main>

      <StickyActions
        back={{ href: "/" }}
        primary={{ label: "Request a quote", href: "/rates" }}
      />
    </div>
  );
}
