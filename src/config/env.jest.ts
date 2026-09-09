// src/config/env.jest.ts
//
// Test-only substitute for env.ts (see moduleNameMapper in jest.config.js).
// import.meta syntax can't be parsed by Jest's transform at all, so this
// file re-exports the same names with plain literals instead - never
// imported directly by app code.
export const API_BASE_URL = "http://localhost:5000";
export const GOOGLE_CLIENT_ID: string | undefined = undefined;
export const CHATBOT_API_URL = "http://localhost:8000";
