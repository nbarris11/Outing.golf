import type { GolfCourseOption } from "@/types/domain";

type CourseIdentity = Pick<GolfCourseOption, "name" | "locationLabel">;
export type CourseAccess = { kind: "public" | "restricted" | "unknown" | "not-course"; label: string; source?: string };

// Official operator policies checked 2026-10-06. Location matching avoids
// applying a similarly named club's policy to a different facility.
const verified = [
  { name: /\bepic golf club\b/i, kind: "not-course", label: "Membership network, not a golf course", source: "https://epicgolfclub.com/" },
  { name: /scottsdale national/i, kind: "restricted", label: "Private · invitation required", source: "https://sngc.com/" },
  { name: /gainey ranch/i, kind: "restricted", label: "Restricted access · check guest eligibility", source: "https://www.invitedclubs.com/clubs/gainey-ranch-golf-club/membership" },
  { name: /we[- ]?ko[- ]?pa/i, kind: "public", label: "Public tee times", source: "https://wekopa.com/book-online-tee-time-reservations/" },
  { name: /grayhawk/i, kind: "public", label: "Public tee times", source: "https://grayhawkgolf.com/" },
  { name: /tpc scottsdale/i, kind: "public", label: "Public tee times", source: "https://tpc.com/scottsdale/about/" },
] satisfies Array<{ name: RegExp } & CourseAccess>;

export function courseAccess(course: CourseIdentity): CourseAccess {
  if (/scottsdale|fort mcdowell|arizona|\bAZ\b/i.test(course.locationLabel)) {
    const policy = verified.find(p => p.name.test(course.name));
    if (policy) return policy;
  }
  if (/\b(pro\s?shop|golf shop|golf store|golf academy|driving range|mini(?:ature)? golf|indoor golf|golf simulator|golf membership|golf society)\b/i.test(course.name))
    return { kind: "not-course", label: "Practice, retail, or membership facility" };
  if (/\b(members? only|invitation[ -]only|invite[ -]only|private club)\b|[-–—]\s*private\b/i.test(course.name))
    return { kind: "restricted", label: "Private access indicated · check eligibility" };
  // Names, star ratings, and review counts do not establish public access.
  return { kind: "unknown", label: "Visitor access unverified · check with course" };
}
export function courseAccessPriority(course: CourseIdentity) {
  return { public: 0, unknown: 1, restricted: 2, "not-course": 3 }[courseAccess(course).kind];
}
export function discoverableCourse(course: CourseIdentity) {
  return courseAccess(course).kind !== "not-course";
}
