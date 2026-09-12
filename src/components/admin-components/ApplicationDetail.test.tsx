jest.mock("../../hooks/useApplications", () => ({
  __esModule: true,
  useApplication: jest.fn(),
}));

// Sidebar/Topbar need an AuthProvider (useAuth) and aren't what this test
// is about - stub them out so this stays a focused test of the "Review"
// metadata section instead of a full-page integration test.
jest.mock("./Sidebar", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("./Topbar", () => ({
  __esModule: true,
  default: () => null,
}));

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ApplicationDetail from "./ApplicationDetail";
import { useApplication } from "../../hooks/useApplications";

const mockedUseApplication = useApplication as jest.Mock;

const baseApplication = {
  id: "app-1",
  imageUrl: null,
  fullName: "Jane Doe",
  email: "jane@example.com",
  githubUrl: "https://github.com/jane",
  skills: ["React"],
  phoneNumber: "+250781234567",
  gender: "Female",
  strengths: "Fast learner",
  weaknesses: "Impatient",
  applicationLetterUrl: "https://files.example.com/letter.pdf",
  status: "Accepted",
  reviewedBy: "a1111111-1111-4111-8111-111111111111",
  reviewedAt: "2026-01-02T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const renderDetail = () =>
  render(
    <MemoryRouter initialEntries={["/admin/applications/app-1"]}>
      <Routes>
        <Route path="/admin/applications/:id" element={<ApplicationDetail />} />
      </Routes>
    </MemoryRouter>,
  );

describe("ApplicationDetail - Reviewed By", () => {
  const noop = () => {};

  test("shows the reviewer's name, not the raw reviewedBy id", () => {
    mockedUseApplication.mockReturnValue({
      application: {
        ...baseApplication,
        reviewer: {
          id: "a1111111-1111-4111-8111-111111111111",
          firstName: "Alice",
          lastName: "Admin",
        },
      },
      loading: false,
      error: null,
      fetchApplication: noop,
      handleAccept: noop,
      handleReject: noop,
    });

    renderDetail();

    expect(screen.getByText("Alice Admin")).toBeInTheDocument();
    expect(
      screen.queryByText("a1111111-1111-4111-8111-111111111111"),
    ).not.toBeInTheDocument();
  });

  test("falls back to an em dash when no reviewer is present", () => {
    mockedUseApplication.mockReturnValue({
      application: { ...baseApplication, reviewer: null },
      loading: false,
      error: null,
      fetchApplication: noop,
      handleAccept: noop,
      handleReject: noop,
    });

    renderDetail();

    expect(screen.getByText("Reviewed By").nextSibling).toHaveTextContent("—");
  });
});
