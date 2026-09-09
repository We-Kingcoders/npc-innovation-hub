// src/config/env.ts
//
// Centralizes every Vite-injected env var read (import.meta.env.*) into one
// module, instead of each consumer reading import.meta.env directly.
//
// Vite replaces these at build time; Jest's transform can't parse
// import.meta syntax at all (it isn't run as native ESM), so any file that
// used import.meta.env directly broke the moment a test actually rendered
// it unmocked - this is exactly what happened to App.test.tsx once
// SocketContext.tsx (which read import.meta.env directly) got wired into
// the real component tree. Tests substitute this whole file for a
// literal-only version via moduleNameMapper (see jest.config.js) instead of
// needing Jest to understand import.meta at all.
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const GOOGLE_CLIENT_ID: string | undefined = import.meta.env
  .VITE_GOOGLE_CLIENT_ID as string | undefined;

// A separate FastAPI-based chatbot service (Hub-info/Help.tsx), not the
// main Express API above - was hardcoded to localhost:8000 with no way to
// point it at a real deployment. Configurable now; still defaults to
// localhost so local dev (start the FastAPI service, then the frontend)
// works exactly as before.
export const CHATBOT_API_URL: string =
  import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:8000";
