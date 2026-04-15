"use client";

import { useEffect } from "react";

/** Scrolls the window to the top on every page mount. Drop into any page to override browser scroll restoration. */
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
}
