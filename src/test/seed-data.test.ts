import { describe, it, expect } from "vitest";
import {
  SEED_PROJECTS,
  SEED_SKILLS,
  SEED_EXPERIENCE,
  SEED_TESTIMONIALS,
} from "@/data/seedData";

describe("seedData", () => {
  it("does not include id fields (DB generates them)", () => {
    [SEED_SKILLS, SEED_EXPERIENCE, SEED_TESTIMONIALS].forEach((rows) => {
      rows.forEach((r) => expect((r as Record<string, unknown>).id).toBeUndefined());
    });
  });

  it("provides expected counts of demo rows", () => {
    expect(SEED_PROJECTS.length).toBe(4);
    expect(SEED_SKILLS.length).toBeGreaterThanOrEqual(10);
    expect(SEED_EXPERIENCE.length).toBeGreaterThanOrEqual(3);
    expect(SEED_TESTIMONIALS.length).toBeGreaterThanOrEqual(3);
  });

  it("every project has a slug-style first tag for SVG mapping", () => {
    SEED_PROJECTS.forEach((p) => {
      expect(p.tags[0]).toMatch(/^[a-z][a-z0-9-]*$/);
    });
  });
});
