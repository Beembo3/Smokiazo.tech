"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader, BackLink, Hero, StickyActions } from "@/components/ui";
import { SelectField, TextField } from "@/components/form";
import {
  EMPTY_QUOTE,
  LOCATIONS,
  PROVINCES,
  SHIPPING_TYPES,
  validateQuoteStep1,
  type Errors,
  type QuoteDraft,
} from "@/lib/demo";
import { STORAGE_KEYS, usePersistentState } from "@/lib/use-persistent-state";

export default function QuoteDestinationPage() {
  const router = useRouter();
  const [draft, setDraft] = usePersistentState<QuoteDraft>(STORAGE_KEYS.quote, EMPTY_QUOTE);
  const [errors, setErrors] = useState<Errors<QuoteDraft>>({});
  const [submitted, setSubmitted] = useState(false);

  // Deep links from Home / Shipping cards preselect the item type.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("type");
    const match = SHIPPING_TYPES.find((item) => item.slug === slug);
    if (match) setDraft((current) => ({ ...current, packageType: match.category }));
  }, [setDraft]);

  const cities = LOCATIONS[draft.province] ?? [];
  const barangays = cities.find((c) => c.name === draft.city)?.barangays ?? [];

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) => {
    setDraft((current) => {
      const next = { ...current, [key]: value };
      if (key === "province") {
        next.city = "";
        next.barangay = "";
        next.postal = "";
      }
      if (key === "city") {
        next.barangay = "";
        next.postal = cities.find((c) => c.name === value)?.postal ?? "";
      }
      return next;
    });
    if (submitted) {
      setErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const next = () => {
    setSubmitted(true);
    const found = validateQuoteStep1(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      window.setTimeout(() => {
        document.querySelector(".field__error")?.scrollIntoView({ block: "center" });
      }, 40);
      return;
    }
    router.push("/quote/package");
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/rates" />
        <Hero page eyebrow="Quote request · Step 1 of 3" title="Destination & contact" />

        <p className="small muted pad mt-12">
          Demo inputs · Continue as a guest. Fields marked * are required.
        </p>

        {submitted && Object.keys(errors).length > 0 ? (
          <div className="pad mt-12">
            <div className="notice">
              <div>
                <p className="notice__title">Please review the highlighted fields</p>
                <p className="notice__text">
                  Your valid details are kept. Nothing has been submitted.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="pad mt-12">
          <div className="card stack" style={{ gap: 14 }}>
            <div>
              <p className="kicker">Fixed origin</p>
              <p className="value" style={{ marginTop: 2 }}>
                Cabanatuan City, Nueva Ecija
              </p>
            </div>

            <div className="form-block">
              <h2 className="form-title">Destination area</h2>

              <div className="grid-2">
                <SelectField
                  label="Province *"
                  value={draft.province}
                  onChange={(value) => update("province", value)}
                  options={PROVINCES.map((p) => ({ value: p, label: p }))}
                  error={errors.province}
                  placeholder="Select province"
                />
                <SelectField
                  label="City / municipality *"
                  value={draft.city}
                  onChange={(value) => update("city", value)}
                  options={cities.map((c) => ({ value: c.name, label: c.name }))}
                  error={errors.city}
                  placeholder="Select city"
                  disabled={!draft.province}
                />
              </div>

              <div className="grid-2">
                <SelectField
                  label="Barangay *"
                  value={draft.barangay}
                  onChange={(value) => update("barangay", value)}
                  options={barangays.map((b) => ({ value: b, label: b }))}
                  error={errors.barangay}
                  placeholder="Select barangay"
                  disabled={!draft.city}
                />
                <TextField
                  label="Postal code *"
                  value={draft.postal}
                  onChange={(value) => update("postal", value.replace(/\D/g, "").slice(0, 4))}
                  inputMode="numeric"
                  error={errors.postal}
                  maxLength={4}
                />
              </div>

              <p className="form-note">No street or recipient address needed for a quote.</p>
            </div>

            <div className="divider" />

            <div className="form-block">
              <h2 className="form-title">Your contact details</h2>

              <div className="grid-2">
                <TextField
                  label="Contact name *"
                  value={draft.contactName}
                  onChange={(value) => update("contactName", value)}
                  error={errors.contactName}
                  autoComplete="name"
                />
                <TextField
                  label="Mobile · optional"
                  value={draft.mobile}
                  onChange={(value) => update("mobile", value)}
                  inputMode="tel"
                  placeholder="Not provided"
                  error={errors.mobile}
                  autoComplete="tel"
                />
              </div>

              <TextField
                label="Email *"
                value={draft.email}
                onChange={(value) => update("email", value)}
                type="email"
                inputMode="email"
                error={errors.email}
                autoComplete="email"
              />

              <p className="form-note">
                Email is used for branch follow-up on this request.
              </p>
            </div>
          </div>
        </div>
      </main>

      <StickyActions
        back={{ href: "/rates" }}
        primary={{ label: "Next: package", onClick: next }}
      />
    </div>
  );
}
