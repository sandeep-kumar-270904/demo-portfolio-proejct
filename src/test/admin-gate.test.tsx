// End-to-end-ish guard: non-admin sessions get blocked from the /admin tabs,
// admin sessions reach the dashboard. Verifies the role gate without needing
// a real browser.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const session = {
  user: { id: "user-1", email: "test@example.com" },
};

let mockHasRole = false;

vi.mock("@/integrations/supabase/client", () => {
  return {
    supabase: {
      from: () => {
        const b: Record<string, unknown> = {};
        const chain = () => b;
        b.select = chain;
        b.order = vi.fn().mockResolvedValue({ data: [], error: null });
        b.eq = chain;
        return b;
      },
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session } }),
        onAuthStateChange: vi
          .fn()
          .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      rpc: vi.fn().mockImplementation(async (_fn: string) => ({
        data: mockHasRole,
        error: null,
      })),
    },
  };
});

// Stub Nav (uses scroll APIs not in jsdom).
vi.mock("@/components/Nav", () => ({ default: () => <nav data-testid="nav" /> }));
// Stub heavy admin tab modules (they all fetch on mount).
const stubTab = (label: string) => ({ default: () => <div>{label}-TAB</div> });
vi.mock("@/components/admin/ProjectsTab", () => stubTab("projects"));
vi.mock("@/components/admin/SkillsTab", () => stubTab("skills"));
vi.mock("@/components/admin/ExperienceTab", () => stubTab("experience"));
vi.mock("@/components/admin/TestimonialsTab", () => stubTab("testimonials"));
vi.mock("@/components/admin/BlogPostsTab", () => stubTab("blog_posts"));
vi.mock("@/components/admin/MessagesTab", () => stubTab("messages"));
vi.mock("@/components/admin/PostsTab", () => stubTab("posts"));

import Admin from "@/pages/Admin";

function renderAdmin() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/admin"]}>
        <Admin />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("/admin role gating", () => {
  beforeEach(() => {
    mockHasRole = false;
  });

  it("blocks non-admin users with the 'Not an admin' screen", async () => {
    mockHasRole = false;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText(/Not an admin/i)).toBeInTheDocument();
    });
    expect(screen.queryByText("projects-TAB")).toBeNull();
  });

  it("admin users see the dashboard, tabs and the Reseed button", async () => {
    mockHasRole = true;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    expect(screen.getByText("projects-TAB")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reseed demo data/i })).toBeInTheDocument();
  });
});
