"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppHeader,
  BackLink,
  Hero,
  Notice,
  StickyActions,
} from "@/components/ui";
import { SelectField, TextField, UnitField } from "@/components/form";
import {
  EMPTY_QUOTE,
  PACKAGE_TYPES,
  validateQuoteStep2,
  type Errors,
  type QuoteDraft,
} from "@/lib/demo";
import { STORAGE_KEYS, usePersistentState } from "@/lib/use-persistent-state";

export default function QuotePackagePage() {
  const router = useRouter();
  const [draft, setDraft] = usePersistentState<QuoteDraft>(STORAGE_KEYS.quote, EMPTY_QUOTE);
  const [errors, setErrors] = useState<Errors<QuoteDraft>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    if (submitted) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const next = () => {
    setSubmitted(true);
    const found = validateQuoteStep2(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      window.setTimeout(() => {
        document.querySelector(".field__error")?.scrollIntoView({ block: "center" });
      }, 40);
      return;
    }
    router.push("/quote/review");
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/quote/destination" />
        <Hero page eyebrow="Quote request · Step 2 of 3" title="Tell us about the item" />

        <p className="small muted pad mt-12">
          Demo inputs · All package fields are required.
        </p>

        <div className="pad mt-12">
          <div className="card stack" style={{ gap: 9 }}>
            <SelectField
              label="Package type *"
              value={draft.packageType}
              onChange={(value) => update("packageType", value)}
              options={PACKAGE_TYPES.map((type) => ({ value: type, label: type }))}
              error={errors.packageType}
            />

            <TextField
              label="Item description *"
              value={draft.description}
              onChange={(value) => update("description", value)}
              error={errors.description}
            />

            <div className="grid-2">
              <TextField
                label="Piece count *"
                value={draft.pieces}
                onChange={(value) => update("pieces", value.replace(/[^\d]/g, "").slice(0, 4))}
                inputMode="numeric"
                error={errors.pieces}
              />
              <UnitField
                label="Packed weight *"
                value={draft.weight}
                onChange={(value) => update("weight", value)}
                unit="kg"
                error={errors.weight}
              />
            </div>

            <div className="grid-2">
              <UnitField
                label="Length *"
                value={draft.length}
                onChange={(value) => update("length", value)}
                unit="cm"
                error={errors.length}
              />
              <UnitField
                label="Width *"
                value={draft.width}
                onChange={(value) => update("width", value)}
                unit="cm"
                error={errors.width}
              />
            </div>

            <div className="grid-2">
              <UnitField
                label="Height *"
                value={draft.height}
                onChange={(value) => update("height", value)}
                unit="cm"
                error={errors.height}
              />
              <UnitField
                label="Declared value *"
                value={draft.declaredValue}
                onChange={(value) => update("declaredValue", value)}
                unit="PHP"
                error={errors.declaredValue}
              />
            </div>

            <p className="form-note">
              Measure the packed item. Dimensions apply per piece; weight is the
              total packed weight.
            </p>
          </div>

          <div className="mt-12">
            <Notice title="Before you continue">
              Declare contents accurately. Ask the branch about restricted,
              dangerous, fragile or perishable items. A request does not mean the
              item is accepted.
            </Notice>
          </div>
        </div>
      </main>

      <StickyActions
        back={{ href: "/quote/destination" }}
        primary={{ label: "Next: review", onClick: next }}
      />
    </div>
  );
}
