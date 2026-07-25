"use client";

import { usePathname } from "next/navigation";
import React from "react";

export function VisitorTracker() {
  const pathname = usePathname();

  React.useEffect(() => {
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
