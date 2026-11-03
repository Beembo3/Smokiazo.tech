"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IonCheckbox } from "@ionic/react";
import { AppHeader, BackLink, Hero, Notice, StickyActions } from "@/components/ui";
import { SelectField } from "@/components/form";
import {
  CHANNELS,
  EMPTY_QUOTE,
  SEED_REQUESTS,
  validateQuoteStep3,
  type Errors,
  type QuoteDraft,
  type StoredRequest,
} from "@/lib/demo";
import {
  readJSON,
  STORAGE_KEYS,
  usePersistentState,
  writeJSON,
} from "@/lib/use-persistent-state";

export default function QuoteReviewPage() {
  const router = useRouter();
  const [draft, setDraft] = usePersistentState<QuoteDraft>(STORAGE_KEYS.quote, EMPTY_QUOTE);
  const [errors, setErrors] = useState<Errors<QuoteDraft>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = () => {
    const found = validateQuoteStep3(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const existing = readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS);
    const nextQuoteNumber = 18 + existing.filter((r) => r.kind === "quote").length;
    const id = `DEMO-Q-00${nextQuoteNumber}`;

    const record: StoredRequest = {
      id,
      kind: "quote",
      title: "Quote request",
      status: "Awaiting branch review",
      destination: `${draft.city}, ${draft.province}`,
      summary: `${draft.pieces} ${Number(draft.pieces) === 1 ? "parcel" : "parcels"} · ${draft.description} · ${draft.weight} kg`,
      createdAt: new Date().toLocaleDateString("en-PH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      channel: draft.channel,
      detail: {
        route: `From Cabanatuan City, Nueva Ecija to ${draft.barangay}, ${draft.city}, ${draft.province} ${draft.postal}`,
        contact: `${draft.contactName} · ${draft.email} · Mobile: ${
          draft.mobile || "not provided"
        }`,
        package: `${draft.packageType} · ${draft.description} · ${draft.pieces} ${
          Number(draft.pieces) === 1 ? "piece" : "pieces"
        } · ${draft.weight} kg total · ${draft.length} × ${draft.width} × ${
          draft.height
        } cm · Declared value PHP ${draft.declaredValue} (not a price)`,
      },
    };

    writeJSON(STORAGE_KEYS.requests, [record, ...existing]);
    writeJSON(STORAGE_KEYS.quote, { ...draft, consent: false });
    router.push(`/quote/received?ref=${id}`);
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/quote/package" />
        <Hero page eyebrow="Quote request · Step 3 of 3" title="Review your request" />

        <div className="pad mt-12">
          <div className="card">
            <div className="summary">
              <div className="summary__head">
                <span className="summary__label">Route · demo</span>
                <Link href="/quote/destination" className="summary__edit">
                  Edit
                </Link>
              </div>
              <p className="summary__text">
                From Cabanatuan City, Nueva Ecija
                <br />
                To {draft.barangay}, {draft.city}, {draft.province} {draft.postal}
              </p>
            </div>

            <div className="summary">
              <div className="summary__head">
                <span className="summary__label">Contact</span>
                <Link href="/quote/destination" className="summary__edit">
                  Edit
                </Link>
              </div>
              <p className="summary__text">
                {draft.contactName} · {draft.email}
                <br />
                Mobile: {draft.mobile || "not provided"}
              </p>
            </div>

            <div className="summary">
              <div className="summary__head">
                <span className="summary__label">Package</span>
                <Link href="/quote/package" className="summary__edit">
                  Edit
                </Link>
              </div>
              <p className="summary__text">
                {draft.packageType} · {draft.description}
                <br />
                {draft.pieces} {Number(draft.pieces) === 1 ? "piece" : "pieces"} ·{" "}
                {draft.weight} kg total · {draft.length} × {draft.width} ×{" "}
                {draft.height} cm
                <br />
                Declared value: PHP {draft.declaredValue} (not a price)
              </p>
            </div>
          </div>

          <div className="card mt-12">
            <SelectField
              label="Preferred contact channel *"
              value={draft.channel}
              onChange={(value) => update("channel", value as QuoteDraft["channel"])}
              options={CHANNELS.map((channel) => ({ value: channel, label: channel }))}
              error={errors.channel}
            />

            <div className="check-row mt-16">
              <IonCheckbox mode="md"
                checked={draft.consent}
                aria-label="Consent to use these details for this quote request"
                onIonChange={(event) => update("consent", event.detail.checked)}
              />
              <span>
                Required: I agree to the use of these details to review and
                respond to my quote request.
              </span>
            </div>
            {errors.consent ? <span className="field__error">{errors.consent}</span> : null}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginTop: 12,
              }}
            >
              <Link href="/legal/privacy" className="link" style={{ fontSize: 11.5 }}>
                Privacy Policy ↗
              </Link>
              <span className="tiny" style={{ margin: 0 }}>
                Consent copy is draft
              </span>
            </div>
          </div>

          <div className="mt-12">
            <Notice>
              No booking or payment. The branch confirms price, coverage and item
              acceptance. Consent is required before submission; legal wording
              needs approval.
            </Notice>
          </div>
        </div>
      </main>

      <StickyActions
        back={{ href: "/quote/package" }}
        primary={{
          label: submitting ? "Submitting…" : "Submit quote request",
          onClick: submit,
          loading: submitting,
        }}
      />
    </div>
  );
}

