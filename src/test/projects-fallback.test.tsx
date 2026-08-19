import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

// ---- Mock the supabase client BEFORE importing components ----
const projectRows = [
  {
    id: "p1",
    title: "BuildFlow",
    description: "PM system",
    long_description: "Real-time collab.",
    tags: ["buildflow", "Next.js"],
    tech_stack: ["Next.js", "Postgres"],
    live_url: "#",
    github_url: "#",
    image_url: null, // <-- key: no DB image, must use built-in SVG
    featured: true,
    category: "SaaS",
    sort_order: 0,
    stats: [{ value: "200+", label: "Active Users" }],
  },
];

vi.mock("@/integrations/supabase/client", () => {
  const builder = (rows: unknown[]) => {
    const b: Record<string, unknown> = {};
    const chain = () => b;
    b.select = chain;
    b.order = vi.fn().mockResolvedValue({ data: rows, error: null });
    b.eq = chain;
    return b;
  };
  return {
    supabase: {
      from: (table: string) => {
        if (table === "projects") return builder(projectRows);
        return builder([]);
      },
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi
          .fn()
          .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      },
    },
  };
});

import Projects from "@/components/Projects";

function withQuery(node: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{node}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe("Projects page (DB row without image_url)", () => {
  beforeEach(() => {
    // jsdom: noop IntersectionObserver
    // @ts-expect-error - test stub
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
    };
  });

  it("renders the project title and falls back to built-in SVG art when image_url is null", async () => {
    const { container } = render(withQuery(<Projects />));
    await waitFor(() => {
      expect(screen.getAllByText("BuildFlow").length).toBeGreaterThan(0);
    });
    // No <img> tag should be rendered (no DB image_url).
    expect(container.querySelector("img")).toBeNull();
    // The built-in SVG art is rendered instead.
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });
});
