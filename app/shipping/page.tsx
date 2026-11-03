"use client";

import Link from "next/link";
import {
  AppHeader,
  ArrowUpRight,
  Button,
  Hero,
  IconTile,
  Notice,
  PageShell,
  SectionHead,
} from "@/components/ui";
import { SHIPPING_TYPES } from "@/lib/demo";

export default function ShippingPage() {
  return (
    <PageShell tab="shipping">
      <AppHeader />

      <main className="screen screen--tabbed">
        <div className="pad">
          <div className="card">
            <h1 className="card__title" style={{ fontSize: 22, lineHeight: 1.2 }}>
              Request a branch-assisted quote
            </h1>
            <p className="card__sub" style={{ marginTop: 8 }}>
              Shipping from Cabanatuan City, Nueva Ecija. Bring your packed item
              to the branch and our team will help you choose the right service
              and confirm the quote.
            </p>
          </div>
        </div>

        <section className="section mt-20">
          <SectionHead label="Choose the item type" aside="3 options" />
          <div className="stack">
            {SHIPPING_TYPES.map((item) => (
              <Link
                key={item.slug}
                href={`/quote/destination?type=${item.slug}`}
                className="service"
                style={{ flexDirection: "column", gap: 10 }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    width: "100%",
                    gap: 10,
                  }}
                >
                  <IconTile icon={item.icon} />
                  <span className="service__count">03</span>
                </span>
                <span className="service__body">
                  <span className="service__kicker">{item.kicker}</span>
                  <span className="service__title" style={{ display: "block", fontSize: 18 }}>
                    {item.title}
                  </span>
                  <span className="service__text">{item.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <div className="pad mt-16">
          <Notice title="Before you visit the branch">
            Bring an item description, destination postal code, packed weight and
            dimensions. The branch team will review package restrictions, confirm
            the service and provide a quote.
          </Notice>

          <div className="full-button mt-16">
            <Button href="/rates" variant="brand">
              Request a quote
              <ArrowUpRight size={13} />
            </Button>
          </div>

          <p className="tiny mt-12">
            Visit the Cabanatuan branch with your packed item and the branch team
            will help you choose the right service and confirm the quote.
          </p>
        </div>
      </main>
    </PageShell>
  );
}
