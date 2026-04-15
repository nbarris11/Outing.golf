"use client";

// All steps are auto-detected from in-app actions — nothing manual.
// The checklist mirrors exactly what an organizer does on Outing.golf.

interface OrganizerChecklistProps {
  memberCount: number;    // includes organizer
  inviteCount: number;    // pending + accepted invites
  respondedCount: number; // members who submitted preferences
  votingEverOpened: boolean; // true once a vote has been opened
  votingOpen: boolean;
  hasVotes: boolean;      // at least one group vote cast
  selectedCoursesCount: number; // courses marked "in the trip"
  hasSelectedLodging: boolean;  // lodging marked "in the trip"
  teeTimesCount: number;  // number of confirmed tee times entered
  isBooked: boolean;      // status === "booked"
}

export function OrganizerChecklist({
  memberCount,
  inviteCount,
  respondedCount,
  votingEverOpened,
  votingOpen,
  hasVotes,
  selectedCoursesCount,
  hasSelectedLodging,
  teeTimesCount,
  isBooked
}: OrganizerChecklistProps) {
  const nonOrganizerMembers = Math.max(0, memberCount - 1);
  const groupJoined = nonOrganizerMembers > 0 || inviteCount > 0;
  const prefsIn = respondedCount >= 1;
  const voteOpened = votingEverOpened || votingOpen || hasVotes;
  const voteClosed = !votingOpen && hasVotes;

  const steps: {
    label: string;
    detail: string;
    done: boolean;
  }[] = [
    {
      label: "Create the trip",
      detail: "Set dates, destination, and budget",
      done: true
    },
    {
      label: "Invite the group",
      detail: nonOrganizerMembers > 0
        ? `${nonOrganizerMembers} member${nonOrganizerMembers !== 1 ? "s" : ""} joined`
        : inviteCount > 0
          ? `${inviteCount} invite${inviteCount !== 1 ? "s" : ""} sent`
          : "Send invites or share the link",
      done: groupJoined
    },
    {
      label: "Collect preferences",
      detail: respondedCount > 0
        ? `${respondedCount}${nonOrganizerMembers > 0 ? ` of ${nonOrganizerMembers}` : ""} responded`
        : "Members submit dates, budget & picks",
      done: prefsIn
    },
    {
      label: "Open group vote",
      detail: voteOpened
        ? votingOpen ? "Vote is live now" : "Vote was completed"
        : "Let the group pick course & lodging",
      done: voteOpened
    },
    {
      label: "Close the vote",
      detail: voteClosed
        ? "Results are in"
        : votingOpen
          ? "Close when everyone has voted"
          : "Open a vote first",
      done: voteClosed
    },
    {
      label: "Select course & lodging",
      detail: selectedCoursesCount > 0 && hasSelectedLodging
        ? `${selectedCoursesCount} course${selectedCoursesCount !== 1 ? "s" : ""} · lodging chosen`
        : selectedCoursesCount > 0
          ? `${selectedCoursesCount} course${selectedCoursesCount !== 1 ? "s" : ""} selected — pick lodging`
          : hasSelectedLodging
            ? "Lodging chosen — select a course"
            : "Mark your course & lodging picks below",
      done: selectedCoursesCount > 0 && hasSelectedLodging
    },
    {
      label: "Book tee times",
      detail: teeTimesCount > 0
        ? `${teeTimesCount} tee time${teeTimesCount !== 1 ? "s" : ""} added`
        : "Enter confirmed tee times above",
      done: teeTimesCount > 0
    },
    {
      label: "Mark trip as booked",
      detail: isBooked
        ? "Group has been notified"
        : "Confirms the booking to everyone",
      done: isBooked
    }
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const total = steps.length;
  const progressPct = Math.round((completedCount / total) * 100);
  const currentIdx = steps.findIndex((s) => !s.done);
  const allDone = completedCount === total;

  return (
    <div className="rounded-[22px] border border-charcoal/8 bg-white px-5 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-charcoal">Organizer checklist</p>
        <span className="text-xs font-medium tabular-nums text-charcoal/40">
          {completedCount}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/8">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${progressPct}%`,
            background: allDone
              ? "linear-gradient(90deg,#059669,#10b981)"
              : "linear-gradient(90deg,#143a2c,#2d6a4f)"
          }}
        />
      </div>

      {/* Step list */}
      <ol className="mt-4 space-y-0.5">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentIdx;
          const isPast = step.done;
          const isFuture = !step.done && !isCurrent;

          return (
            <li
              key={step.label}
              className={[
                "flex items-start gap-3 rounded-[12px] px-2 py-2",
                isCurrent ? "bg-forest-900/6" : ""
              ].join(" ")}
            >
              {/* Icon */}
              <span
                aria-hidden
                className={[
                  "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                  isPast
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                      ? "border-2 border-forest-900 text-forest-900"
                      : "border border-charcoal/20 text-charcoal/25"
                ].join(" ")}
              >
                {isPast ? "✓" : <span className="text-[9px]">{idx + 1}</span>}
              </span>

              {/* Text */}
              <div className="min-w-0">
                <p
                  className={[
                    "text-xs leading-snug",
                    isPast
                      ? "font-medium text-charcoal/30 line-through"
                      : isCurrent
                        ? "font-semibold text-forest-900"
                        : "font-medium text-charcoal/40"
                  ].join(" ")}
                >
                  {step.label}
                </p>
                <p
                  className={[
                    "mt-0.5 text-[11px] leading-snug",
                    isPast
                      ? "text-charcoal/22"
                      : isCurrent
                        ? "text-forest-900/55"
                        : "text-charcoal/28"
                  ].join(" ")}
                >
                  {step.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* All done */}
      {allDone && (
        <div className="mt-3 rounded-[14px] bg-emerald-50 px-3 py-2.5 text-center">
          <p className="text-xs font-semibold text-emerald-700">🎉 Trip is locked in!</p>
          <p className="mt-0.5 text-[11px] text-emerald-600/70">Every step is complete — enjoy the round.</p>
        </div>
      )}
    </div>
  );
}
