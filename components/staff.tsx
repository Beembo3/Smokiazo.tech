"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IonIcon } from "@ionic/react";
import {
  chatbubbleEllipsesOutline,
  ellipsisHorizontalOutline,
  homeOutline,
  mailOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";
import { AppHeader } from "@/components/ui";

export type StaffTab = "overview" | "requests" | "support" | "more";

const TABS: { key: StaffTab; href: string; label: string; icon: string }[] = [
  { key: "overview", href: "/manage", label: "Overview", icon: homeOutline },
  {
    key: "requests",
    href: "/manage/requests",
    label: "Requests",
    icon: mailOutline,
  },
  {
    key: "support",
    href: "/manage/support",
    label: "Support",
    icon: chatbubbleEllipsesOutline,
  },
  {
    key: "more",
    href: "/manage/more",
    label: "More",
    icon: ellipsisHorizontalOutline,
  },
];

export function staffActive(pathname: string): StaffTab {
  if (pathname.startsWith("/manage/requests")) return "requests";
  if (pathname.startsWith("/manage/support")) return "support";
  if (pathname === "/manage") return "overview";
  return "more";
}

export function StaffHeader() {
  return (
    <AppHeader
      badge={
        <>
          <IonIcon icon={shieldCheckmarkOutline} aria-hidden="true" />
          Staff access
        </>
      }
    />
  );
}

export function StaffTabBar({ active }: { active: StaffTab }) {
  return (
    <nav className="tabbar" aria-label="Staff workspace">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className="tab"
          aria-current={active === tab.key ? "page" : undefined}
        >
          <IonIcon icon={tab.icon} aria-hidden="true" />
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

/** Shared empty state used by the inbox and support screens. */
export function StaffEmpty({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="staff-empty">
      <p className="form-title">{title}</p>
      {children ? <p className="small muted mt-8">{children}</p> : null}
      {action ? <div className="mt-12">{action}</div> : null}
    </div>
  );
}
