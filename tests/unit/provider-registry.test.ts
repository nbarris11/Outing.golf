import { describe, expect, it } from "vitest";

import { getProviderDefinitions, getInventoryProviders } from "@/modules/providers/registry";

describe("provider registry", () => {
  it("defaults to implemented mock providers for active inventory flows", () => {
    const providers = getInventoryProviders();

    expect(providers.destinationSearch.definition.id).toBe("mock");
    expect(providers.golfCourse.definition.id).toBe("mock");
    expect(providers.lodging.definition.id).toBe("mock");
    expect(providers.teeTime.definition.id).toBe("mock");
    expect(providers.vacationRental.definition.id).toBe("mock");
  });

  it("documents planned official integrations alongside mock adapters", () => {
    const definitions = getProviderDefinitions();

    expect(definitions.destinationSearch.some((item) => item.id === "google_places")).toBe(true);
    expect(definitions.golfCourse.some((item) => item.id === "google_places")).toBe(true);
    expect(definitions.lodging.some((item) => item.id === "expedia_rapid")).toBe(true);
    expect(definitions.teeTime.some((item) => item.id === "golfnow")).toBe(true);
    expect(definitions.vacationRental.some((item) => item.id === "vrbo_compatible")).toBe(true);
  });
});
