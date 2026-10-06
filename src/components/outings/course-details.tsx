import type { GolfCourseOption } from "@/types/domain";

interface Props {
  course: Pick<GolfCourseOption, "name" | "locationLabel" | "summary">;
  inverted?: boolean;
}

export function CourseDetails({ course, inverted = false }: Props) {
  const query = [course.name, course.locationLabel].filter(Boolean).join(" ");
  const description = course.summary?.trim();
  const hasDescription = description && !description.endsWith("— added by organizer");

  return (
    <details className={`group mt-3 rounded-xl border px-3 py-2 ${inverted ? "border-white/20 bg-white/5" : "border-charcoal/10 bg-white/60"}`}>
      <summary className={`cursor-pointer text-sm font-medium marker:text-current ${inverted ? "text-cream/85" : "text-forest-900"}`}>
        Course details &amp; map
      </summary>
      <div className={`mt-2 border-t pt-2 text-sm ${inverted ? "border-white/15 text-cream/75" : "border-charcoal/10 text-charcoal/70"}`}>
        {course.locationLabel && <p className="font-medium">📍 {course.locationLabel}</p>}
        {hasDescription ? (
          <p className="mt-2 whitespace-pre-line">{description}</p>
        ) : (
          <p className="mt-2">No course description available yet.</p>
        )}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2 hover:opacity-75"
          >
            View on map ↗
          </a>
          {!hasDescription && (
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(query + " golf course")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:opacity-75"
            >
              Look up course ↗
            </a>
          )}
        </div>
      </div>
    </details>
  );
}
