"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppHeader,
  ArrowUpRight,
  Button,
  Hero,
  PageShell,
  Pill,
} from "@/components/ui";
import { usePersistentState, STORAGE_KEYS } from "@/lib/use-persistent-state";
import { EMPTY_QUOTE, type QuoteDraft } from "@/lib/demo";

export default function RatesPage() {
  const router = useRouter();
  const [draft] = usePersistentState<QuoteDraft>(STORAGE_KEYS.quote, EMPTY_QUOTE);
  const [starting, setStarting] = useState(false);

  const contact = [draft.contactName, draft.mobile, draft.email]
    .filter((part) => part && part.trim())
    .join(", ");

  return (
    <PageShell tab="rates">
      <AppHeader />

      <main className="screen screen--tabbed">
        <Hero
          page
          title="Request a quote"
          sub="Share destination, package details and contact details. The branch will confirm coverage, availability, charges and final price."
        />

        <div className="pad mt-16">
          <div className="card">
            <h2 className="form-title">Request a quote</h2>

            <div className="stack mt-12" style={{ gap: 9 }}>
              <div className="grid-2">
                <div className="ro-field">
                  <span className="ro-field__label">Sending from</span>
                  <span className="ro-field__value">
                    Cabanatuan City, Nueva Ecija
                  </span>
                </div>
                <div className="ro-field">
                  <span className="ro-field__label">Destination</span>
                  <span
                    className={`ro-field__value ${
                      draft.city ? "" : "ro-field__value--empty"
                    }`}
                  >
                    {draft.city
                      ? `${draft.city}, ${draft.province}`
                      : "Enter destination"}
                  </span>
                </div>
              </div>

              <div className="grid-2">
                <div className="ro-field">
                  <span className="ro-field__label">Category</span>
                  <span className="ro-field__value">{draft.packageType}</span>
                </div>
                <div className="ro-field">
                  <span className="ro-field__label">Packed weight</span>
                  <span className="ro-field__value">
                    {draft.weight ? `${draft.weight} kg` : "Enter weight"}
                  </span>
                </div>
              </div>

              <div className="ro-field">
                <span className="ro-field__label">Contact details</span>
                <span className="ro-field__value">
                  {contact || "Name, mobile number and email"}
                </span>
              </div>
            </div>

            <div className="full-button mt-12">
              <Button
                variant="brand"
                loading={starting}
                onClick={() => {
                  setStarting(true);
                  router.push("/quote/destination");
                }}
              >
                Start quote request
                <ArrowUpRight size={13} />
              </Button>
            </div>
          </div>

          <div className="hero mt-16" style={{ marginInline: 0 }}>
            <Pill>Branch confirmation</Pill>
            <h2
              style={{
                marginTop: 12,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.15,
              }}
            >
              What the branch will confirm
            </h2>
            <ul className="bullets mt-12">
              <li style={{ color: "#c9c9d4" }}>
                Coverage and delivery availability to the destination
              </li>
              <li style={{ color: "#c9c9d4" }}>
                Applicable charges, handling and packaging requirements
              </li>
              <li style={{ color: "#c9c9d4" }}>
                Final price and any next steps before pickup or drop-off
              </li>
            </ul>
            <p className="tiny mt-12" style={{ color: "#9d9daa" }}>
              No booking or payment is created in this first release. The branch
              will get back to you with the confirmed quote.
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
