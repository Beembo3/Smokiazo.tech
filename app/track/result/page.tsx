"use client";

import { AppHeader, BackLink, Hero, Pill, StickyActions } from "@/components/ui";
import { TRACKING_DEMO } from "@/lib/demo";
import { useQueryValue } from "@/lib/use-query";

export default function TrackResultPage() {
  const waybill = useQueryValue("wb", TRACKING_DEMO.waybill);

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/track" />
        <Hero
          page
          eyebrow="Demo data · Not a live result"
          title="Shipment updates"
          sub={waybill}
        />

        <div className="pad mt-12">
          <div className="card">
            <Pill>{TRACKING_DEMO.status}</Pill>

            <div className="mt-12">
              <p className="kicker">Route</p>
              <p className="value" style={{ marginTop: 3, lineHeight: 1.45 }}>
                {TRACKING_DEMO.route}
              </p>
            </div>

            <p className="small muted" style={{ marginTop: 10 }}>
              Latest update: {TRACKING_DEMO.updated}
            </p>
          </div>

          <div className="card mt-12">
            <h2 className="form-title">Status timeline</h2>
            <p className="tiny" style={{ marginTop: 3 }}>
              Newest first · Philippine time (UTC+8)
            </p>

            <div className="timeline mt-16">
              {TRACKING_DEMO.events.map((event) => (
                <div
                  key={event.title}
                  className={`step ${event.current ? "step--current" : ""}`}
                >
                  <span className="step__dot" aria-hidden="true" />
                  <div>
                    <p className="step__title">{event.title}</p>
                    <p className="step__meta">{event.at}</p>
                    <p className="step__text">{event.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="tiny mt-12">
            Illustrative route and events only. No recipient name, phone number or
            street address is displayed.
          </p>
        </div>
      </main>

      <StickyActions
        back={{ href: "/track" }}
        primary={{ label: "Get tracking help", href: "/help" }}
      />
    </div>
  );
}
