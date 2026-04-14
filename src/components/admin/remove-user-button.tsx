"use client";

import { useTransition } from "react";

import { removeUserAction } from "@/lib/actions/admin";

interface Props {
  userId: string;
  userName: string;
}

export function RemoveUserButton({ userId, userName }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm(`Remove ${userName}?\n\nThis permanently deletes their account and all associated data. This cannot be undone.`)) {
      return;
    }
    const formData = new FormData();
    formData.append("targetId", userId);
    startTransition(async () => {
      await removeUserAction(formData);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs text-red-500 hover:border-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}
