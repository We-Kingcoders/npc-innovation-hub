jest.mock("../../api/member/member.api", () => ({
  __esModule: true,
  getPublicMembers: jest.fn(),
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { InnovationHubMembersPage } from "./InnovationHubMembersPage";
import { getPublicMembers } from "../../api/member/member.api";
import type { PublicMembersPage } from "../../api/member/member.api";

const mockedGetPublicMembers = getPublicMembers as jest.Mock;

const samplePage: PublicMembersPage = {
  members: [
    {
      id: "member-1",
      userId: "user-1",
      name: "Jane Doe",
      role: "Backend Engineer",
      imageUrl: "https://example.com/jane.jpg",
      techStack: ["Node.js"],
      tagline: "Builds APIs",
      available: true,
    },
    {
      id: "member-2",
      userId: "user-2",
      name: "John Smith",
      role: "Frontend Engineer",
      techStack: ["React"],
      tagline: "Builds UIs",
      available: false,
    },
  ],
  totalPages: 3,
  currentPage: 1,
  totalMembers: 13,
};

function renderPage() {
  return render(
    <MemoryRouter>
      <InnovationHubMembersPage />
    </MemoryRouter>,
  );
}

describe("InnovationHubMembersPage", () => {
  beforeEach(() => {
    mockedGetPublicMembers.mockReset();
  });

  test("shows a loading skeleton before data resolves", () => {
    mockedGetPublicMembers.mockReturnValue(new Promise(() => {}));
    const { container } = renderPage();
    expect(container.querySelector(".ihp-skeleton")).toBeInTheDocument();
  });

  test("renders real members and pagination once loaded", async () => {
    mockedGetPublicMembers.mockResolvedValue(samplePage);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(mockedGetPublicMembers).toHaveBeenCalledWith(1, 6);
    expect(screen.getByText("13")).toBeInTheDocument(); // totalMembers stat
    expect(screen.getByLabelText("Page 3")).toBeInTheDocument();
  });

  test("shows an error message when the request fails", async () => {
    mockedGetPublicMembers.mockRejectedValue(new Error("Network error"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  test("surfaces the real API error message instead of a generic fallback", async () => {
    // Matches the shape apiClient's response interceptor actually rejects
    // with: a plain object, not an Error instance.
    mockedGetPublicMembers.mockRejectedValue({
      statusCode: 404,
      message: "Route not found",
    });
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Route not found")).toBeInTheDocument();
    });
    expect(screen.queryByText("Unknown error")).not.toBeInTheDocument();
  });

  test("navigates to the member's userId, not their Member.id, when viewing a profile", async () => {
    mockedGetPublicMembers.mockResolvedValue(samplePage);
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<InnovationHubMembersPage />} />
          <Route
            path="/members/:id"
            element={<div>Viewing member user-1</div>}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: "View Jane Doe's profile" }),
      );
    });

    expect(screen.getByText("Viewing member user-1")).toBeInTheDocument();
  });
});
