"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyLinkButton({
  link,
  className,
  label = "Copy invite link",
  copiedLabel = "Invite link copied"
}: {
  link: string;
  className?: string;
  label?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
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
