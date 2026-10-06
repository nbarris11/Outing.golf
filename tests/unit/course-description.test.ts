import { describe, it, expect } from "vitest";
import {
  extractCourseDescription,
  courseWebsiteDescription,
} from "@/modules/providers/course-description";
describe("course website descriptions", () => {
  it("reads description attributes in either order", () =>
    expect(
      extractCourseDescription(
        '<meta content="Play our two championship golf courses &amp; enjoy mountain views." name="description">',
      ),
    ).toBe("Play our two championship golf courses & enjoy mountain views."));
  it("handles an absent description", () =>
    expect(extractCourseDescription("<title>Golf</title>")).toBeNull());
  it("rejects local network sources", async () =>
    expect(await courseWebsiteDescription("https://127.0.0.1")).toBeNull());
  it("rejects non-HTTPS sources", async () =>
    expect(await courseWebsiteDescription("http://example.com")).toBeNull());
});
