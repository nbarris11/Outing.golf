import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FieldLabel, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn, formatDateLabel, formatLongDateLabel, formatTimeLabel } from "@/lib/utils";
import type { ChatMessage, Profile } from "@/types/domain";

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ChatPanel({
  messages,
  profiles,
  outingId,
  currentProfileId,
  sendAction
}: {
  messages: ChatMessage[];
  profiles: Profile[];
  outingId: string;
  currentProfileId: string;
  sendAction: (formData: FormData) => Promise<void>;
}) {
  const latestMessage = messages.at(-1);

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-charcoal/8 px-6 py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-[-0.03em]">Group chat</h3>
              <Badge className="bg-forest-900/8 text-forest-900">Members only</Badge>
            </div>
            <p className="mt-2 text-sm text-charcoal/62">
              Keep the decision moving in one place instead of scattered texts.
            </p>
          </div>
          <div className="rounded-[20px] bg-cream px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.24em] text-charcoal/42">Latest note</p>
            <p className="mt-2 text-sm font-medium text-charcoal">
              {latestMessage ? formatLongDateLabel(latestMessage.createdAt) : "No messages yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,rgba(247,244,238,0.55),rgba(247,244,238,0.18))] px-4 py-4 sm:px-6">
        {messages.length ? (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {messages.map((message) => {
              const author = profiles.find((profile) => profile.id === message.profileId);
              const isCurrentUser = message.profileId === currentProfileId;
              const authorName = author?.fullName ?? "Member";

              return (
                <div
                  key={message.id}
                  className={cn("flex gap-3", isCurrentUser ? "justify-end" : "justify-start")}
                >
                  {!isCurrentUser ? (
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-cream">
                      {initialsFor(authorName)}
                    </div>
                  ) : null}
                  <div
                    className={cn(
                      "max-w-[88%] rounded-[24px] px-4 py-3 shadow-[0_10px_35px_rgba(33,36,35,0.06)] sm:max-w-[78%]",
                      isCurrentUser
                        ? "rounded-tr-lg bg-forest-900 text-cream"
                        : "rounded-tl-lg border border-charcoal/8 bg-white text-charcoal"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className={cn("text-sm font-medium", isCurrentUser ? "text-cream" : "text-charcoal")}>
                        {isCurrentUser ? "You" : authorName}
                      </p>
                      <p
                        className={cn(
                          "text-xs",
                          isCurrentUser ? "text-cream/70" : "text-charcoal/45"
                        )}
                      >
                        {formatDateLabel(message.createdAt)} at {formatTimeLabel(message.createdAt)}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "mt-2 text-sm leading-6",
                        isCurrentUser ? "text-cream/92" : "text-charcoal/72"
                      )}
                    >
                      {message.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Start the planning thread"
            body="Once the group begins comparing dates, budgets, or shortlists, every note will stay here with the outing."
          />
        )}
      </div>

      <form action={sendAction} className="border-t border-charcoal/8 px-6 py-5">
        <input type="hidden" name="outingId" value={outingId} />
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <Textarea
              id="message"
              name="message"
              maxLength={800}
              className="min-h-24 bg-cream"
              placeholder="Ask the group to vote, confirm a date, or react to the top shortlist."
            />
            <p className="mt-2 text-xs leading-5 text-charcoal/52">
              Good messages here tend to be short and specific: a date check, a budget check, or a final vote.
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 lg:block">
            <p className="text-xs uppercase tracking-[0.24em] text-charcoal/35">Realtime-ready</p>
            <SubmitButton label="Send message" pendingLabel="Sending..." className="w-full lg:mt-3" />
          </div>
        </div>
      </form>
    </Card>
  );
}
