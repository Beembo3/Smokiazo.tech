"use client";

import { setupIonicReact } from "@ionic/react";

/**
 * Ionic needs to know its rendering mode before the first component renders.
 * This runs at module scope so the mode is applied while the client bundle is
 * evaluated, i.e. before hydration. Ionic's own `initialize()` no-ops when
 * `window` is undefined, so importing this during server rendering is safe.
 */
setupIonicReact({
  mode: "md",
});

export function IonicProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
