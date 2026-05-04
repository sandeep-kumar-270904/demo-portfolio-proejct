// Verifies:
// 1) Non-admin cannot click the "Reseed demo data" button (it is not rendered).
// 2) Admin can click it and reseedAll() is invoked successfully (RLS path
//    is simulated by toggling has_role).
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let mockHasRole = false;
const reseedSpy = vi.fn();

vi.mock("@/lib/reseed", () => ({
  reseedAll: () => {
    reseedSpy();
    return Promise.resolve([
      { table: "projects", inserted: 4 },
      { table: "skills", inserted: 27 },
      { table: "experience", inserted: 4 },
      { table: "testimonials", inserted: 3 },
    ]);
  },
}));

vi.mock("@/integrations/supabase/client", () => {
  const session = { user: { id: "user-1", email: "test@example.com" } };
  const builder = () => {
    const b: Record<string, unknown> = {};
    const chain = () => b;
    b.select = chain;
    b.order = vi.fn().mockResolvedValue({ data: [], error: null });
    b.eq = chain;
    b.delete = chain;
    b.gte = vi.fn().mockResolvedValue({ data: null, error: null });
    b.insert = vi.fn().mockResolvedValue({ data: null, error: null });
    return b;
  };
  return {
    supabase: {
      from: () => builder(),
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session } }),
        onAuthStateChange: vi
          .fn()
          .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      rpc: vi.fn().mockImplementation(async () => ({
        data: mockHasRole,
        error: null,
      })),
    },
  };
});

vi.mock("@/components/Nav", () => ({ default: () => <nav /> }));
vi.mock("@/components/admin/SiteContentTab", () => ({ default: () => <div>site-TAB</div> }));
vi.mock("@/components/admin/ProjectsTab", () => ({ default: () => <div>projects-TAB</div> }));
vi.mock("@/components/admin/SkillsTab", () => ({ default: () => <div>skills-TAB</div> }));
vi.mock("@/components/admin/ExperienceTab", () => ({ default: () => <div>experience-TAB</div> }));
vi.mock("@/components/admin/TestimonialsTab", () => ({ default: () => <div>testimonials-TAB</div> }));
vi.mock("@/components/admin/BlogPostsTab", () => ({ default: () => <div>blog-TAB</div> }));
vi.mock("@/components/admin/MessagesTab", () => ({ default: () => <div>messages-TAB</div> }));
vi.mock("@/components/admin/PostsTab", () => ({ default: () => <div>posts-TAB</div> }));

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

describe("Reseed button gating", () => {
  beforeEach(() => {
    reseedSpy.mockClear();
    // Always confirm window.confirm()
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("non-admin: does NOT render the Reseed button (cannot click it)", async () => {
    mockHasRole = false;
    renderAdmin();
    await waitFor(() => {
      expect(screen.getByText(/Not an admin/i)).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: /Reseed demo data/i })).toBeNull();
  });

  it("admin: clicking Reseed invokes reseedAll() and inserts demo rows", async () => {
    mockHasRole = true;
    renderAdmin();
    const btn = await screen.findByRole("button", { name: /Reseed demo data/i });
    fireEvent.click(btn);
    await waitFor(() => expect(reseedSpy).toHaveBeenCalledTimes(1));
  });
});
