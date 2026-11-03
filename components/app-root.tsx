"use client";

import { useEffect, useState } from "react";

/**
 * Ionic's React wrappers are not SSR-safe: the custom elements upgrade during
 * hydration and add their own classes, hidden inputs and shadow styles, which
 * makes React discard the server tree and leaves some components unstyled.
 *
 * Rendering the app after mount keeps Ionic's upgrade path clean (no hydration
 * mismatch) at the cost of a short branded boot screen. This is a mobile app
 * prototype, so runtime behaviour matters more than server-rendered markup.
 */
export function AppRoot({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="boot" aria-busy="true" aria-live="polite">
        <span className="boot__mark" aria-hidden="true">
          2GO
        </span>
        <span className="boot__label">2GO Express · Cabanatuan City</span>
      </div>
    );
  }

  return <>{children}</>;
}
