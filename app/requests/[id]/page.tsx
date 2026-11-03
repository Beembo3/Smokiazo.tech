"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader, BackLink, Hero, Notice, Pill, StickyActions } from "@/components/ui";
import { SEED_REQUESTS, type StoredRequest } from "@/lib/demo";
import { readJSON, STORAGE_KEYS } from "@/lib/use-persistent-state";

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const [request, setRequest] = useState<StoredRequest | undefined>(
    SEED_REQUESTS.find((item) => item.id === params?.id),
  );

  useEffect(() => {
    const all = readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS);
    setRequest(all.find((item) => item.id === params?.id) ?? SEED_REQUESTS[0]);
  }, [params?.id]);

  const isQuote = (request?.kind ?? "quote") === "quote";

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/requests" />
        <Hero
          page
          eyebrow={isQuote ? "Quote request · demo" : "Special service · demo"}
          title={isQuote ? "Quote request" : "Business shipment inquiry"}
          sub={`${request?.id ?? "DEMO-Q-0018"} · ${request?.status ?? "Awaiting branch review"}`}
        />

        <div className="pad mt-12">
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="kicker">Reference</span>
              <Pill>{request?.status ?? "Awaiting branch review"}</Pill>
            </div>
            <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 6 }}>
              {request?.id ?? "DEMO-Q-0018"}
            </p>
            <p className="small muted" style={{ marginTop: 4 }}>
              Submitted {request?.createdAt ?? "19 Oct 2026"} · Demo data only
            </p>
          </div>

          <div className="card mt-12">
            <div className="kv">
              {isQuote ? (
                <>
                  <div className="kv__row">
                    <span className="kv__label">Route</span>
                    <span className="kv__value">{request?.detail?.route}</span>
                  </div>
                  <div className="kv__row">
                    <span className="kv__label">Contact</span>
                    <span className="kv__value">{request?.detail?.contact}</span>
                  </div>
                  <div className="kv__row">
                    <span className="kv__label">Package</span>
                    <span className="kv__value">{request?.detail?.package}</span>
                  </div>
                  <div className="kv__row">
                    <span className="kv__label">Preferred channel</span>
                    <span className="kv__value">{request?.channel ?? "Email"}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="kv__row">
                    <span className="kv__label">Special service</span>
                    <span className="kv__value">
                      {request?.detail?.service} · {request?.destination}
                    </span>
                  </div>
                  <div className="kv__row">
                    <span className="kv__label">Quantity</span>
                    <span className="kv__value">{request?.detail?.quantity}</span>
                  </div>
                  <div className="kv__row">
                    <span className="kv__label">Message</span>
                    <span className="kv__value">{request?.detail?.message}</span>
                  </div>
                  <div className="kv__row">
                    <span className="kv__label">Reply channel</span>
                    <span className="kv__value">Email · a•••@example.com</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="card mt-12">
            <h2 className="form-title">
              {isQuote ? "What happens next" : "The branch will review"}
            </h2>
            <ul className="bullets mt-12">
              {isQuote ? (
                <>
                  <li>The branch reviews destination coverage and package details.</li>
                  <li>
                    The branch uses your preferred channel to clarify details and
                    confirm the quote.
                  </li>
                  <li>Keep this reference for follow-up.</li>
                </>
              ) : (
                <>
                  <li>Your shipment needs, service availability and packing requirements.</li>
                  <li>They may ask for more details by email.</li>
                  <li>Keep this inquiry reference when contacting support.</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-12">
            <Notice>
              {isQuote
                ? "This is an information request, not a booking. No shipping price or service acceptance is confirmed."
                : "Service is not yet confirmed. Branch review is required before any arrangement is made."}
            </Notice>
          </div>
        </div>
      </main>

      <StickyActions
        back={{ href: "/requests" }}
        primary={{
          label: isQuote ? "Request another quote" : "Send another inquiry",
          href: isQuote ? "/rates" : "/services",
        }}
      />
    </div>
  );
}
