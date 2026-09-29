jest.mock("../../hooks/useHeroMedia", () => ({
  __esModule: true,
  useHeroMedia: jest.fn(),
}));

jest.mock("../../api/applicationService", () => ({
  __esModule: true,
  submitMembershipApplication: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HeroSection from "./HeroSection";
import { useHeroMedia } from "../../hooks/useHeroMedia";

const mockedUseHeroMedia = useHeroMedia as jest.Mock;

function renderHero() {
  return render(
    <MemoryRouter>
      <HeroSection />
    </MemoryRouter>,
  );
}

describe("<HeroSection />", () => {
  // No active hero media configured - the background falls back to the
  // static image, same as a real "nothing uploaded yet" homepage. The
  // background media carousel itself has its own dedicated tests.
  beforeEach(() => {
    mockedUseHeroMedia.mockReturnValue({
      media: [],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });
  });

  afterEach(() => jest.clearAllMocks());

  test("shows the tagline and no member roster - members live on their own homepage section/page, not in the hero", () => {
    renderHero();

    expect(screen.getByText("Innovate.")).toBeInTheDocument();
    expect(screen.getByText("Create.")).toBeInTheDocument();
    expect(screen.getByText("Build.")).toBeInTheDocument();
    expect(screen.queryByText("Full Stack Developer")).not.toBeInTheDocument();
  });
});

describe("<HeroSection /> rotating headline", () => {
  beforeEach(() => {
    mockedUseHeroMedia.mockReturnValue({
      media: [],
      loading: false,
      error: null,
      fetchMedia: jest.fn(),
    });
  });

  afterEach(() => jest.clearAllMocks());

  test("shows the first slide's headline on initial render", () => {
    renderHero();

    expect(
      screen.getByText("Empowering Developers, Driving Innovation."),
    ).toBeInTheDocument();
  });

  test("clicking a dot advances to that slide", async () => {
    const user = userEvent.setup();
    renderHero();

    await user.click(screen.getByLabelText("Show message 2 of 4"));

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

    await user.click(screen.getByLabelText("Show message 2 of 4"));

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
