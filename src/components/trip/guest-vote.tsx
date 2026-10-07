import type { GolfCourseOption, LodgingOption, Vote } from "@/types/domain";
import { VoteButton } from "@/components/outings/vote-button";
import { CourseDetails } from "@/components/outings/course-details";
import { lodgingCost } from "@/lib/trip-plan";
import { currency } from "@/lib/utils";
export function GuestVote({
  outingId,
  profileId,
  courses,
  lodging,
  votes,
  nights,
  players,
  occupancy,
}: {
  outingId: string;
  profileId: string;
  courses: GolfCourseOption[];
  lodging: LodgingOption[];
  votes: Vote[];
  nights: number;
  players: number;
  occupancy: number;
}) {
  const mine = votes.filter((v) => v.profileId === profileId);
  return (
    <section
      id="vote"
      className="mt-5 scroll-mt-6 rounded-[28px] border border-forest-900/20 bg-white p-5 sm:p-6"
    >
      <p className="text-xs uppercase tracking-widest text-forest-900/60">
        Your next step
      </p>
      <h2 className="mt-2 font-serif text-2xl">Vote on courses & stays</h2>
      <p className="mt-2 text-sm text-charcoal/65">
        Vote for every option you&apos;d enjoy. Your picks are saved
        individually; tap a selected pick to remove it. The organizer makes the
        final call.
      </p>
      <p className="mt-2 text-sm font-medium">
        {mine.length
          ? `${mine.length} ${mine.length === 1 ? "pick" : "picks"} saved`
          : "No picks yet"}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 font-semibold">Courses</h3>
          {courses.length === 0 && (
            <p className="text-sm">
              The organizer is preparing the course shortlist.
            </p>
          )}
          {courses.map((c) => (
            <article key={c.id} className="mb-3 rounded-2xl border p-4">
              <h4 className="font-semibold">{c.name}</h4>
              <p className="my-2 text-sm">
                {c.averageGreensFee > 0
                  ? `${currency(c.averageGreensFee)}/round · estimate`
                  : "Rate to be confirmed"}
              </p>
              <VoteButton
                outingId={outingId}
                entityType="golf_course"
                entityId={c.id}
                isMyPick={mine.some(
                  (v) => v.entityType === "golf_course" && v.entityId === c.id,
                )}
                activeClassName="bg-emerald-100 text-emerald-900"
              />
              <CourseDetails course={c} />
            </article>
          ))}
        </div>
        {lodging.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold">Stays</h3>
            {lodging.map((l) => (
              <article key={l.id} className="mb-3 rounded-2xl border p-4">
                {l.thumbnailUrl && (
                  <img
                    src={l.thumbnailUrl}
                    alt={l.name}
                    className="mb-3 h-36 w-full rounded-xl object-cover"
                    loading="lazy"
                  />
                )}
                <h4 className="font-semibold">{l.name}</h4>
                <p className="my-2 text-sm">
                  {l.nightlyRate > 0
                    ? `${currency(lodgingCost(l.nightlyRate, nights, players, occupancy).perPerson)}/person · ${nights} nights`
                    : "Rate to be confirmed"}
                </p>
                <p className="mb-3 text-xs text-charcoal/60">
                  {lodgingCost(l.nightlyRate, nights, players, occupancy).rooms}{" "}
                  rooms · {occupancy} people/room · estimate before taxes and
                  fees
                </p>
                <VoteButton
                  outingId={outingId}
                  entityType="lodging"
                  entityId={l.id}
                  isMyPick={mine.some(
                    (v) => v.entityType === "lodging" && v.entityId === l.id,
                  )}
                  activeClassName="bg-emerald-100 text-emerald-900"
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
