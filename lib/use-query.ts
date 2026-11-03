"use client";

import { useEffect, useState } from "react";

/** Reads a query-string value after mount (keeps static rendering simple). */
export function useQueryValue(key: string, fallback = "") {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get(key);
    if (param) setValue(param);
  }, [key]);

  return value;
}
