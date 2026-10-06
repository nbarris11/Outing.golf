"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { trackFunnel } from "@/lib/analytics/funnel-client";
import type { FunnelContext } from "@/lib/analytics/funnel";

export function CopyLinkButton({
  link,
  analytics,
  className,
  label = "Copy invite link",
  copiedLabel = "Invite link copied"
}: {
  link: string;
  analytics?: FunnelContext;
  className?: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      if (analytics) trackFunnel("outing_share_action", analytics, { method: "copy_link", placement: "group_card" });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this invite link", link);
    }
  }

  return (
    <Button type="button" variant="secondary" className={className} onClick={handleCopy}>
      {copied ? copiedLabel : label}
    </Button>
  );
}
