"use client";

import { useState } from "react";
import { IonIcon, IonToast } from "@ionic/react";
import { scanOutline, timeOutline } from "ionicons/icons";
import { Button, Hero, Pill } from "@/components/ui";
import { TextField } from "@/components/form";

export default function StaffShipmentLookupPage() {
  const [waybill, setWaybill] = useState("");
  const [toast, setToast] = useState("");

  return (
    <main className="screen screen--tabbed">
      <Hero page eyebrow="Branch tools · Read-only" title="Shipment lookup" />

      <div className="section mt-12">
        <div className="card stack" style={{ gap: 12 }}>
          <TextField
            label="Waybill number"
            value={waybill}
            onChange={(value) => setWaybill(value.toUpperCase())}
            placeholder="Enter waybill number"
            autoComplete="off"
          />
          <Button
            variant="brand"
            disabled
            onClick={() => setToast("Tracking is not connected in this demo.")}
          >
            Look up waybill
          </Button>
          <p className="tiny">
            Lookup is disabled until tracking is connected.
          </p>
        </div>

        <div className="card mt-12" style={{ textAlign: "center" }}>
          <Pill tone="muted">Demo · Integration unavailable</Pill>
          <span className="lookup-symbol" aria-hidden="true">
            <IonIcon icon={scanOutline} />
          </span>
          <h2 className="form-title">Tracking isn’t connected yet</h2>
          <p className="small muted mt-8">
            No live result or shipment status is available in this design demo.
          </p>
          <p className="lookup-timeline mt-16">
            <IonIcon icon={timeOutline} aria-hidden="true" />
            <span>
              Timeline: unavailable
              <br />
              Last carrier update: unavailable
            </span>
          </p>
        </div>

        <div className="full-button mt-12">
          <Button variant="outline" href="/manage/support">
            Open support case
          </Button>
        </div>

        <p className="notice notice--plain mt-12">
          Read-only tracking. Staff cannot overwrite carrier statuses or promise
          delivery dates. Only the confirmed carrier feed may supply updates.
        </p>
      </div>

      <IonToast
        mode="md"
        isOpen={Boolean(toast)}
        message={toast}
        duration={2200}
        position="bottom"
        onDidDismiss={() => setToast("")}
      />
    </main>
  );
}
