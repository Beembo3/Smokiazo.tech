"use client";

import { useEffect, useMemo, useState } from "react";
import { SEED_REQUESTS, type HelpDraft, type StoredRequest } from "./demo";
import {
  readJSON,
  STORAGE_KEYS,
  usePersistentState,
} from "./use-persistent-state";

/* ------------------------------------------------------------------ */
/* Shared staff workspace types                                        */
/* ------------------------------------------------------------------ */

export type ChargeLine = { description: string; amount: string };

export type StaffThreadMessage = {
  author: "customer" | "staff";
  text: string;
  at: string;
};

export type StaffRequestState = {
  /** Staff member the request is assigned to. */
  assignedTo?: string;
  /** Lifecycle override. Falls back to the request's own status. */
  status?: string;
  review?: {
    coverage?: boolean;
    acceptance?: boolean;
  };
  availability?: string;
  missingInfo?: string;
  internalNote?: string;
  charges?: {
    total: string;
    lines: ChargeLine[];
  };
  /** Customer-visible reply draft. */
  reply?: string;
  savedAt?: string;
  sentAt?: string;
  thread?: StaffThreadMessage[];
};

export type StaffState = Record<string, StaffRequestState>;

export type SupportCaseState = {
  status?: string;
  assignedTo?: string;
  reply?: string;
  internalNote?: string;
  thread?: StaffThreadMessage[];
};

export type SupportState = Record<string, SupportCaseState>;

export type BranchProfile = {
  street: string;
  contact: string;
  hours: string;
  cutoff: string;
  publishedAt?: string;
};

/* ------------------------------------------------------------------ */
/* Lifecycle helpers                                                   */
/* ------------------------------------------------------------------ */

export const DEFAULT_STATUS = "Awaiting branch review";

export const STAFF_STATUS = {
  awaiting: "Awaiting branch review",
  review: "In review",
  info: "Needs information",
  replied: "Replied",
  closed: "Closed",
} as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: STAFF_STATUS.awaiting, label: STAFF_STATUS.awaiting },
  { value: STAFF_STATUS.review, label: STAFF_STATUS.review },
  { value: STAFF_STATUS.info, label: STAFF_STATUS.info },
  { value: STAFF_STATUS.replied, label: STAFF_STATUS.replied },
  { value: STAFF_STATUS.closed, label: STAFF_STATUS.closed },
];

export function statusOf(
  request: StoredRequest,
  entry?: StaffRequestState,
): string {
  return entry?.status ?? request.status ?? DEFAULT_STATUS;
}

export function isUnassigned(entry?: StaffRequestState): boolean {
  return !entry?.assignedTo;
}

export function staffIdentity(session: {
  name: string | null;
  email: string | null;
} | null): string {
  return session?.name || session?.email || "Staff member";
}

/** Date label that does not depend on the locale of the build machine. */
export function stamp(date = new Date()): string {
  return date.toLocaleString("en-PH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/* Data hook                                                           */
/* ------------------------------------------------------------------ */

export type StaffRequest = StoredRequest & {
  status: string;
  staff: StaffRequestState;
};

export function useStaffData() {
  // The customer app writes requests to localStorage; the seeded fixtures are
  // the fallback so the staff workspace always has demo records to review.
  const [baseRequests, setBaseRequests] = useState<StoredRequest[]>(SEED_REQUESTS);
  const [helpRequests, setHelpRequests] = useState<HelpDraft[]>([]);
  const [state, setState] = usePersistentState<StaffState>(
    STORAGE_KEYS.staff,
    {},
  );

  useEffect(() => {
    setBaseRequests(
      readJSON<StoredRequest[]>(STORAGE_KEYS.requests, SEED_REQUESTS),
    );
    setHelpRequests(readJSON<HelpDraft[]>(STORAGE_KEYS.help, []));
  }, []);

  const requests = useMemo<StaffRequest[]>(
    () =>
      baseRequests.map((request) => {
        const entry = state[request.id] ?? {};
        return {
          ...request,
          status: statusOf(request, entry),
          staff: entry,
        };
      }),
    [baseRequests, state],
  );

  const update = (id: string, patch: Partial<StaffRequestState>) => {
    setState((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));
  };

  return { requests, helpRequests, state, update };
}
