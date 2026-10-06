import { describe, expect, it } from "vitest";
import { rateFreshness } from "@/lib/rate-freshness";
describe("saved lodging rate checks", () => {
  it("does not invent a last-checked date for legacy rates", () => {
    expect(rateFreshness({tags:[]})).toEqual({checkedAt:null,datesMismatch:false});
  });
  it("preserves the actual quote timestamp and detects changed dates", () => {
    const stay = {tags:["rate-checked:2026-10-06T18:00:00.000Z", "rate-start:2027-03-12", "rate-end:2027-03-15"]};
    expect(rateFreshness(stay,"2027-03-12","2027-03-15")).toEqual({checkedAt:"2026-10-06T18:00:00.000Z",datesMismatch:false});
    expect(rateFreshness(stay,"2027-04-12","2027-04-15").datesMismatch).toBe(true);
  });
  it("ignores malformed timestamps", () => {
    expect(rateFreshness({tags:["rate-checked:invalid"]}).checkedAt).toBeNull();
  });
});
