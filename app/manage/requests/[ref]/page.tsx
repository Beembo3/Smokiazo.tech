"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IonCheckbox, IonIcon, IonToast } from "@ionic/react";
import { personOutline } from "ionicons/icons";
import {
  BackLink,
  Button,
  Hero,
  Pill,
} from "@/components/ui";
import { SelectField, TextAreaField } from "@/components/form";
import { StaffEmpty } from "@/components/staff";
import { useSession } from "@/lib/use-session";
import {
  staffIdentity,
  STAFF_STATUS,
  useStaffData,
} from "@/lib/staff";

const AVAILABILITY_OPTIONS = [
  { value: "Not assessed", label: "Not assessed" },
  { value: "Likely available", label: "Likely available" },
  { value: "Needs branch confirmation", label: "Needs branch confirmation" },
  { value: "Not available", label: "Not available" },
];

export default function StaffRequestDetailPage() {
  const params = useParams<{ ref: string }>();
  const router = useRouter();
  const { session } = useSession();
  const { requests, update } = useStaffData();
  const [toast, setToast] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const request = requests.find((item) => item.id === params?.ref);

  if (!ready) {
    return (
      <main className="screen" aria-busy="true">
        <p className="pad mt-16 small muted">Loading request…</p>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="screen">
        <BackLink href="/manage/requests" label="Request inbox" />
        <div className="pad mt-12">
          <div className="card">
            <StaffEmpty
              title="Request not found"
              action={
                <Button href="/manage/requests" variant="outline">
                  Back to inbox
                </Button>
              }
            >
              This demo reference does not exist in the local request store.
            </StaffEmpty>
          </div>
        </div>
      </main>
    );
  }

  const entry = request.staff;
  const isQuote = request.kind === "quote";
  const assigned = entry.assignedTo;

  const assignToMe = () => {
    update(request.id, {
      assignedTo: staffIdentity(session),
      status:
        request.status === STAFF_STATUS.awaiting
          ? STAFF_STATUS.review
          : request.status,
    });
    setToast("Request assigned to you.");
  };

  const requestMoreInfo = () => {
    update(request.id, { status: STAFF_STATUS.info });
    setToast("Status set to Needs information.");
  };

  const saveNotes = () => {
    update(request.id, { internalNote: entry.internalNote ?? "" });
    setToast("Internal notes saved.");
  };

  return (
    <main className="screen">
      <BackLink href="/manage/requests" label="Request inbox" />
      <Hero
        page
        eyebrow={`${request.id} · Demo`}
        title={isQuote ? "Quote request" : "Business inquiry"}
      />

      <div className="section mt-12">
        <div className="staff-status-row">
          <Pill>{request.status}</Pill>
          <span className="tiny">{assigned ?? "Unassigned"}</span>
        </div>

        {assigned ? (
          <p className="staff-assigned">
            <IonIcon icon={personOutline} aria-hidden="true" />
            Assigned to {assigned}
          </p>
        ) : (
          <div className="full-button mt-12">
            <Button variant="outline" onClick={assignToMe}>
              Assign to me
            </Button>
          </div>
        )}

        {isQuote ? (
          <>
            <div className="card mt-12">
              <div className="meta-block">
                <p className="meta-block__label">Route · Demo</p>
                <p className="meta-block__text">
                  {request.detail?.route ??
                    `${request.destination} · from Cabanatuan City, Nueva Ecija`}
                </p>
              </div>
              <div className="meta-block">
                <p className="meta-block__label">
                  Contact · Role-restricted
                </p>
                <p className="meta-block__text">
                  {request.detail?.contact ?? "Email · a•••@example.com"}
                  {" · "}Preferred: {request.channel ?? "Email"}
                </p>
              </div>
              <div className="meta-block">
                <p className="meta-block__label">Package</p>
                <p className="meta-block__text">
                  {request.detail?.package ?? request.summary}
                </p>
              </div>
            </div>

            <div className="card mt-12">
              <p className="kicker">Branch review · Not yet confirmed</p>
              <div className="review-list mt-12">
                <label className="check-row">
                  <IonCheckbox
                    mode="md"
                    checked={Boolean(entry.review?.coverage)}
                    onIonChange={(event) =>
                      update(request.id, {
                        review: {
                          ...entry.review,
                          coverage: event.detail.checked,
                        },
                      })
                    }
                    aria-label="Check origin and destination coverage"
                  />
                  Check origin and destination coverage
                </label>
                <label className="check-row">
                  <IonCheckbox
                    mode="md"
                    checked={Boolean(entry.review?.acceptance)}
                    onIonChange={(event) =>
                      update(request.id, {
                        review: {
                          ...entry.review,
                          acceptance: event.detail.checked,
                        },
                      })
                    }
                    aria-label="Review item acceptance and restrictions"
                  />
                  Review item acceptance and restrictions
                </label>
              </div>
            </div>

            <p className="tiny mt-12">
              Assign before reviewing. A reply is guidance, not service
              acceptance, a booking or payment.
            </p>
          </>
        ) : (
          <>
            <div className="card mt-12">
              <p className="kicker">Customer inquiry · Demo</p>
              <p className="meta-block__text mt-8">
                {request.detail?.message ?? request.summary}
              </p>
              <p className="small muted mt-12">
                To {request.destination}
                {request.detail?.quantity
                  ? ` · ${request.detail.quantity}`
                  : ""}
                <br />
                Preferred contact: {request.channel ?? "Email"} · a•••@example.com
                <br />
                Weight, dimensions and acceptance are unconfirmed.
              </p>
            </div>

            <div className="card mt-12 stack" style={{ gap: 14 }}>
              <SelectField
                label="Availability assessment"
                value={entry.availability ?? "Not assessed"}
                onChange={(value) =>
                  update(request.id, { availability: value })
                }
                options={AVAILABILITY_OPTIONS}
              />
              <TextAreaField
                label="Missing information · Review before reply"
                value={entry.missingInfo ?? ""}
                onChange={(value) =>
                  update(request.id, { missingInfo: value })
                }
                rows={2}
                maxLength={400}
              />
              <TextAreaField
                label="Internal staff notes · Not shared"
                value={entry.internalNote ?? ""}
                onChange={(value) =>
                  update(request.id, { internalNote: value })
                }
                rows={2}
                maxLength={400}
              />
            </div>

            <p className="tiny mt-12">
              Notes stay internal. Prepare a separate customer-visible reply; do
              not imply availability or acceptance.
            </p>
          </>
        )}
      </div>

      <div className="actions actions--staff">
        <Button
          variant="outline"
          onClick={isQuote ? requestMoreInfo : saveNotes}
        >
          {isQuote ? "Request more info" : "Save internal notes"}
        </Button>
        <Button
          variant="brand"
          onClick={() => router.push(`/manage/requests/${request.id}/reply`)}
        >
          Prepare reply
        </Button>
      </div>

      <IonToast
        mode="md"
        isOpen={Boolean(toast)}
        message={toast}
        duration={2200}
        position="bottom"
        onDidDismiss={() => setToast("")}
      />

      {isQuote ? (
        <span className="sr-only">
          <Link href={`/manage/requests/${request.id}/reply`}>
            Open reply composer
          </Link>
        </span>
      ) : null}
    </main>
  );
}
