"use client";

import { useEffect } from "react";

/**
 * Scrolls to the top of the page on every mount.
 * Sets history.scrollRestoration = "manual" to prevent the browser from
 * restoring a cached scroll position, then fires window.scrollTo inside a
 * requestAnimationFrame so it runs after the browser's own restoration pass.
 */
export function ScrollToTop() {
  useEffect(() => {
    // Disable browser scroll restoration so it can't override us
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // rAF ensures we run after the browser has had its chance to restore scroll
    const id = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return null;
}
