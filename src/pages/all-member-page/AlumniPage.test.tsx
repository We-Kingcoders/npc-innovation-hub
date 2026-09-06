jest.mock("../../api/member/alumni.api", () => ({
  __esModule: true,
  getAlumni: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AlumniPage } from "./AlumniPage";
import { getAlumni } from "../../api/member/alumni.api";
import type { AlumniSummary } from "../../api/member/alumni.api";

const mockedGetAlumni = getAlumni as jest.Mock;

const sampleAlumni: AlumniSummary[] = [
  {
    name: "Grace Uwase",
    imageUrl: "https://example.com/grace.jpg",
    role: "Product Manager",
  },
  { name: "Eric Habimana", imageUrl: null, role: "Software Engineer" },
];

function renderPage() {
  return render(
    <MemoryRouter>
      <AlumniPage />
    </MemoryRouter>,
  );
}

describe("AlumniPage", () => {
  beforeEach(() => {
    mockedGetAlumni.mockReset();
  });

  test("shows a loading skeleton before data resolves", () => {
    mockedGetAlumni.mockReturnValue(new Promise(() => {}));
    const { container } = renderPage();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders real alumni once loaded", async () => {
    mockedGetAlumni.mockResolvedValue(sampleAlumni);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    });

    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("Eric Habimana")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    // Missing imageUrl falls back to initials, not a broken image
    expect(screen.getByText("EH")).toBeInTheDocument();
  });

  test("shows a graceful empty state, not an error, when there are no alumni yet", async () => {
    mockedGetAlumni.mockResolvedValue([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("No alumni yet")).toBeInTheDocument();
    });
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  test("shows an error message when the request fails", async () => {
    mockedGetAlumni.mockRejectedValue(new Error("Network error"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("renders a promoted member and a standalone alumnus together", async () => {
    // Both sources come back through the same AlumniSummary shape from the
    // backend's merged response — the page shouldn't need to know which
    // underlying model (Member vs Alumnus) each entry came from.
    mockedGetAlumni.mockResolvedValue([
      { name: "Promoted Member", imageUrl: null, role: "Backend Developer" },
      { name: "Standalone Alumnus", imageUrl: null, role: "Other" },
    ]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Promoted Member")).toBeInTheDocument();
    });
    expect(screen.getByText("Standalone Alumnus")).toBeInTheDocument();
  });

  test("does not crash when the response contains a malformed entry", async () => {
    mockedGetAlumni.mockResolvedValue([
      undefined as unknown as AlumniSummary,
      { name: "", imageUrl: null, role: "Other" },
      sampleAlumni[0],
    ]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    });
    // The entry with a blank name falls back instead of crashing on .split().
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
