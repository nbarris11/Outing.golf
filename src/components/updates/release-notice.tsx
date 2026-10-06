"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function ReleaseNotice({ memberId, releaseId, title }: { memberId: string; releaseId: string; title: string }) {
  const storageKey = `outing:release-dismissed:v1:${memberId}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(localStorage.getItem(storageKey) !== releaseId);
    } catch {
      setVisible(true);
    }
  }, [storageKey, releaseId]);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(storageKey, releaseId); } catch { /* Dismiss still works when storage is unavailable. */ }
  }

  if (!visible) return null;
  return (
    <aside aria-label="Latest product update" className="relative mt-6 rounded-2xl border border-forest-900/15 bg-forest-900/5 p-5 pr-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-forest-900">What’s new</p>
      <p className="mt-2 font-semibold text-charcoal">{title}</p>
      <Link href={`/updates#${releaseId}`} className="mt-2 inline-block text-sm text-forest-900 underline underline-offset-4">See what’s changed →</Link>
      <button type="button" onClick={dismiss} aria-label="Dismiss latest update" className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-charcoal/60 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest-900"><X className="h-4 w-4" aria-hidden="true" /></button>
    </aside>
  );
}
