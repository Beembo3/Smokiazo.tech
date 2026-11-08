"use client";

import { useState } from "react";
import { IonToast } from "@ionic/react";
import { Button, Hero, Pill } from "@/components/ui";
import { TextField } from "@/components/form";
import { stamp, type BranchProfile } from "@/lib/staff";
import { STORAGE_KEYS, usePersistentState } from "@/lib/use-persistent-state";

const EMPTY_PROFILE: BranchProfile = {
  street: "",
  contact: "",
  hours: "",
  cutoff: "",
};

export default function StaffBranchProfilePage() {
  const [tab, setTab] = useState<"published" | "draft">("published");
  const [profile, setProfile] = usePersistentState<BranchProfile>(
    STORAGE_KEYS.branchProfile,
    EMPTY_PROFILE,
  );
  const [toast, setToast] = useState("");

  const complete =
    Boolean(profile.street.trim()) &&
    Boolean(profile.contact.trim()) &&
    Boolean(profile.hours.trim()) &&
    Boolean(profile.cutoff.trim());

  const setField = (key: keyof BranchProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const publish = () => {
    if (!complete) {
      setToast("Confirm the street, contact, hours and cut-off before publishing.");
      return;
    }
    setProfile((current) => ({ ...current, publishedAt: stamp() }));
    setTab("published");
    setToast("Branch profile published.");
  };

  const published = Boolean(profile.publishedAt);

  return (
    <main className="screen screen--tabbed">
      <Hero
        page
        eyebrow="Manager view · Demo draft"
        title="Branch profile"
      />

      <div className="section mt-12">
        <div className="segmented segmented--2" role="tablist" aria-label="Profile view">
          <button
            type="button"
            role="tab"
            className={`segmented__item ${tab === "published" ? "is-active" : ""}`}
            aria-selected={tab === "published"}
            onClick={() => setTab("published")}
          >
            Published
          </button>
          <button
            type="button"
            role="tab"
            className={`segmented__item ${tab === "draft" ? "is-active" : ""}`}
            aria-selected={tab === "draft"}
            onClick={() => setTab("draft")}
          >
            Draft
          </button>
        </div>

        {tab === "published" ? (
          <>
            <div className="card mt-12">
              <Pill tone={published ? "brand" : "muted"}>
                {published ? "Published" : "Not published"}
              </Pill>
              <p className="card__title mt-12">Cabanatuan City, Nueva Ecija</p>
              <p className="small muted mt-8">
                Known locality only. No verified street, contact details, hours
                or cut-off is available in this demo.
              </p>

              {published ? (
                <div className="mt-12">
                  <div className="meta-block">
                    <p className="meta-block__label">Street address</p>
                    <p className="meta-block__text">{profile.street}</p>
                  </div>
                  <div className="meta-block">
                    <p className="meta-block__label">Verified branch contact</p>
                    <p className="meta-block__text">{profile.contact}</p>
                  </div>
                  <div className="meta-block">
                    <p className="meta-block__label">Opening hours</p>
                    <p className="meta-block__text">{profile.hours}</p>
                  </div>
                  <div className="meta-block">
                    <p className="meta-block__label">Cut-off</p>
                    <p className="meta-block__text">{profile.cutoff}</p>
                  </div>
                  <p className="tiny mt-12">
                    Published {profile.publishedAt}. Draft changes never replace
                    published information until re-published.
                  </p>
                </div>
              ) : null}
            </div>

            <p className="tiny mt-12">
              Draft changes never replace published information until a manager
              reviews and publishes them.
            </p>
          </>
        ) : (
          <>
            <div className="card mt-12">
              <Pill tone="muted">Draft · not published</Pill>
              <p className="card__title mt-12">Cabanatuan City, Nueva Ecija</p>
              <p className="small muted mt-8">
                Known locality only. Add verified details before publishing.
              </p>
            </div>

            <div className="card mt-12 stack" style={{ gap: 14 }}>
              <TextField
                label="Street address"
                value={profile.street}
                onChange={(value) => setField("street", value)}
                placeholder="Pending confirmation"
              />
              <TextField
                label="Verified branch contact"
                value={profile.contact}
                onChange={(value) => setField("contact", value)}
                placeholder="Pending confirmation"
              />
              <div className="grid-2">
                <TextField
                  label="Opening hours"
                  value={profile.hours}
                  onChange={(value) => setField("hours", value)}
                  placeholder="Unconfirmed"
                />
                <TextField
                  label="Cut-off"
                  value={profile.cutoff}
                  onChange={(value) => setField("cutoff", value)}
                  placeholder="Unconfirmed"
                />
              </div>
            </div>

            <div className="notice mt-12">
              <div>
                <p className="notice__title">Manager-only publication</p>
                <p className="notice__text">
                  Verify all fields and source evidence before review and
                  publishing. Agents can view current approved information, not
                  publish changes.
                </p>
              </div>
            </div>

            <p className="tiny mt-12">
              Draft changes never replace published information until
              re-published.
            </p>
          </>
        )}
      </div>

      {tab === "draft" ? (
        <div className="actions actions--staff actions--inline">
          <Button
            variant="outline"
            onClick={() =>
              setToast(
                complete
                  ? "Review complete. Publish when ready."
                  : "Complete every field before review.",
              )
            }
          >
            Review changes
          </Button>
          <Button variant="brand" disabled={!complete} onClick={publish}>
            Publish
          </Button>
        </div>
      ) : null}

      <IonToast
        mode="md"
        isOpen={Boolean(toast)}
        message={toast}
        duration={2400}
        position="bottom"
        onDidDismiss={() => setToast("")}
      />
    </main>
  );
}
