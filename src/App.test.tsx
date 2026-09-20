import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders without crashing", async () => {
    render(<App />);
    // Routes are lazy-loaded (see AllRoutes.tsx), so the real page renders
    // one tick after the Suspense fallback - findByRole waits for it
    // instead of asserting on the loading spinner. Explicit 5s timeout
    // (default is 1000ms): this was flaky pre-existing on a cold run -
    // ts-jest has to JIT-transform the whole "/" route's module graph
    // (AllRoutes.tsx's lazy() targets and everything they import) the
    // first time it's exercised in a given jest process, which can take
    // longer than 1s depending on machine load, well before React even
    // gets to resolve the lazy import and swap out the Suspense fallback.
    expect(
      await screen.findByRole("main", {}, { timeout: 5000 }),
    ).toBeInTheDocument();
  });
});
