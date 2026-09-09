import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders without crashing", async () => {
    render(<App />);
    // Routes are lazy-loaded (see AllRoutes.tsx), so the real page renders
    // one tick after the Suspense fallback - findByRole waits for it
    // instead of asserting on the loading spinner.
    expect(await screen.findByRole("main")).toBeInTheDocument();
  });
});
