jest.mock("../../hooks/useHeroMembers", () => ({
  __esModule: true,
  useHeroMembers: jest.fn(),
}));

jest.mock("../../api/applicationService", () => ({
  __esModule: true,
  submitMembershipApplication: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useHeroMembers } from "../../hooks/useHeroMembers";

const mockedUseHeroMembers = useHeroMembers as jest.Mock;

function renderHero() {
  return render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );
}

describe("<HeroSection />", () => {
  afterEach(() => jest.clearAllMocks());

  test("renders real hero-member data in the carousel instead of hardcoded names", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [
        {
          id: "hm-1",
          memberId: "member-1",
          name: "Jane Doe",
          role: "Full Stack Developer",
          imageUrl: "https://example.com/jane.jpg",
          order: 0,
        },
      ],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    renderHero();

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
    expect(screen.queryByText("Sarah Chen")).not.toBeInTheDocument();
  });

  test("does not crash when there are no hero members yet", () => {
    mockedUseHeroMembers.mockReturnValue({
      members: [],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });

    renderHero();

    expect(screen.queryByText("Sarah Chen")).not.toBeInTheDocument();
  });
});

describe("<HeroSection /> rotating headline", () => {
  beforeEach(() => {
    mockedUseHeroMembers.mockReturnValue({
      members: [],
      loading: false,
      error: null,
      fetchMembers: jest.fn(),
    });
  });

  afterEach(() => jest.clearAllMocks());

  test("shows the first slide's headline on initial render", () => {
    renderHero();

    expect(
      screen.getByText("Empowering Developers, Driving Innovation."),
    ).toBeInTheDocument();
  });

  test("clicking 'Next message' advances to the second slide", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByLabelText("Next message"));

    await waitFor(() => {
      expect(
        screen.getByText("Where Students Become Builders."),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText("Empowering Developers, Driving Innovation."),
    ).not.toBeInTheDocument();
  });

  test("clicking a dot jumps directly to that slide", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByLabelText("Show message 4 of 4"));

    await waitFor(() => {
      expect(
        screen.getByText("Innovation With a Career Path."),
      ).toBeInTheDocument();
    });
  });

  test("the 'Join Us' button stays the same across every slide", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByLabelText("Next message"));

    await waitFor(() => {
      expect(
        screen.getByText("Where Students Become Builders."),
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "Join NpcInnovationHub" }),
    ).toBeInTheDocument();
  });
});
