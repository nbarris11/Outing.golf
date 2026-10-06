import { courseAccess } from "@/lib/course-access";
import type { GolfCourseOption } from "@/types/domain";
export function CourseAccessLabel({ course }: { course: Pick<GolfCourseOption, "name" | "locationLabel"> }) {
  const access = courseAccess(course);
  return <p className={`mt-1 text-xs ${access.kind === "public" ? "text-forest-900" : "text-amber-800"}`}>
    {access.label}{access.source && <> · <a href={access.source} target="_blank" rel="noopener noreferrer" className="underline">Access policy ↗</a></>}
  </p>;
}
