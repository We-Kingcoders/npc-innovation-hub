// Integration-level check: unlike AlumniSection.test.tsx (which mocks
// useAlumni directly), this exercises the REAL, unmocked getAlumni()
// parsing against the exact response body confirmed live from
// GET /api/alumni via Swagger, to prove the whole chain — not just one
// layer in isolation — handles it correctly.
jest.mock("../../api/client", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import { render, screen, waitFor } from "@testing-library/react";
import apiClient from "../../api/client";
import AlumniSection from "./AlumniSection";

const mockedGet = apiClient.get as jest.Mock;

const LIVE_RESPONSE_BODY = {
  status: "success",
  results: 2,
  data: {
    alumni: [
      {
        name: "Entue MUGABO",
        imageUrl: "https://example.com/entue.jpg",
        role: "Full-Stack Developer",
      },
      {
        name: "Olivier IRADUKUNDA",
        imageUrl: "https://example.com/olivier.jpg",
        role: "Cybersecurity Specialist",
      },
    ],
  },
};

describe("AlumniSection against the confirmed live GET /api/alumni response", () => {
  test("renders both real alumni from the exact confirmed response body", async () => {
    mockedGet.mockResolvedValue({ data: LIVE_RESPONSE_BODY });

    render(<AlumniSection />);

    await waitFor(() => {
      expect(screen.getByText("Entue MUGABO")).toBeInTheDocument();
    });

    expect(screen.getByText("Full-Stack Developer")).toBeInTheDocument();
    expect(screen.getByText("Olivier IRADUKUNDA")).toBeInTheDocument();
    expect(screen.getByText("Cybersecurity Specialist")).toBeInTheDocument();
  });
});
