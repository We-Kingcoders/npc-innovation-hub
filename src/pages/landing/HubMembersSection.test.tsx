const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useHeroMembers", () => ({
  __esModule: true,
  useHeroMembers: jest.fn(),
}));

jest.mock("../../api/member/member.api", () => ({
  __esModule: true,
  getPublicMembers: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useHeroMembers } from "../../hooks/useHeroMembers";
import { getPublicMembers } from "../../api/member/member.api";
import type { PublicMemberSummary } from "../../api/member/member.api";
import HubMembersSection from "./HubMembersSection";

const mockedUseHeroMembers = useHeroMembers as jest.Mock;
const mockedGetPublicMembers = getPublicMembers as jest.Mock;

const makeMember = (
  overrides: Partial<PublicMemberSummary> & { id: string },
): PublicMemberSummary => ({
  userId: `user-${overrides.id}`,
  name: `Member ${overrides.id}`,
  role: "Frontend Developer",
  imageUrl: `https://example.com/${overrides.id}.jpg`,
  ...overrides,
});

const curatedHero = (overrides: { memberId: string; order: number }) => ({
  id: `hero-${overrides.memberId}`,
  name: `Member ${overrides.memberId}`,
  role: "Frontend Developer",
  imageUrl: null,
  ...overrides,
});

const mockPage = (members: PublicMemberSummary[], totalPages = 1) => ({
  members,
  totalPages,
  currentPage: 1,
  totalMembers: members.length,
});

const noHeroMembers = () => {
  mockedUseHeroMembers.mockReturnValue({
    members: [],
    loading: false,
    error: null,
    fetchMembers: jest.fn(),
  });
};

describe("<HubMembersSection />", () => {
  beforeEach(() => {
    noHeroMembers();
    mockedGetPublicMembers.mockResolvedValue(mockPage([]));
  });

  afterEach(() => jest.clearAllMocks());

  test("renders every member fetched from the database, not just the curated one", async () => {
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({ id: "1", name: "Jane Doe", role: "Team Leader" }),
        makeMember({ id: "2", name: "John Smith", role: "Backend Developer" }),
        makeMember({ id: "3", name: "Aline Uwase", role: "UI Designer" }),
      ]),
    );

    render(<HubMembersSection />);

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Aline Uwase")).toBeInTheDocument();
    expect(screen.getByAltText("Jane Doe profile")).toHaveAttribute(
      "src",
      "https://example.com/1.jpg",
    );
  });

  /** Card names in document order; index 0 is the section's own <h2>. */
  const renderedNames = () =>
    screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);

  test("puts the top hero-curated member at the root of the tree", async () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [
        curatedHero({ memberId: "3", order: 1 }),
        curatedHero({ memberId: "2", order: 0 }),
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({ id: "1", name: "John Smith" }),
        makeMember({ id: "2", name: "Jane Doe" }),
        makeMember({ id: "3", name: "Aline Uwase" }),
      ]),
    );

    render(<HubMembersSection />);

    // order 0 wins, not whichever hero record happened to come back first.
    expect(await screen.findByText(/team leader/i)).toBeInTheDocument();
    expect(renderedNames()).toEqual([
      "Our Team Members",
      "Jane Doe",
      "John Smith",
      "Aline Uwase",
    ]);
  });

  test("finds the curated leader by name, the only id the public hero endpoint exposes", async () => {
    // GET /api/hero-members returns {name, imageUrl, role} and nothing else -
    // no memberId to match on, and already sorted by the admin's order.
    mockedUseHeroMembers.mockReturnValue({
      members: [
        { name: "Jane Doe", imageUrl: null, role: "Full-Stack Developer" },
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({ id: "1", name: "John Smith" }),
        makeMember({ id: "2", name: "Jane Doe" }),
      ]),
    );

    render(<HubMembersSection />);

    await screen.findByText("Jane Doe");
    expect(renderedNames()).toEqual([
      "Our Team Members",
      "Jane Doe",
      "John Smith",
    ]);
  });

  test("honours a legacy leadership role when nobody is hero-curated", async () => {
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({ id: "1", name: "John Smith", role: "Backend Developer" }),
        makeMember({ id: "2", name: "Jane Doe", role: "Team Leader" }),
      ]),
    );

    render(<HubMembersSection />);

    // Both the root badge and Jane's own role read "Team Leader".
    expect(await screen.findAllByText(/team leader/i)).toHaveLength(2);
    expect(renderedNames()).toEqual([
      "Our Team Members",
      "Jane Doe",
      "John Smith",
    ]);
  });

  test("falls back to the first member when there is no leader signal at all", async () => {
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({ id: "1", name: "John Smith" }),
        makeMember({ id: "2", name: "Jane Doe" }),
      ]),
    );

    render(<HubMembersSection />);

    await screen.findByText("John Smith");
    expect(renderedNames()).toEqual([
      "Our Team Members",
      "John Smith",
      "Jane Doe",
    ]);
  });

  test("shows at most three rows - the leader plus two rows of three", async () => {
    const members = Array.from({ length: 12 }, (_, i) =>
      makeMember({ id: String(i + 1), name: `Member ${i + 1}` }),
    );
    mockedGetPublicMembers.mockResolvedValue(mockPage(members));

    render(<HubMembersSection />);

    expect(await screen.findByText("Member 7")).toBeInTheDocument();
    expect(screen.queryByText("Member 8")).not.toBeInTheDocument();
    expect(screen.getByText(/showing 7 of 12 members/i)).toBeInTheDocument();
    expect(screen.getByText(/5 more in the directory/i)).toBeInTheDocument();
  });

  test("pulls in every page when the roster spans more than one", async () => {
    mockedGetPublicMembers
      .mockResolvedValueOnce(
        mockPage([makeMember({ id: "1", name: "Jane Doe" })], 2),
      )
      .mockResolvedValueOnce(
        mockPage([makeMember({ id: "2", name: "John Smith" })], 2),
      );

    render(<HubMembersSection />);

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(mockedGetPublicMembers).toHaveBeenCalledTimes(2);
    expect(mockedGetPublicMembers).toHaveBeenCalledWith(2, 100);
  });

  test("shows a loading skeleton while fetching", () => {
    mockedGetPublicMembers.mockReturnValue(new Promise(() => {}));

    render(<HubMembersSection />);

    expect(screen.getByLabelText(/loading hub members/i)).toBeInTheDocument();
  });

  test("shows a friendly message instead of a broken empty grid when there are no members", async () => {
    render(<HubMembersSection />);

    expect(await screen.findByText(/check back shortly/i)).toBeInTheDocument();
  });

  test("surfaces a failed fetch instead of pretending the hub has no members", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockedGetPublicMembers.mockRejectedValue({ message: "Network down" });

    render(<HubMembersSection />);

    expect(await screen.findByText("Network down")).toBeInTheDocument();
    expect(screen.queryByText(/check back shortly/i)).not.toBeInTheDocument();
  });

  test("navigates to /members when View All Members is clicked", async () => {
    render(<HubMembersSection />);

    await screen.findByText(/check back shortly/i);
    fireEvent.click(screen.getByText("View All Members"));

    expect(mockNavigate).toHaveBeenCalledWith("/members");
  });

  test("navigates to the member's real id when View Full Profile is clicked", async () => {
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([makeMember({ id: "1", userId: "user-1", name: "Jane Doe" })]),
    );

    render(<HubMembersSection />);

    fireEvent.click(await screen.findByText("View Full Profile"));

    expect(mockNavigate).toHaveBeenCalledWith("/members/user-1");
    expect(mockNavigate).not.toHaveBeenCalledWith("/members/undefined");
  });

  test("hides View Full Profile instead of navigating to /members/undefined when userId is missing", async () => {
    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({
          id: "1",
          name: "Jane Doe",
          userId: undefined as unknown as string,
        }),
      ]),
    );

    render(<HubMembersSection />);

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("View Full Profile")).not.toBeInTheDocument();
  });

  test("renders multiple members without a duplicate-key warning when ids are missing", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedGetPublicMembers.mockResolvedValue(
      mockPage([
        makeMember({
          id: undefined as unknown as string,
          userId: "user-1",
          name: "Jane Doe",
        }),
        makeMember({
          id: undefined as unknown as string,
          userId: "user-2",
          name: "John Smith",
        }),
      ]),
    );

    render(<HubMembersSection />);

    await screen.findByText("Jane Doe");
    await waitFor(() => {
      const keyWarning = consoleError.mock.calls.some((call) =>
        String(call[0]).includes("unique"),
      );
      expect(keyWarning).toBe(false);
    });

    consoleError.mockRestore();
  });
});
