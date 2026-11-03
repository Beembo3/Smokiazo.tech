"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import {
  businessOutline,
  carOutline,
  chevronBackOutline,
  cubeOutline,
  documentTextOutline,
  gridOutline,
  homeOutline,
  informationCircleOutline,
  layersOutline,
  locationOutline,
  receiptOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";

export type TabKey = "home" | "shipping" | "rates" | "services";

const TABS: { key: TabKey; href: string; label: string; icon: string }[] = [
  { key: "home", href: "/", label: "Home", icon: homeOutline },
  { key: "shipping", href: "/shipping", label: "Shipping", icon: cubeOutline },
  { key: "rates", href: "/rates", label: "Rates", icon: receiptOutline },
  { key: "services", href: "/services", label: "Services", icon: gridOutline },
];

/** Small ↗ glyph — the Figma file uses it on cards and buttons. */
export function ArrowUpRight({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 9L9 3M9 3H4.2M9 3V7.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="brand" aria-hidden="true">
      <span className="brand__mark">2GO</span>
      <span className="brand__text">
        <span className="brand__name">Express</span>
        <span className="brand__place">Cabanatuan City</span>
      </span>
    </span>
  );
}

export function AppHeader({
  variant = "light",
  solid = false,
}: {
  variant?: "light" | "dark";
  solid?: boolean;
}) {
  return (
    <header
      className={[
        "app-header",
        variant === "dark" ? "app-header--dark" : "",
        solid ? "app-header--solid" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href="/" aria-label="2GO Express Cabanatuan City — home">
        <Logo />
      </Link>
      <Link href="/branch" className="chip" aria-label="Cabanatuan branch details">
        <IonIcon icon={locationOutline} aria-hidden="true" />
        Cabanatuan
      </Link>
    </header>
  );
}

export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="back">
      <IonIcon icon={chevronBackOutline} aria-hidden="true" />
      {label}
    </Link>
  );
}

export function Hero({
  eyebrow,
  title,
  sub,
  children,
  page = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  children?: React.ReactNode;
  page?: boolean;
}) {
  return (
    <section className={page ? "hero hero--page" : "hero"}>
      {eyebrow ? <p className="hero__eyebrow">{eyebrow}</p> : null}
      <h1 className="hero__title">{title}</h1>
      {sub ? <p className="hero__sub">{sub}</p> : null}
      {children}
    </section>
  );
}

export function SectionHead({
  label,
  aside,
}: {
  label: string;
  aside?: React.ReactNode;
}) {
  return (
    <div className="section-head">
      <p className="eyebrow">{label}</p>
      {aside ? <span className="section-head__aside">{aside}</span> : null}
    </div>
  );
}

const ICONS: Record<string, string> = {
  document: documentTextOutline,
  box: cubeOutline,
  business: businessOutline,
  bulk: layersOutline,
  shield: shieldCheckmarkOutline,
  truck: carOutline,
};

export function IconTile({ icon }: { icon: keyof typeof ICONS | string }) {
  return (
    <span className="icon-tile" aria-hidden="true">
      <IonIcon icon={ICONS[icon] ?? cubeOutline} />
    </span>
  );
}

export function Notice({
  title,
  children,
  icon = informationCircleOutline,
}: {
  title?: string;
  children: React.ReactNode;
  icon?: string;
}) {
  return (
    <div className="notice">
      <IonIcon icon={icon} aria-hidden="true" />
      <div>
        {title ? <p className="notice__title">{title}</p> : null}
        <p className="notice__text">{children}</p>
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = "brand",
}: {
  children: React.ReactNode;
  tone?: "brand" | "muted" | "dark";
}) {
  return (
    <span
      className={`pill ${tone === "muted" ? "pill--muted" : ""} ${
        tone === "dark" ? "pill--dark" : ""
      }`}
    >
      {children}
    </span>
  );
}

type ButtonVariant = "brand" | "ink" | "outline" | "on-dark" | "quiet";

export function Button({
  children,
  href,
  onClick,
  variant = "brand",
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const fill = variant === "outline" || variant === "on-dark" ? "outline" : "solid";

  return (
    <span className={`app-button btn-${variant} ${className}`.trim()}>
      <IonButton
        mode="md"
        fill={fill}
        type={type}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        onClick={() => {
          if (disabled || loading) return;
          if (href) router.push(href);
          else onClick?.();
        }}
      >
        {loading ? (
          <IonSpinner name="dots" />
        ) : (
          <span className="btn-content">{children}</span>
        )}
      </IonButton>
    </span>
  );
}

export function StickyActions({
  back,
  primary,
}: {
  back?: { href: string; label?: string } | false;
  primary: {
    label: string;
    href?: string;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
  };
}) {
  return (
    <div className="actions">
      {back ? (
        <Button href={back.href} variant="outline">
          <IonIcon
            slot="start"
            icon={chevronBackOutline}
            aria-hidden="true"
            style={{ fontSize: 14 }}
          />
          {back.label ?? "Back"}
        </Button>
      ) : null}
      <Button
        variant="brand"
        className="is-primary"
        href={primary.href}
        onClick={primary.onClick}
        loading={primary.loading}
        disabled={primary.disabled}
      >
        {primary.label}
        <ArrowUpRight size={13} />
      </Button>
    </div>
  );
}

export function TabBar({ active }: { active: TabKey }) {
  return (
    <nav className="tabbar" aria-label="Main">
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

export function PageShell({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab?: TabKey;
}) {
  return (
    <div className="app">
      {children}
      {tab ? <TabBar active={tab} /> : null}
    </div>
  );
}
