"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IonIcon } from "@ionic/react";
import { personOutline } from "ionicons/icons";
import { Hero, Pill } from "@/components/ui";
import { TextField } from "@/components/form";
import { StaffEmpty } from "@/components/staff";
import { STATUS_OPTIONS, useStaffData } from "@/lib/staff";

type TypeFilter = "all" | "quote" | "inquiry";

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "quote", label: "Quotes" },
  { key: "inquiry", label: "Inquiries" },
];

export default function StaffRequestInboxPage() {
  const { requests } = useStaffData();
  const [type, setType] = useState<TypeFilter>("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toUpperCase();
    return requests.filter((request) => {
      if (type !== "all" && request.kind !== type) return false;
      if (status !== "all" && request.status !== status) return false;
      if (needle && !request.id.toUpperCase().includes(needle)) return false;
      return true;
    });
  }, [requests, type, status, query]);

  const reset = () => {
    setType("all");
    setStatus("all");
    setQuery("");
  };

  return (
    <main className="screen screen--tabbed">
      <Hero page eyebrow="Branch requests · Demo" title="Request inbox" />

      <div className="section mt-12">
        <TextField
          label="Search by reference only"
          value={query}
          onChange={(value) => setQuery(value.toUpperCase())}
          placeholder="Enter a request reference"
          autoComplete="off"
        />

        <div className="segmented mt-12" role="group" aria-label="Request type">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`segmented__item ${
                type === filter.key ? "is-active" : ""
              }`}
              aria-pressed={type === filter.key}
              onClick={() => setType(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="staff-status-line mt-12">
          <label className="staff-status-line__label">
            Status
            <select
              className="staff-select-inline"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <span className="tiny">
            {filtered.length} demo {filtered.length === 1 ? "request" : "requests"}
          </span>
        </div>

        <div className="stack mt-12">
          {filtered.length ? (
            filtered.map((request) => (
              <Link
                key={request.id}
                href={`/manage/requests/${request.id}`}
                className="request"
              >
                <span className="request__top">
                  <span className="request__ref">{request.id}</span>
                  <span className="tiny" style={{ margin: 0 }}>
                    Demo
                  </span>
                </span>
                <span className="request__title" style={{ display: "block" }}>
                  {request.title}
                </span>
                <span className="request__meta" style={{ display: "block" }}>
                  {request.destination}
                  <br />
                  {request.summary}
                </span>
                <span className="request__foot">
                  <Pill>{request.status}</Pill>
                  <span className="row__end">
                    View
                    <span aria-hidden="true" style={{ fontSize: 15 }}>
                      ›
                    </span>
                  </span>
                </span>
                <span className="staff-assign">
                  <IonIcon icon={personOutline} aria-hidden="true" />
                  {request.staff.assignedTo ?? "Unassigned"}
                </span>
              </Link>
            ))
          ) : (
            <div className="card">
              <StaffEmpty
                title="No requests match these filters."
                action={
                  <button type="button" className="summary__edit" onClick={reset}>
                    Clear filters
                  </button>
                }
              >
                Keep All / Quotes / Inquiries and the reference input visible so
                staff can recover quickly.
              </StaffEmpty>
            </div>
          )}
        </div>

        <p className="tiny mt-12">
          Contact details are visible only inside authorized request details.
          Assign from the detail screen.
        </p>
      </div>
    </main>
  );
}
