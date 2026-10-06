import { describe, expect, it } from "vitest";
import { courseAccess, discoverableCourse, courseAccessPriority } from "@/lib/course-access";
const course = (name: string, locationLabel = "Scottsdale, AZ") => ({ name, locationLabel });
describe("course access", () => {
  it("excludes the membership business and practice facilities", () => {
    expect(discoverableCourse(course("Epic Golf Club"))).toBe(false);
    expect(discoverableCourse(course("Downtown Golf Simulator"))).toBe(false);
  });
  it("labels verified restrictions instead of relying on review counts", () => {
    expect(courseAccess(course("Scottsdale National Golf Club")).kind).toBe("restricted");
    expect(courseAccess(course("Gainey Ranch Golf Club")).source).toContain("invitedclubs.com");
  });
  it("does not infer public or private access from country club names", () => {
    expect(courseAccess(course("Friendly Country Club")).kind).toBe("unknown");
  });
  it("keeps public access policies scoped to the right destination", () => {
    expect(courseAccess(course("Grayhawk Golf Club")).kind).toBe("public");
    expect(courseAccess(course("Grayhawk Golf Club", "Another city, MI")).kind).toBe("unknown");
  });
  it("prioritizes public courses ahead of unknown and restricted ones", () => {
    expect([course("Scottsdale National"),course("Other Club"),course("We-Ko-Pa Golf Club")].sort((a,b) => courseAccessPriority(a)-courseAccessPriority(b)).map(c=>c.name)).toEqual(["We-Ko-Pa Golf Club","Other Club","Scottsdale National"]);
  });
});
