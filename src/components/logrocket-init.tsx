"use client";

import { useEffect } from "react";
import LogRocket from "logrocket";

import { fetchMe } from "@/components/auth/use-me";
import { markFunnelReady } from "@/lib/analytics/funnel-client";

const logRocketAppId =
  process.env.NEXT_PUBLIC_LOGROCKET_APP_ID ?? "rpxxno/outinggolf";

function sanitizeUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin);
    url.search = "";
    url.hash = "";
    url.pathname = url.pathname.replace(
      /\/(join|invite)\/[^/]+/g,
      "/$1/[redacted]"
    );
    return url.toString();
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
}

function sanitizeHeaders(headers: Record<string, string | null | undefined>) {
  return Object.fromEntries(
    Object.entries(headers).map(([name, value]) =>
      ["authorization", "cookie", "set-cookie"].includes(name.toLowerCase())
        ? [name, null]
        : [name, value]
    )
  );
}

export function LogRocketInit() {
  useEffect(() => {
    const isEnabled =
      process.env.NODE_ENV === "production" &&
      process.env.NEXT_PUBLIC_LOGROCKET_ENABLED !== "false";

    if (!isEnabled) {
      return;
    }

    try {
      LogRocket.init(logRocketAppId, {
      shouldCaptureIP: false,
      browser: {
        urlSanitizer: sanitizeUrl
      },
      dom: {
        inputSanitizer: true
      },
      network: {
        requestSanitizer: (request) => ({
          ...request,
          url: sanitizeUrl(request.url),
          headers: sanitizeHeaders(request.headers),
          body: null
        }),
        responseSanitizer: (response) => ({
          ...response,
          url: response.url ? sanitizeUrl(response.url) : null,
          headers: sanitizeHeaders(response.headers),
          body: null
        })
      }
      });
    } catch {
      return;
    }

    markFunnelReady();
    fetchMe().then(({ profile }) => {
      if (profile) {
        LogRocket.identify(profile.id, {
          name: profile.fullName,
          email: profile.email
        });
      }
    }).catch(() => { /* Analytics must not interrupt the app. */ });
  }, []);

  return null;
}
