jest.mock("../../api/member/member.api", () => ({
  __esModule: true,
  getMemberById: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { MemberDetailPage } from "./MemberDetailPage";
import { getMemberById } from "../../api/member/member.api";
import type { Member } from "../../types/member.types";

const mockedGetMemberById = getMemberById as jest.Mock;

const sampleMember: Member = {
  id: "member-1",
  userId: "user-1",
  name: "Jane Doe",
  role: "Backend Engineer",
  imageUrl: "https://example.com/jane.jpg",
  bio: "Builds reliable APIs.",
  education: {
    degree: "BSc Computer Science",
    institution: "University of Rwanda",
    description: "Studying core CS topics.",
    imageUrl: "https://example.com/campus.jpg",
    department: "College of Science and Technology",
    startYear: 2022,
    endYear: null,
    status: "Enrolled",
  },
  contacts: {
    linkedin: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe",
    portfolio: "https://janedoe.dev",
  },
  skillDetails: [],
  skillCategories: [
    {
      category: "Backend",
      overall: 85,
      skills: [{ name: "Node.js", percent: 90, technologies: [] }],
    },
  ],
  skills: ["Node.js"],
  hashtags: ["BackendDev", "UR"],
  resumeUrl: "https://example.com/resume.pdf",
  cvUrl: "https://example.com/cv.pdf",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderPage(id = "member-1") {
  return render(
    <MemoryRouter initialEntries={[`/members/${id}`]}>
      <Routes>
        <Route path="/members/:id" element={<MemberDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("MemberDetailPage", () => {
  beforeEach(() => {
    mockedGetMemberById.mockReset();
  });

  test("shows a loading skeleton before data resolves", () => {
    mockedGetMemberById.mockReturnValue(new Promise(() => {}));
    const { container } = renderPage();
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders real member data once loaded", async () => {
    mockedGetMemberById.mockResolvedValue(sampleMember);
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("Jane Doe").length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText("Backend Engineer").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Builds reliable APIs.").length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText(/View CV/)).toBeInTheDocument();
    expect(screen.getByText(/Resume/)).toBeInTheDocument();
    expect(screen.getByText("#BackendDev")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();

    // No leftover fictional static content
    expect(screen.queryByText(/Kigali, Rwanda/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Kinyarwanda/)).not.toBeInTheDocument();
  });

  test("shows a not-found message when the member doesn't exist", async () => {
    mockedGetMemberById.mockRejectedValue({
      statusCode: 404,
      message: "Member not found",
    });
    renderPage("unknown-id");

    await waitFor(() => {
      expect(screen.getByText(/Member not found/)).toBeInTheDocument();
    });
  });
});
