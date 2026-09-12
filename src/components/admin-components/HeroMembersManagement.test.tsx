jest.mock("../../api/admin/heroMembers.api", () => ({
  __esModule: true,
  getHeroMembers: jest.fn(),
  getMembersPicker: jest.fn(),
  addHeroMember: jest.fn(),
  removeHeroMember: jest.fn(),
  reorderHeroMembers: jest.fn(),
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HeroMembersManagement from "./HeroMembersManagement";
import {
  getHeroMembers,
  getMembersPicker,
  addHeroMember,
} from "../../api/admin/heroMembers.api";
import type { HeroMember } from "../../types/heroMember.types";

const mockedGetHeroMembers = getHeroMembers as jest.Mock;
const mockedGetMembersPicker = getMembersPicker as jest.Mock;
const mockedAddHeroMember = addHeroMember as jest.Mock;

const sampleHeroMembers: HeroMember[] = [
  {
    id: "hero-1",
    memberId: "member-1",
    userId: "user-1",
    name: "Jane Doe",
    role: "Backend Engineer",
    imageUrl: null,
    order: 0,
  },
  {
    id: "hero-2",
    memberId: "member-2",
    userId: "user-2",
    name: "John Smith",
    role: "Frontend Engineer",
    imageUrl: null,
    order: 1,
  },
];

describe("HeroMembersManagement", () => {
  beforeEach(() => {
    mockedGetHeroMembers.mockReset();
    mockedGetMembersPicker.mockReset();
    mockedAddHeroMember.mockReset();
  });

  test("shows a loading skeleton before data resolves", () => {
    mockedGetHeroMembers.mockReturnValue(new Promise(() => {}));
    const { container } = render(<HeroMembersManagement />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders featured members in order", async () => {
    mockedGetHeroMembers.mockResolvedValue(sampleHeroMembers);
    render(<HeroMembersManagement />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
    expect(screen.getByText("John Smith")).toBeInTheDocument();
    expect(screen.getByText("Currently Featured (2)")).toBeInTheDocument();
  });

  test("shows an empty state when no members are featured", async () => {
    mockedGetHeroMembers.mockResolvedValue([]);
    render(<HeroMembersManagement />);

    await waitFor(() => {
      expect(
        screen.getByText(/No members are currently featured/),
      ).toBeInTheDocument();
    });
  });

  test("searches the picker, selects a member, then adds them on confirm", async () => {
    mockedGetHeroMembers.mockResolvedValue([]);
    // id here is a User id, not a Member id - the picker offers every
    // user in the system now, most of whom don't have a Member profile
    // yet (see MemberPickerOption's own comment).
    mockedGetMembersPicker.mockResolvedValue([
      { id: "user-3", name: "Grace Uwase", role: "Designer", imageUrl: null },
    ]);
    mockedAddHeroMember.mockResolvedValue({
      id: "hero-3",
      memberId: "member-3",
      userId: "user-3",
      name: "Grace Uwase",
      role: "Designer",
      imageUrl: null,
      order: 0,
    });

    const user = userEvent.setup();
    render(<HeroMembersManagement />);

    await waitFor(() => {
      expect(
        screen.getByText(/No members are currently featured/),
      ).toBeInTheDocument();
    });

    await act(async () => {
      await user.type(
        screen.getByPlaceholderText("Search members by name…"),
        "Grace",
      );
    });

    await waitFor(
      () => {
        expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    // Clicking the search result only selects it - not added yet.
    await act(async () => {
      await user.click(screen.getByText("Grace Uwase"));
    });
    expect(mockedAddHeroMember).not.toHaveBeenCalled();

    // Confirming with "Add Member" is what actually adds them.
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Add Member" }));
    });

    await waitFor(() => {
      expect(mockedAddHeroMember).toHaveBeenCalledWith("user-3");
    });
  });

  test("excludes already-featured users from the picker search results", async () => {
    mockedGetHeroMembers.mockResolvedValue(sampleHeroMembers); // userId "user-1" already featured
    mockedGetMembersPicker.mockResolvedValue([
      {
        id: "user-1",
        name: "Jane Doe",
        role: "Backend Engineer",
        imageUrl: null,
      },
      { id: "user-3", name: "Grace Uwase", role: "Designer", imageUrl: null },
    ]);

    const user = userEvent.setup();
    render(<HeroMembersManagement />);

    await waitFor(() => {
      expect(screen.getByText("Currently Featured (2)")).toBeInTheDocument();
    });

    await act(async () => {
      await user.type(
        screen.getByPlaceholderText("Search members by name…"),
        "a",
      );
    });

    // Jane Doe (user-1) is already featured - the exclusion has to match
    // on userId now, not memberId, or she'd wrongly show up a second
    // time in the search results dropdown alongside the featured list.
    await waitFor(() => {
      expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    });
    expect(screen.getAllByText("Jane Doe")).toHaveLength(1);
  });
});
