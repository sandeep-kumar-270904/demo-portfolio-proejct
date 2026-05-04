// Simulates saving a project via the admin UI with a blank image URL,
// then re-renders the public Projects page and confirms the built-in SVG
// art is used (no <img> tag, but at least one <svg>).
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Shared in-memory "DB"
const db: { projects: Array<Record<string, unknown>> } = { projects: [] };
const insertSpy = vi.fn();

vi.mock("@/integrations/supabase/client", () => {
  const projectsBuilder = () => {
    const b: Record<string, unknown> = {};
    b.select = () => b;
    b.order = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ data: db.projects, error: null }));
    b.eq = () => b;
    b.insert = vi.fn().mockImplementation((row: Record<string, unknown>) => {
      insertSpy(row);
      db.projects.push({ id: `p${db.projects.length + 1}`, ...row });
      return Promise.resolve({ data: null, error: null });
    });
    b.update = () => Promise.resolve({ data: null, error: null });
    b.delete = () => b;
    return b;
  };
  return {
    supabase: {
      from: (table: string) => {
        if (table === "projects") return projectsBuilder();
        const empty: Record<string, unknown> = {};
        empty.select = () => empty;
        empty.order = () => Promise.resolve({ data: [], error: null });
        empty.eq = () => empty;
        return empty;
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

import ProjectsTab from "@/components/admin/ProjectsTab";
import Projects from "@/components/Projects";

function withQuery(node: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{node}</QueryClientProvider>;
}

describe("Admin save with null image_url → public Projects renders SVG", () => {
  beforeEach(() => {
    db.projects = [];
    insertSpy.mockClear();
    // @ts-expect-error - jsdom stub
    window.IntersectionObserver = class {
      observe() {}
      disconnect() {}
      unobserve() {}
    };
  });

  it("inserts a project with image_url=null then public page shows SVG (no <img>)", async () => {
    // 1) Render admin tab and create a new project with blank image URL
    render(<ProjectsTab />);
    fireEvent.change(screen.getByLabelText(/^Title$/i), {
      target: { value: "BuildFlow" },
    });
    fireEvent.change(screen.getByLabelText(/Tags \(comma\)/i), {
      target: { value: "buildflow, Next.js" },
    });
    fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /^Create$/i }));

    await waitFor(() => expect(insertSpy).toHaveBeenCalledTimes(1));
    const payload = insertSpy.mock.calls[0][0] as Record<string, unknown>;
    expect(payload.image_url).toBeNull();

    // 2) Now render the public Projects page – it reads from the same in-memory DB
    const { container } = render(withQuery(<Projects />));
    await waitFor(() => {
      expect(within(container).getAllByText("BuildFlow").length).toBeGreaterThan(0);
    });
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });
});
