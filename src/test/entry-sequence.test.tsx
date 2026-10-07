import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, onAnimationComplete, initial, animate, transition, ...props }: { children?: ReactNode; onAnimationComplete?: () => void; initial?: unknown; animate?: unknown; transition?: unknown }) => <div {...props} onTransitionEnd={onAnimationComplete}>{children}</div>,
    p: ({ children, initial, animate, transition, ...props }: { children?: ReactNode; initial?: unknown; animate?: unknown; transition?: unknown }) => <p {...props}>{children}</p>,
    h2: ({ children, onAnimationComplete, initial, animate, transition, ...props }: { children?: ReactNode; onAnimationComplete?: () => void; initial?: unknown; animate?: unknown; transition?: unknown }) => <h2 {...props} onTransitionEnd={onAnimationComplete}>{children}</h2>,
  },
}));
import EntryAnimation, { ENTRY_GAP_MS, ENTRY_HOLD_MS, ENTRY_PHRASES, ENTRY_SESSION_KEY } from "@/components/EntryAnimation";

const mount = (path = "/") => render(<MemoryRouter initialEntries={[path]}><EntryAnimation><main>Portfolio</main></EntryAnimation></MemoryRouter>);
beforeEach(() => { localStorage.clear(); vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe("readable sequential intro", () => {
  it("waits for every reveal, full hold, and fade before mounting the portfolio", () => {
    mount();
    ENTRY_PHRASES.forEach((phrase, index) => {
      expect(screen.queryByRole("main")).toBeNull();
      expect(screen.getAllByRole("heading")).toHaveLength(1);
      expect(screen.getByRole("heading", { name: phrase })).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(10000));
      expect(screen.getByTestId("portfolio-intro")).toHaveAttribute("data-phase", "reveal");
      fireEvent.transitionEnd(screen.getByRole("heading"));
      act(() => vi.advanceTimersByTime(ENTRY_HOLD_MS[index] - 1));
      expect(screen.getByTestId("portfolio-intro")).toHaveAttribute("data-phase", "hold");
      act(() => vi.advanceTimersByTime(1));
      expect(screen.getByTestId("portfolio-intro")).toHaveAttribute("data-phase", "fade");
      fireEvent.transitionEnd(screen.getByRole("heading"));
      act(() => vi.advanceTimersByTime(ENTRY_GAP_MS));
    });
    expect(screen.queryByRole("main")).toBeNull();
    expect(localStorage.getItem(ENTRY_SESSION_KEY)).toBeNull();
    fireEvent.transitionEnd(screen.getByTestId("portfolio-intro"));
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(localStorage.getItem(ENTRY_SESSION_KEY)).toBe("1");
  });

  it("does not replay a completed session", () => {
    localStorage.setItem(ENTRY_SESSION_KEY, "1");
    mount();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("does not obstruct direct project links", () => {
    mount("/projects/example");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("opening clicks and ordinary keys do not dismiss the intro", () => {
    mount();
    fireEvent.click(screen.getByTestId("portfolio-intro"));
    fireEvent.keyDown(window, { key: "Enter" });
    expect(screen.queryByRole("main")).toBeNull();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});