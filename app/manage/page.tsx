"use client";

import Link from "next/link";
import { IonIcon } from "@ionic/react";
import {
  businessOutline,
  chatbubbleEllipsesOutline,
  chevronForwardOutline,
  scanOutline,
} from "ionicons/icons";
import {
  ArrowUpRight,
  Button,
  Hero,
  IconTile,
  SectionHead,
} from "@/components/ui";
import { useStaffData } from "@/lib/staff";

const TOOLS = [
  {
    href: "/manage/lookup",
    icon: scanOutline,
    title: "Shipment lookup",
    sub: "Read-only waybill tracking",
  },
  {
    href: "/manage/support",
    icon: chatbubbleEllipsesOutline,
    title: "Customer support",
    sub: "Open the illustrative support case",
  },
  {
    href: "/manage/branch",
    icon: businessOutline,
    title: "Branch profile",
    sub: "View approved details or manager draft",
  },
];

export default function ManageOverviewPage() {
  const { requests } = useStaffData();
  const newCount = requests.filter(
    (request) => request.status === "Awaiting branch review",
  ).length;
  const unassigned = requests.filter(
    (request) => !request.staff.assignedTo,
  ).length;
  const followUp = requests.filter(
    (request) => request.status === "Needs information",
  ).length;

  return (
    <main className="screen screen--tabbed">
      <Hero
        page
        eyebrow="Cabanatuan · Staff workspace"
        title="Branch overview"
      />

      <div className="section mt-12">
        <div className="card">
          <p className="kicker">Demo operational snapshot</p>
          <p className="small muted mt-8">
            {requests.length} sample {requests.length === 1 ? "request" : "requests"},
            {" "}{newCount} awaiting branch review. Not live operational activity.
          </p>

          <div className="stats mt-12">
            <div className="stat">
              <p className="stat__value">{newCount}</p>
              <p className="stat__label">New</p>
            </div>
            <div className="stat">
              <p className="stat__value">{unassigned}</p>
              <p className="stat__label">Unassigned</p>
            </div>
            <div className="stat">
              <p className="stat__value">{followUp}</p>
              <p className="stat__label">Follow-up</p>
            </div>
          </div>

          <p className="tiny mt-12">
            New and unassigned refer to the same {requests.length === 1 ? "request" : "requests"}.
          </p>
        </div>

        <div className="full-button mt-12">
          <Button variant="brand" href="/manage/requests">
            Open request inbox · {requests.length} demo
            <ArrowUpRight size={13} />
          </Button>
        </div>

        <section className="mt-20">
          <SectionHead label="Branch tools" />
          <div className="card card--flush list-card">
            {TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="row">
                <span className="row__main admin-row">
                  <IconTile icon={tool.icon} />
                  <span>
                    <span className="row__title" style={{ display: "block" }}>
                      {tool.title}
                    </span>
                    <span className="row__sub" style={{ display: "block" }}>
                      {tool.sub}
                    </span>
                  </span>
                </span>
                <IonIcon
                  icon={chevronForwardOutline}
                  className="row__chevron"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>

        <p className="tiny mt-12">
          Branch-assisted quotes and inquiries only. No booking, payment or
          pickup scheduling.
        </p>
      </div>
    </main>
  );
}
