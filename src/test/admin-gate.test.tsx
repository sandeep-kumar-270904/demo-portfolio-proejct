// End-to-end-ish guard: non-admin sessions get blocked from the /admin tabs,
// admin sessions reach the dashboard. Verifies the role gate without needing
// a real browser.
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let mockHasRole = false;

vi.mock("@/integrations/supabase/client", () => {
  const session = { user: { id: "user-1", email: "test@example.com" } };
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
vi.mock("@/components/admin/ProjectsTab", () => ({ default: () => <div>projects-TAB</div> }));
vi.mock("@/components/admin/SkillsTab", () => ({ default: () => <div>skills-TAB</div> }));
vi.mock("@/components/admin/ExperienceTab", () => ({ default: () => <div>experience-TAB</div> }));
vi.mock("@/components/admin/TestimonialsTab", () => ({ default: () => <div>testimonials-TAB</div> }));
vi.mock("@/components/admin/BlogPostsTab", () => ({ default: () => <div>blog_posts-TAB</div> }));
vi.mock("@/components/admin/MessagesTab", () => ({ default: () => <div>messages-TAB</div> }));
vi.mock("@/components/admin/PostsTab", () => ({ default: () => <div>posts-TAB</div> }));
vi.mock("@/components/admin/SiteContentTab", () => ({ default: () => <div>site-TAB</div> }));

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
    expect(screen.queryByText("site-TAB")).toBeNull();
  });

  it("admin users see the dashboard, tabs and the Reseed button", async () => {
    mockHasRole = true;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    expect(screen.getByText("site-TAB")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reseed demo data/i })).toBeInTheDocument();
  });
});
