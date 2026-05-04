// Verifies that ProjectsTab and SkillsTab search + category chips correctly
// narrow the visible rows and update the visible/total counter.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";

const projectRows = [
  { id: "p1", title: "BuildFlow", description: "", long_description: "", tags: ["buildflow"], tech_stack: ["Next.js"], live_url: null, github_url: null, image_url: null, featured: true, category: "SaaS", sort_order: 0, stats: [] },
  { id: "p2", title: "ShopNest", description: "", long_description: "", tags: ["shopnest"], tech_stack: ["Stripe"], live_url: null, github_url: null, image_url: null, featured: false, category: "E-Commerce", sort_order: 1, stats: [] },
  { id: "p3", title: "DevPulse", description: "", long_description: "", tags: ["devpulse"], tech_stack: ["Redis"], live_url: null, github_url: null, image_url: null, featured: false, category: "SaaS", sort_order: 2, stats: [] },
  { id: "p4", title: "CloudLink", description: "", long_description: "", tags: ["cloudlink"], tech_stack: ["Go"], live_url: null, github_url: null, image_url: null, featured: false, category: "DevOps", sort_order: 3, stats: [] },
];

const skillRows = [
  { id: "s1", name: "React", category: "Frontend", level: 95, icon: "⚛", sort_order: 0 },
  { id: "s2", name: "TypeScript", category: "Frontend", level: 92, icon: "TS", sort_order: 1 },
  { id: "s3", name: "Node.js", category: "Backend", level: 90, icon: "🟢", sort_order: 0 },
  { id: "s4", name: "PostgreSQL", category: "Database", level: 88, icon: "🐘", sort_order: 0 },
];

vi.mock("@/integrations/supabase/client", () => {
  const builder = (rows: unknown[]) => {
    const b: Record<string, unknown> = {};
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    // First .order returns same builder (chainable), second returns the promise.
    let orderCalls = 0;
    b.select = () => b;
    b.order = (...args: unknown[]) => {
      orderCalls += 1;
      if (orderCalls < 2) return b;
      return order(...args);
    };
    // For projects only one .order is used – also resolve directly when awaited.
    Object.assign(b, {
      then: (cb: (v: unknown) => unknown) =>
        Promise.resolve({ data: rows, error: null }).then(cb),
    });
    return b;
  };
  return {
    supabase: {
      from: (table: string) => {
        if (table === "projects") return builder(projectRows);
        if (table === "skills") return builder(skillRows);
        return builder([]);
      },
    },
  };
});

import ProjectsTab from "@/components/admin/ProjectsTab";
import SkillsTab from "@/components/admin/SkillsTab";

describe("Admin filter UI", () => {
  beforeEach(() => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("ProjectsTab: search narrows visible rows and updates counter", async () => {
    render(<ProjectsTab />);
    await waitFor(() => {
      expect(screen.getByTestId("projects-counter").textContent).toMatch(/4 \/ 4/);
    });
    fireEvent.change(screen.getByLabelText(/Search projects/i), {
      target: { value: "shop" },
    });
    expect(screen.getByTestId("projects-counter").textContent).toMatch(/1 \/ 4/);
    expect(screen.getByText("ShopNest")).toBeInTheDocument();
    expect(screen.queryByText("BuildFlow")).toBeNull();
  });

  it("ProjectsTab: category chip narrows to that category", async () => {
    render(<ProjectsTab />);
    await waitFor(() =>
      expect(screen.getByTestId("projects-counter").textContent).toMatch(/4 \/ 4/),
    );
    fireEvent.click(screen.getByRole("button", { name: "SaaS" }));
    expect(screen.getByTestId("projects-counter").textContent).toMatch(/2 \/ 4/);
    expect(screen.getByText("BuildFlow")).toBeInTheDocument();
    expect(screen.getByText("DevPulse")).toBeInTheDocument();
    expect(screen.queryByText("ShopNest")).toBeNull();
  });

  it("SkillsTab: search + category chips both narrow rows and counter", async () => {
    const { container } = render(<SkillsTab />);
    await waitFor(() =>
      expect(screen.getByTestId("skills-counter").textContent).toMatch(/4 \/ 4/),
    );
    // Search by name
    fireEvent.change(screen.getByLabelText(/Search skills/i), {
      target: { value: "react" },
    });
    expect(screen.getByTestId("skills-counter").textContent).toMatch(/1 \/ 4/);

    // Clear search and pick category
    fireEvent.change(screen.getByLabelText(/Search skills/i), { target: { value: "" } });
    expect(screen.getByTestId("skills-counter").textContent).toMatch(/4 \/ 4/);
    fireEvent.click(within(container).getByRole("button", { name: "Frontend" }));
    expect(screen.getByTestId("skills-counter").textContent).toMatch(/2 \/ 4/);
  });
});
