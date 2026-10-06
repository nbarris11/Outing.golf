"use client";
import { useState } from "react";
export function TripShareTools() {
  const [message, setMessage] = useState("");
  return (
    <div className="my-5 print:hidden">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full bg-forest-900 px-4 py-2 text-sm text-white"
          onClick={() => window.print()}
        >
          Print / save itinerary
        </button>
        <button
          className="rounded-full border px-4 py-2 text-sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              setMessage(
                "Trip link copied. Group members can open it after signing in.",
              );
            } catch {
              setMessage(
                "Copy the address from your browser to share with the group.",
              );
            }
          }}
        >
          Copy trip link
        </button>
      </div>
      <p role="status" className="mt-2 text-sm">
        {message}
      </p>
    </div>
  );
}
