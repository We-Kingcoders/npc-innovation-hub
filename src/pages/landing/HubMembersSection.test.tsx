const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useHeroMembers", () => ({
  __esModule: true,
  useHeroMembers: jest.fn(),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { useHeroMembers } from "../../hooks/useHeroMembers";
import HubMembersSection from "./HubMembersSection";

const mockedUseHeroMembers = useHeroMembers as jest.Mock;

describe("<HubMembersSection />", () => {
  afterEach(() => jest.clearAllMocks());

  test("renders real fetched member data", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [
        {
          id: "hm-1",
          memberId: "member-1",
          name: "Jane Doe",
          imageUrl: "https://example.com/jane.jpg",
          role: "Full Stack Developer",
          order: 0,
        },
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
    expect(screen.getByAltText("Jane Doe profile")).toHaveAttribute(
      "src",
      "https://example.com/jane.jpg",
    );
  });

  test("shows a loading skeleton while fetching", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [],
      loading: true,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    expect(screen.getByLabelText(/loading hero members/i)).toBeInTheDocument();
  });

  test("shows a friendly message instead of a broken empty grid when there are no featured members", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    expect(screen.getByText(/check back shortly/i)).toBeInTheDocument();
  });

  test("navigates to /members when View All Members is clicked", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    fireEvent.click(screen.getByText("View All Members"));

    expect(mockNavigate).toHaveBeenCalledWith("/members");
  });

  test("navigates to the member's real id when View Full Profile is clicked", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [
        {
          id: "hm-1",
          memberId: "member-1",
          name: "Jane Doe",
          imageUrl: "https://example.com/jane.jpg",
          role: "Full Stack Developer",
          order: 0,
        },
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    fireEvent.click(screen.getByText("View Full Profile"));

    expect(mockNavigate).toHaveBeenCalledWith("/members/member-1");
    expect(mockNavigate).not.toHaveBeenCalledWith("/members/undefined");
  });

  test("hides View Full Profile instead of navigating to /members/undefined when memberId is missing", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [
        {
          id: "hm-1",
          memberId: undefined,
          name: "Jane Doe",
          imageUrl: "https://example.com/jane.jpg",
          role: "Full Stack Developer",
          order: 0,
        },
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("View Full Profile")).not.toBeInTheDocument();
  });

  test("renders multiple hero members without a duplicate-key warning when memberId is missing", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockedUseHeroMembers.mockReturnValue({
      members: [
        {
          id: "hm-1",
          memberId: undefined,
          name: "Jane Doe",
          imageUrl: null,
          role: "Full Stack Developer",
          order: 0,
        },
        {
          id: "hm-2",
          memberId: undefined,
          name: "John Smith",
          imageUrl: null,
          role: "Backend Developer",
          order: 1,
        },
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    render(<HubMembersSection />);

    const keyWarning = consoleError.mock.calls.some((call) =>
      String(call[0]).includes("unique"),
    );
    expect(keyWarning).toBe(false);

    consoleError.mockRestore();
  });
});
