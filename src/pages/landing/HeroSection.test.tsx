jest.mock("../../hooks/useHeroMembers", () => ({
  __esModule: true,
  useHeroMembers: jest.fn(),
}));

jest.mock("../../api/applicationService", () => ({
  __esModule: true,
  submitMembershipApplication: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
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
