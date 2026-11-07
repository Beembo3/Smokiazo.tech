"use client";

import Link from "next/link";
import { IonIcon } from "@ionic/react";
import { locationOutline, scanOutline } from "ionicons/icons";
import {
  AppHeader,
  ArrowUpRight,
  Button,
  Hero,
  IconTile,
  PageShell,
  SectionHead,
} from "@/components/ui";
import { HOME_SERVICES } from "@/lib/demo";
import { useSession } from "@/lib/use-session";

export default function HomePage() {
  return (
    <PageShell tab="home">
      <AppHeader />

      <main className="screen screen--tabbed">
        <Hero
          eyebrow="Local roots. Everyday connections."
          title={
            <>
              From here.
              <br />
              To what’s next.
            </>
          }
          sub="Track shipments, request branch quotes, and get shipping guidance without booking or payment."
        >
          <div className="hero__actions">
            <Button href="/rates" variant="brand">
              Request a quote
              <ArrowUpRight />
            </Button>
            <Button href="/track" variant="on-dark">
              Track
              <ArrowUpRight />
            </Button>
          </div>
        </Hero>

        <div className="quick-grid mt-12">
          <Link href="/track" className="quick">
            <IonIcon icon={scanOutline} aria-hidden="true" />
            <span className="quick__title">Track</span>
            <span className="quick__text">Enter your waybill number.</span>
          </Link>
          <Link href="/branch" className="quick">
            <IonIcon icon={locationOutline} aria-hidden="true" />
            <span className="quick__title">Branch</span>
            <span className="quick__text">Confirm rates and coverage.</span>
          </Link>
        </div>

        <section className="section mt-20">
          <SectionHead label="A service for your send" aside="3 options" />
          <div className="stack">
            {HOME_SERVICES.map((item) => (
              <Link
                key={item.slug}
                href={`/quote/destination?type=${item.slug}`}
                className="service"
              >
                <IconTile icon={item.icon} />
                <span className="service__body">
                  <span className="service__title">{item.title}</span>
                  <span className="service__text">{item.text}</span>
                </span>
                <span className="service__arrow">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            ))}
          </div>
          <p className="tiny mt-12" style={{ paddingInline: 2 }}>
            Confirm final rates and availability with the branch.
          </p>
        </section>
        <div className="full-button mt-12" style={{ textAlign: "center" }}>
          <Button variant="outline" onClick={() => router.push("/login")}>
            Sign out
          </Button>
        </div>
      </main>
    </PageShell>
  );
}
