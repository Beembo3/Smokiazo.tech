import Link from "next/link";
import type { Metadata } from "next";
import { AppHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Demo screen index" };

const GROUPS: { title: string; items: { label: string; href: string; note?: string }[] }[] = [
  {
    title: "Main tabs",
    items: [
      { label: "Home", href: "/" },
      { label: "Shipping", href: "/shipping" },
      { label: "Rates", href: "/rates" },
      { label: "Services", href: "/services" },
    ],
  },
  {
    title: "Tracking",
    items: [
      { label: "Waybill entry", href: "/track" },
      { label: "Demo result", href: "/track/result" },
      { label: "Not found", href: "/track/not-found" },
      { label: "Connection error", href: "/track/error" },
    ],
  },
  {
    title: "Quote request",
    items: [
      { label: "Step 1 · Destination & contact", href: "/quote/destination" },
      { label: "Step 2 · Package details", href: "/quote/package" },
      { label: "Step 3 · Review & consent", href: "/quote/review" },
      { label: "Received", href: "/quote/received" },
    ],
  },
  {
    title: "Special services",
    items: [
      { label: "Inquiry form", href: "/services/inquiry" },
      { label: "Inquiry received", href: "/services/received" },
    ],
  },
  {
    title: "Requests & branch",
    items: [
      { label: "My requests", href: "/requests" },
      { label: "Request detail", href: "/requests/DEMO-Q-0018" },
      { label: "Branch details", href: "/branch" },
      { label: "Help & report an issue", href: "/help" },
    ],
  },
  {
    title: "Optional account",
    items: [
      { label: "Sign in", href: "/login" },
      { label: "Sign up", href: "/signup" },
      { label: "Verify email", href: "/verify-email" },
      { label: "Forgot password", href: "/forgot-password" },
      { label: "Reset password", href: "/reset-password" },
      { label: "Account & privacy", href: "/account" },
    ],
  },
  {
    title: "Staff workspace",
    items: [
      { label: "Staff sign in", href: "/admin" },
      { label: "Branch overview", href: "/manage" },
      { label: "Request inbox", href: "/manage/requests" },
      { label: "Quote request detail", href: "/manage/requests/DEMO-Q-0018" },
      { label: "Prepare quote response", href: "/manage/requests/DEMO-Q-0018/reply" },
      { label: "Inquiry detail", href: "/manage/requests/DEMO-I-0007" },
      { label: "Shipment lookup", href: "/manage/lookup" },
      { label: "Support case", href: "/manage/support" },
      { label: "Branch profile", href: "/manage/branch" },
      { label: "Account & access", href: "/manage/account" },
      { label: "More", href: "/manage/more" },
      { label: "User directory", href: "/manage/directory" },
    ],
  },
  {
    title: "Policies",
    items: [
      { label: "Privacy Policy (draft)", href: "/legal/privacy" },
      { label: "Terms & Conditions (draft)", href: "/legal/terms" },
    ],
  },
];

export default function ScreensPage() {
  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <div className="pad mt-12">
          <p className="eyebrow">Demo helper</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 10 }}>
            All screens
          </h1>
          <p className="small muted" style={{ marginTop: 8 }}>
            Every route in the prototype. Demo credentials are prefilled; nothing
            is sent anywhere.
          </p>

          <div className="stack mt-20" style={{ gap: 22 }}>
            {GROUPS.map((group) => (
              <section key={group.title}>
                <p className="kicker" style={{ marginBottom: 8 }}>
                  {group.title}
                </p>
                <div className="screen-list">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.label}
                      <span>{item.href}</span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="tiny mt-20">
            <Link href="/" className="link">
              ‹ Back to Home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
