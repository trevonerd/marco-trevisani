import { describe, expect, it } from "vitest";
import { profile } from "./profile";

describe("profile", () => {
  it("uses updated social links without Twitter", () => {
    const labels = profile.socialLinks.map((link) => link.label);

    expect(labels).toContain("Instagram");
    expect(labels).toContain("TikTok");
    expect(labels).toContain("YouTube");
    expect(labels).not.toContain("Twitter");
  });

  it("keeps Trevisoft as the side-project destination", () => {
    expect(profile.website).toBe("https://trevisoft.dev");
  });

  it("positions Marco as a lead frontend engineer", () => {
    expect(profile.title).toBe("Lead Frontend Engineer");
    expect(profile.highlights).toContain("Lead-level architecture");
  });
});
