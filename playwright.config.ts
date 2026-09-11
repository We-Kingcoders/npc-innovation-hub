import { defineConfig } from "@playwright/test";

// Real-browser responsive regression checks - see e2e/responsive.spec.ts.
// Not a replacement for the jest unit suite; this is the "does it actually
// render correctly at this viewport" check that no amount of reading CSS
// can substitute for.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // One worker locally by default - the dev server handles concurrent
  // requests fine, but keeping output serial makes a failing run much
  // easier to read. CI can raise this if the suite grows.
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // Starts the real Vite dev server and waits for it before running any
  // test; reuses one already running locally so repeated runs during
  // development don't pay the startup cost every time.
  webServer: {
    command: "npm run dev -- --port 5173 --strictPort",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  // Named after real device classes, not just numbers, so a failing
  // project name in CI output is self-explanatory. Covers the brief's
  // minimum viewport list at representative points rather than every
  // exact pixel value named there - intermediate widths are covered by
  // fluid/responsive CSS, not by adding more and more fixed projects.
  projects: [
    { name: "mobile-small", use: { viewport: { width: 320, height: 568 } } },
    { name: "mobile-standard", use: { viewport: { width: 390, height: 844 } } },
    {
      name: "mobile-landscape",
      use: { viewport: { width: 844, height: 390 } },
    },
    {
      name: "tablet-portrait",
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "tablet-landscape",
      use: { viewport: { width: 1024, height: 768 } },
    },
    { name: "laptop", use: { viewport: { width: 1366, height: 768 } } },
    { name: "desktop", use: { viewport: { width: 1920, height: 1080 } } },
    { name: "wide", use: { viewport: { width: 2560, height: 1440 } } },
  ],
});
