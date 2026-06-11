"use client";

import { useEffect, useState } from "react";

export interface MeResponse {
  profile: {
    id: string;
    email: string;
    fullName: string;
    isAdmin: boolean;
  } | null;
  demoMode: boolean;
}

const SIGNED_OUT: MeResponse = { profile: null, demoMode: false };

// Shared across all components on a page so the header, CTAs, and LogRocket
// trigger a single /api/me request between them.
let mePromise: Promise<MeResponse> | null = null;

export function fetchMe(): Promise<MeResponse> {
  if (!mePromise) {
    mePromise = fetch("/api/me", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<MeResponse>) : SIGNED_OUT))
      .catch(() => SIGNED_OUT);
  }

  return mePromise;
}

/** Returns null while the session probe is in flight (render signed-out UI). */
export function useMe(): MeResponse | null {
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    let active = true;
    fetchMe().then((data) => {
      if (active) {
        setMe(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return me;
}
