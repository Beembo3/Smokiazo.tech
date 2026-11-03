import type { Metadata } from "next";
import Link from "next/link";
import { AppHeader, Notice } from "@/components/ui";

const DOCS = {
  privacy: {
    title: "Privacy Policy",
    summary:
      "How request details, contact information and optional account data are used in this demo.",
  },
  terms: {
    title: "Terms & Conditions",
    summary:
      "The conditions that apply to tracking, quote requests and special-service inquiries.",
  },
} as const;

type DocKey = keyof typeof DOCS;

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const entry = DOCS[doc as DocKey];
  return { title: entry?.title ?? "Policy" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const entry = DOCS[doc as DocKey];

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <div className="pad mt-16">
          <p className="eyebrow">Draft · not approved</p>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 10 }}>
            {entry?.title ?? "Policy"}
          </h1>
          <p className="small muted" style={{ marginTop: 8 }}>
            {entry?.summary}
          </p>

          <div className="mt-16">
            <Notice title="Placeholder legal copy">
              This page is a stub for the prototype. The real policy must be
              reviewed and approved before launch; nothing here is legal text.
            </Notice>
          </div>

          <div className="card mt-16">
            <h2 className="form-title">What the approved policy must cover</h2>
            <ul className="bullets mt-12">
              <li>The purpose and minimum data collected for quotes and inquiries.</li>
              <li>Who can access a request, and how guest links are secured.</li>
              <li>Retention periods, deletion handling and policy versions.</li>
              <li>How consent is recorded with a timestamp and version.</li>
              <li>How to exercise data access and deletion rights.</li>
            </ul>
          </div>

          <p className="tiny mt-16">
            <Link href="/account" className="link">
              ‹ Back to Account &amp; privacy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
