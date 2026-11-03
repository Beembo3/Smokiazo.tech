"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** App-style navigation: every route change starts at the top of the screen. */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
