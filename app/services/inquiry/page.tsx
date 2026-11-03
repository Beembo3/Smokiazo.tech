"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppHeader, BackLink, Hero, Notice, StickyActions } from "@/components/ui";
import {
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/form";
import {
  EMPTY_INQUIRY,
  INQUIRY_CATEGORIES,
  emailPattern,
  inquiryBySlug,
  SEED_REQUESTS,
  type InquiryDraft,
  type StoredRequest,
} from "@/lib/demo";
import {
  readJSON,
  STORAGE_KEYS,
  usePersistentState,
  writeJSON,
} from "@/lib/use-persistent-state";

type Errors = Partial<Record<keyof InquiryDraft, string>>;

export default function InquiryPage() {
  const router = useRouter();
  const [draft, setDraft] = usePersistentState<InquiryDraft>(
    STORAGE_KEYS.inquiry,
    EMPTY_INQUIRY,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("category");
    const category = inquiryBySlug(slug ?? undefined);
    setDraft((current) => ({ ...current, category: category.slug }));
  }, [setDraft]);

  const category = inquiryBySlug(draft.category);

  const update = <K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = () => {
    const found: Errors = {};
    if (!draft.destination.trim()) found.destination = "Enter a city and province.";
    if (!draft.quantity.trim()) found.quantity = "Enter a quantity and unit.";
    if (!draft.contactName.trim()) found.contactName = "Enter a contact name.";
    if (!emailPattern.test(draft.email.trim())) found.email = "Enter a valid email address.";
    if (draft.message.trim().length < 10)
      found.message = "Add a few more details (10 characters or more).";

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    const existing = readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS);
    const count = existing.filter((r) => r.kind === "inquiry").length;
    const id = `DEMO-I-00${7 + count}`;

    const record: StoredRequest = {
      id,
      kind: "inquiry",
      title: `${category.label} inquiry`,
      status: "Awaiting branch review",
      destination: draft.destination,
      summary: draft.quantity,
      createdAt: new Date().toLocaleDateString("en-PH", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      channel: `Email · ${draft.email}`,
      detail: {
        service: category.label,
        quantity: draft.quantity,
        message: draft.message,
      },
    };

    writeJSON(STORAGE_KEYS.requests, [record, ...existing]);
    router.push(`/services/received?ref=${id}`);
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/services" />
        <Hero page eyebrow="Branch review · Guest access" title="Special-service inquiry" />

        <p className="small muted pad mt-12">
          Demo inputs · Review your message before sending.
        </p>

        <div className="pad mt-12">
          <div className="card stack" style={{ gap: 9 }}>
            <SelectField
              label="Service category *"
              value={draft.category}
              onChange={(value) => update("category", value)}
              options={INQUIRY_CATEGORIES.map((item) => ({
                value: item.slug,
                label: item.label,
              }))}
            />

            <TextField
              label="Destination city / province *"
              value={draft.destination}
              onChange={(value) => update("destination", value)}
              error={errors.destination}
            />

            <TextField
              label="Quantity *"
              value={draft.quantity}
              onChange={(value) => update("quantity", value)}
              error={errors.quantity}
            />

            <div className="grid-2">
              <TextField
                label="Contact name *"
                value={draft.contactName}
                onChange={(value) => update("contactName", value)}
                error={errors.contactName}
                autoComplete="name"
              />
              <TextField
                label="Contact email *"
                value={draft.email}
                onChange={(value) => update("email", value)}
                type="email"
                inputMode="email"
                error={errors.email}
                autoComplete="email"
              />
            </div>

            <TextAreaField
              label="Shipment needs / message *"
              value={draft.message}
              onChange={(value) => update("message", value)}
              error={errors.message}
              rows={4}
            />
          </div>

          <div className="mt-12">
            <Notice title="An inquiry, not an acceptance">
              Branch review is required. No booking, schedule, payment or acceptance
              is confirmed.
            </Notice>
          </div>

          <p className="tiny mt-12">
            Contact details are for follow-up only.{" "}
            <Link href="/legal/privacy" className="link">
              Privacy Policy
            </Link>{" "}
            · draft, pending approval.
          </p>
        </div>
      </main>

      <StickyActions
        back={{ href: "/services" }}
        primary={{
          label: "Send inquiry",
          onClick: submit,
          loading: submitting,
        }}
      />
    </div>
  );
}
