"use client";

import Link from "next/link";
import {
  AppHeader,
  ArrowUpRight,
  IconTile,
  Notice,
  PageShell,
} from "@/components/ui";
import { INQUIRY_CATEGORIES } from "@/lib/demo";

export default function ServicesPage() {
  return (
    <PageShell tab="services">
      <AppHeader />

      <main className="screen screen--tabbed">
        <div className="pad">
          <div className="card">
            <h1 className="card__title" style={{ fontSize: 22, lineHeight: 1.2 }}>
              Special service inquiries
            </h1>
            <p className="card__sub" style={{ marginTop: 8 }}>
              Tell the branch what you need and they’ll confirm if the service is
              available.
            </p>
          </div>
        </div>

        <div className="pad mt-12">
          <div className="stack">
            {INQUIRY_CATEGORIES.map((item) => (
              <Link
                key={item.slug}
                href={`/services/inquiry?category=${item.slug}`}
                className="service"
              >
                <IconTile icon={item.icon} />
                <span className="service__body">
                  <span className="service__kicker">{item.kicker}</span>
                  <span className="service__title" style={{ display: "block" }}>
                    {item.title}
                  </span>
                  <span className="service__text">{item.text}</span>
                </span>
                <span className="service__arrow">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="pad mt-16">
          <Notice title="Special services need branch review before they can be confirmed.">
            Restricted items, packaging requirements and route limitations still
            apply. The branch will confirm availability, costs and handling
            conditions before any arrangements can be made.
          </Notice>
        </div>
      </main>
    </PageShell>
  );
}
