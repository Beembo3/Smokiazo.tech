"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IonCheckbox, IonToast } from "@ionic/react";
import { BackLink, Button, Hero, Pill } from "@/components/ui";
import { TextAreaField, TextField } from "@/components/form";
import { StaffEmpty } from "@/components/staff";
import {
  STAFF_STATUS,
  stamp,
  useStaffData,
  type ChargeLine,
} from "@/lib/staff";

const EMPTY_LINE: ChargeLine = { description: "", amount: "" };

export default function StaffReplyPage() {
  const params = useParams<{ ref: string }>();
  const { requests, update } = useStaffData();
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const request = requests.find((item) => item.id === params?.ref);

  if (!ready) {
    return (
      <main className="screen" aria-busy="true">
        <p className="pad mt-16 small muted">Loading reply composer…</p>
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
  const charges = entry.charges ?? {
    total: "",
    lines: [{ ...EMPTY_LINE }],
  };
  const lines = charges.lines.length ? charges.lines : [{ ...EMPTY_LINE }];
  const reply = entry.reply ?? "";
  const sent = request.status === STAFF_STATUS.replied;

  const setCharges = (next: { total: string; lines: ChargeLine[] }) => {
    update(request.id, { charges: next });
  };

  const updateLine = (index: number, patch: Partial<ChargeLine>) => {
    setCharges({
      total: charges.total,
      lines: lines.map((line, position) =>
        position === index ? { ...line, ...patch } : line,
      ),
    });
  };

  const addLine = () => {
    setCharges({
      total: charges.total,
      lines: [...lines, { ...EMPTY_LINE }],
    });
  };

  const removeLine = (index: number) => {
    setCharges({
      total: charges.total,
      lines: lines.filter((_, position) => position !== index),
    });
  };

  const requirementsMet = isQuote
    ? Boolean(entry.review?.coverage && entry.review?.acceptance)
    : Boolean(entry.availability && entry.availability !== "Not assessed");
  const totalValid = isQuote ? Number(charges.total) > 0 : true;
  const messageValid = reply.trim().length >= 10;
  const canSend =
    Boolean(assigned) && requirementsMet && totalValid && messageValid && !sent;

  const saveDraft = () => {
    update(request.id, { savedAt: stamp() });
    setToast("Draft saved.");
  };

  const openPreview = () => {
    if (!messageValid) {
      setToast("Write the customer-visible message first.");
      return;
    }
    setPreview(true);
  };

  const send = () => {
    if (!canSend) return;
    update(request.id, {
      status: STAFF_STATUS.replied,
      sentAt: stamp(),
      reply,
      thread: [
        ...(entry.thread ?? []),
        { author: "staff", text: reply.trim(), at: stamp() },
      ],
    });
    setToast("Reply sent. Request status: Replied.");
  };

  return (
    <main className="screen">
      <BackLink
        href={`/manage/requests/${request.id}`}
        label={isQuote ? "Quote request" : "Request"}
      />
      <Hero
        page
        eyebrow={`${request.id} · Demo draft`}
        title={isQuote ? "Prepare quote response" : "Prepare reply"}
      />

      <div className="section mt-12">
        <div className="staff-status-row">
          <Pill>{sent ? "Sent" : "Draft · not sent"}</Pill>
          <span className="tiny">{request.status}</span>
        </div>

        {isQuote ? (
          <div className="card mt-12">
            <p className="kicker">Package facts · Demo</p>
            <p className="meta-block__text mt-8">
              {request.summary}
              <br />
              {request.detail?.package ?? "Details as submitted by the customer."}
            </p>
          </div>
        ) : (
          <div className="card mt-12">
            <p className="kicker">Customer inquiry · Demo</p>
            <p className="meta-block__text mt-8">
              {request.detail?.message ?? request.summary}
            </p>
          </div>
        )}

        {isQuote ? (
          <div className="card mt-12 stack" style={{ gap: 14 }}>
            <TextField
              label="Branch-confirmed total * · PHP"
              value={charges.total}
              onChange={(value) =>
                setCharges({ total: value, lines })
              }
              inputMode="decimal"
              placeholder="Enter amount"
            />

            {lines.map((line, index) => (
              <div key={index} className="charge-line">
                <TextField
                  label="Charge description *"
                  value={line.description}
                  onChange={(value) => updateLine(index, { description: value })}
                  placeholder="Enter charge"
                />
                <TextField
                  label="Amount · PHP *"
                  value={line.amount}
                  onChange={(value) => updateLine(index, { amount: value })}
                  inputMode="decimal"
                  placeholder="Enter amount"
                />
                {lines.length > 1 ? (
                  <button
                    type="button"
                    className="charge-line__remove"
                    onClick={() => removeLine(index)}
                  >
                    Remove line
                  </button>
                ) : null}
              </div>
            ))}

            <button type="button" className="summary__edit" onClick={addLine}>
              + Add charge line
            </button>
          </div>
        ) : null}

        <div className="card mt-12">
          <p className="kicker">Required before sending</p>
          <div className="review-list mt-12">
            {isQuote ? (
              <>
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
                    aria-label="Coverage and item acceptance reviewed"
                  />
                  Coverage and item acceptance reviewed
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
                    aria-label="Charges confirmed and breakdown matches total"
                  />
                  Charges confirmed; breakdown matches total
                </label>
              </>
            ) : (
              <label className="check-row">
                <IonCheckbox
                  mode="md"
                  checked={requirementsMet}
                  onIonChange={(event) =>
                    update(request.id, {
                      availability: event.detail.checked
                        ? "Needs branch confirmation"
                        : "Not assessed",
                    })
                  }
                  aria-label="Availability and missing information reviewed"
                />
                Availability and missing information reviewed
              </label>
            )}
          </div>
        </div>

        <div className="card mt-12">
          <TextAreaField
            label="Customer-visible email message *"
            value={reply}
            onChange={(value) => update(request.id, { reply: value })}
            rows={4}
            maxLength={900}
          />
        </div>

        <p className="tiny mt-12">
          {isQuote
            ? "Assign and complete review, charges and message to send. Confirmed send → Replied, never Booked."
            : "Assign and review the missing information before sending. A reply is guidance, not acceptance."}
        </p>

        {entry.savedAt ? (
          <p className="tiny mt-12">Draft saved {entry.savedAt}.</p>
        ) : null}
      </div>

      <div className="actions actions--staff actions--stack">
        <div className="actions__row">
          <Button variant="outline" onClick={saveDraft}>
            Save draft
          </Button>
          <Button variant="outline" onClick={openPreview}>
            Preview reply
          </Button>
        </div>
        <Button variant="brand" disabled={!canSend} onClick={send}>
          {sent
            ? "Sent — duplicate send blocked"
            : canSend
              ? "Send reply"
              : "Send reply · requirements incomplete"}
        </Button>
      </div>

      {preview ? (
        <div
          className="sheet-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Reply preview"
        >
          <div className="sheet">
            <p className="sheet__title">Customer-visible reply</p>
            <p className="sheet__text">{reply}</p>
            <p className="tiny">
              Preview only. Nothing has been sent yet.
            </p>
            <div className="sheet__actions">
              <button
                type="button"
                className="row"
                style={{
                  justifyContent: "center",
                  border: "1px solid var(--line-2)",
                  borderRadius: 12,
                  minHeight: 46,
                }}
                onClick={() => setPreview(false)}
              >
                Keep editing
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  border: 0,
                  borderRadius: 12,
                  background: "var(--brand)",
                  color: "#fff",
                  fontWeight: 700,
                  minHeight: 46,
                  fontSize: 13,
                  opacity: canSend ? 1 : 0.55,
                }}
                onClick={() => {
                  setPreview(false);
                  send();
                }}
                disabled={!canSend}
              >
                Send reply
              </button>
            </div>
          </div>
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
