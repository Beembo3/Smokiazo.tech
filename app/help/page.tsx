"use client";

import { useState } from "react";
import { IonToast } from "@ionic/react";
import { AppHeader, BackLink, Hero, Notice, StickyActions } from "@/components/ui";
import { SelectField, TextAreaField, TextField } from "@/components/form";
import { EMPTY_HELP, HELP_TOPICS, emailPattern, type HelpDraft } from "@/lib/demo";
import {
  readJSON,
  STORAGE_KEYS,
  writeJSON,
} from "@/lib/use-persistent-state";

type Errors = Partial<Record<keyof HelpDraft, string>>;

export default function HelpPage() {
  const [draft, setDraft] = useState<HelpDraft>(EMPTY_HELP);
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState(false);

  const update = <K extends keyof HelpDraft>(key: K, value: HelpDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = () => {
    const found: Errors = {};
    if (!draft.issueType) found.issueType = "Choose an issue type.";
    if (draft.message.trim().length < 10)
      found.message = "Add a few more details (10 characters or more).";
    if (!emailPattern.test(draft.email.trim()))
      found.email = "Enter a valid email address.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const existing = readJSON<HelpDraft[]>(STORAGE_KEYS.help, []);
    writeJSON(STORAGE_KEYS.help, [...existing, draft]);
    setToast(true);
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/track" />
        <Hero page eyebrow="Guest support" title="Help & report an issue" />

        <div className="pad mt-12">
          <div className="card">
            <h2 className="form-title">Quick answers</h2>

            <div className="mt-12">
              <p className="row__title">Can I book or pay here?</p>
              <p className="row__sub">
                No. This release supports tracking and branch inquiries.
              </p>
            </div>

            <div className="mt-12">
              <p className="row__title">Is my quote final?</p>
              <p className="row__sub">
                No. The branch confirms coverage, price and acceptance.
              </p>
            </div>
          </div>

          <div className="card mt-12 stack" style={{ gap: 9 }}>
            <TextField
              label="Waybill / request ref · optional"
              value={draft.reference}
              onChange={(value) => update("reference", value.toUpperCase())}
            />

            <SelectField
              label="Issue type *"
              value={draft.issueType}
              onChange={(value) => update("issueType", value)}
              options={HELP_TOPICS.map((topic) => ({ value: topic, label: topic }))}
              error={errors.issueType}
            />

            <TextAreaField
              label="Message *"
              value={draft.message}
              onChange={(value) => update("message", value)}
              error={errors.message}
              rows={3}
            />

            <TextField
              label="Reply email *"
              value={draft.email}
              onChange={(value) => update("email", value)}
              type="email"
              inputMode="email"
              error={errors.email}
              autoComplete="email"
            />
          </div>

          <p className="tiny mt-12">
            Demo inputs. Do not include passwords, IDs or a full recipient
            address. No hotline is listed until verified.
          </p>
        </div>
      </main>

      <StickyActions
        back={{ href: "/track" }}
        primary={{ label: "Send help request", onClick: submit }}
      />

      <IonToast mode="md"
        isOpen={toast}
        message="Help request sent (demo). The branch will reply by email."
        duration={2600}
        position="bottom"
        onDidDismiss={() => setToast(false)}
      />

      <span className="sr-only" role="status">
        {toast ? "Help request sent" : ""}
      </span>
    </div>
  );
}

