jest.mock("../../api/member/member.api", () => ({
  __esModule: true,
  getPublicMembers: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
});
