"use client";

import { useEffect } from "react";
import { trackFunnel } from "@/lib/analytics/funnel-client";
import type { FunnelContext, FunnelEvent, FunnelProperties } from "@/lib/analytics/funnel";

export function FunnelEvents({ context, events, placement = "outing_page" }: {
  context: FunnelContext;
  events: FunnelEvent[];
  placement?: FunnelProperties["placement"];
}) {
  useEffect(() => {
    for (const event of events) trackFunnel(event, context, { placement });
  }, [context, events, placement]);
  return null;
}
