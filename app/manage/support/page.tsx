"use client";

import { useState } from "react";
import { IonToast } from "@ionic/react";
import { Button, Hero, Pill } from "@/components/ui";
import { TextAreaField } from "@/components/form";
import { useSession } from "@/lib/use-session";
import { staffIdentity, stamp, useStaffData, type SupportState } from "@/lib/staff";
import { STORAGE_KEYS, usePersistentState } from "@/lib/use-persistent-state";

const CASE_ID = "DEMO-Q-0018";
const CUSTOMER_MESSAGE =
  "“Could I get an update on my quote request DEMO-Q-0018?”";

export default function StaffSupportPage() {
  const { session } = useSession();
  const { requests, helpRequests } = useStaffData();
  const [support, setSupport] = usePersistentState<SupportState>(
    STORAGE_KEYS.staffSupport,
    {},
  );
  const [toast, setToast] = useState("");

  const entry = support[CASE_ID] ?? {};
  const status = entry.status ?? "Open";
  const assigned = entry.assignedTo;
  const quote = requests.find((request) => request.id === CASE_ID);

  const update = (patch: Partial<SupportState[string]>) => {
    setSupport((current) => ({
      ...current,
      [CASE_ID]: { ...current[CASE_ID], ...patch },
    }));
  };

  const assignToMe = () => {
    update({ assignedTo: staffIdentity(session) });
    setToast("Case assigned to you.");
  };

  const reply = () => {
    const message = (entry.reply ?? "").trim();
    if (message.length < 5) {
      setToast("Write a customer-visible reply first.");
      return;
    }
    update({
      status: "Open",
      reply: "",
      thread: [
        ...(entry.thread ?? []),
        { author: "staff", text: message, at: stamp() },
      ],
    });
    setToast("Reply added to the customer-visible thread.");
  };

  const escalate = () => {
    update({ status: "Escalated" });
    setToast("Case escalated to a manager.");
  };

  const resolve = () => {
    if (!(entry.internalNote ?? "").trim()) return;
    update({ status: "Resolved" });
    setToast("Case resolved. The quote status is unchanged.");
  };

  return (
    <main className="screen screen--tabbed">
      <Hero
        page
        eyebrow="Illustrative support case · Demo"
        title="Quote progress"
      />

      <div className="section mt-12">
        <div className="card">
          <div className="staff-status-row">
            <Pill>Case: {status}</Pill>
            <span className="tiny">{assigned ?? "Unassigned"}</span>
          </div>
          <p className="meta-block__text">
            Related request: {CASE_ID}
            <br />
            Category: Quote follow-up
          </p>
          <p className="small muted mt-8">
            Quote: {quote?.status ?? "Awaiting branch review"} · Separate status
          </p>
          {assigned ? (
            <p className="staff-assigned">
              Assigned to {assigned}
            </p>
          ) : (
            <button type="button" className="summary__edit mt-12" onClick={assignToMe}>
              Assign to me
            </button>
          )}
        </div>

        <div className="card mt-12">
          <p className="kicker">Customer-visible thread · Demo</p>
          <div className="stack mt-12" style={{ gap: 8 }}>
            <p className="thread">{CUSTOMER_MESSAGE}</p>
            {(entry.thread ?? []).map((message, index) => (
              <p
                key={`${message.at}-${index}`}
                className={`thread ${message.author === "staff" ? "thread--staff" : ""}`}
              >
                {message.text}
                <span className="thread__meta">{message.at}</span>
              </p>
            ))}
          </div>
        </div>

        <div className="card mt-12 stack" style={{ gap: 14 }}>
          <TextAreaField
            label="Customer-visible reply"
            value={entry.reply ?? ""}
            onChange={(value) => update({ reply: value })}
            rows={2}
            maxLength={600}
          />
          <TextAreaField
            label="Internal note / resolution note *"
            value={entry.internalNote ?? ""}
            onChange={(value) => update({ internalNote: value })}
            rows={2}
            maxLength={600}
          />
        </div>

        {helpRequests.length ? (
          <section className="mt-20">
            <p className="eyebrow">Submitted help requests</p>
            <div className="stack mt-12">
              {helpRequests.map((help, index) => (
                <div key={`${help.email}-${index}`} className="card">
                  <div className="request__top">
                    <span className="request__ref">
                      {help.reference || "No reference"}
                    </span>
                    <span className="tiny" style={{ margin: 0 }}>
                      {help.issueType}
                    </span>
                  </div>
                  <p className="meta-block__text mt-8">{help.message}</p>
                  <p className="tiny mt-8">{help.email}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="actions actions--staff actions--inline actions--stack">
        <div className="actions__row">
          <Button variant="brand" onClick={reply}>
            Reply
          </Button>
          <Button variant="outline" onClick={escalate}>
            Escalate
          </Button>
        </div>
        <Button
          variant="outline"
          disabled={!(entry.internalNote ?? "").trim() || status === "Resolved"}
          onClick={resolve}
        >
          {status === "Resolved" ? "Resolved" : "Resolve"}
        </Button>
      </div>

      <p className="tiny mt-12 pad">
        Reply opens a preview before sending. Escalation uses an authorized
        route. Resolving the case does not close or change the quote.
      </p>

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
