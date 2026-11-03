"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IonIcon } from "@ionic/react";
import { chevronForwardOutline, scanOutline } from "ionicons/icons";
import { AppHeader, BackLink, Hero, Notice } from "@/components/ui";
import { TextField } from "@/components/form";
import { Button } from "@/components/ui";
import { TRACKING_DEMO } from "@/lib/demo";

export default function TrackPage() {
  const router = useRouter();
  const [waybill, setWaybill] = useState(TRACKING_DEMO.waybill);
  const [error, setError] = useState("");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("wb");
    if (param) setWaybill(param);
  }, []);

  const submit = () => {
    const value = waybill.trim().toUpperCase();
    if (!value) {
      setError("Enter your waybill number.");
      return;
    }
    setError("");

    if (value === "DEMO-OFFLINE") {
      router.push(`/track/error?wb=${encodeURIComponent(value)}`);
      return;
    }
    if (value === TRACKING_DEMO.waybill) {
      router.push(`/track/result?wb=${encodeURIComponent(value)}`);
      return;
    }
    router.push(`/track/not-found?wb=${encodeURIComponent(value)}`);
  };

  return (
    <div className="app">
      <AppHeader />
      <main className="screen">
        <BackLink href="/" />
        <Hero
          page
          eyebrow="Tracking · Guest access"
          title="Track your shipment"
          sub="Have your waybill ready. No account needed."
        />

        <div className="pad mt-12">
          <div className="card">
            <h2 className="form-title">Enter a waybill number</h2>

            <div className="mt-12">
              <TextField
                label="Waybill number *"
                value={waybill}
                onChange={(value) => {
                  setWaybill(value.toUpperCase());
                  setError("");
                }}
                error={error}
                autoComplete="off"
              />
            </div>

            <p className="form-note" style={{ marginTop: 8 }}>
              Demo numbers: DEMO-26001842 (found), DEMO-00000000 (no match),
              DEMO-OFFLINE (connection error).
            </p>

            <div className="full-button mt-12">
              <Button variant="brand" onClick={submit}>
                Track
              </Button>
            </div>
          </div>

          <div className="card mt-12">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="icon-tile">
                <IonIcon icon={scanOutline} aria-hidden="true" />
              </span>
              <h2 className="form-title">Where to find it</h2>
            </div>

            <p className="small muted mt-12">
              Look for the waybill number beside the barcode on your shipping
              receipt or label.
            </p>

            <div className="barcode" aria-hidden="true" />
            <p className="tiny" style={{ marginTop: 8 }}>
              DEMO-26001842 · demo label
            </p>
          </div>

          <div className="mt-12">
            <Notice title="Track as a guest">
              Signing in is optional. Tracking shows shipment updates, not a
              recipient’s full address.
            </Notice>
          </div>

          <Link
            href="/help"
            className="card mt-12"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              textAlign: "center",
              fontWeight: 600,
              fontSize: 12.5,
            }}
          >
            <span style={{ flex: 1 }}>Need help with a waybill?</span>
            <IonIcon icon={chevronForwardOutline} className="row__chevron" aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  );
}
