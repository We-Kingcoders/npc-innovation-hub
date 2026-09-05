jest.mock("../../api/admin/member.api", () => ({
  __esModule: true,
  getAllUsers: jest.fn(),
  updateUserRole: jest.fn(),
  toggleUserStatus: jest.fn(),
  deleteUser: jest.fn(),
  searchUsers: (users: unknown[]) => users,
  filterUsersByRole: (users: unknown[]) => users,
  filterUsersByStatus: (users: unknown[]) => users,
}));

jest.mock("../../api/admin/alumni.api", () => ({
  __esModule: true,
  setMemberAlumniStatus: jest.fn(),
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MembersManagement from "./MembersManagement";
import { getAllUsers } from "../../api/admin/member.api";
import { setMemberAlumniStatus } from "../../api/admin/alumni.api";
import { Gender, UserRole } from "../../types/user.types";
import type { User } from "../../types/user.types";

const mockedGetAllUsers = getAllUsers as jest.Mock;
const mockedSetMemberAlumniStatus = setMemberAlumniStatus as jest.Mock;

const memberUser: User = {
  id: "user-1",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  image: null,
  phone: "0700000000",
  gender: Gender.FEMALE,
  verified: true,
  role: UserRole.MEMBER,
  isActive: true,
  memberId: "member-1",
  isAlumni: false,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const adminUser: User = {
  ...memberUser,
  id: "admin-1",
  role: UserRole.ADMIN,
  memberId: null,
};

describe("MembersManagement alumni toggle", () => {
  beforeEach(() => {
    mockedGetAllUsers.mockReset();
    mockedSetMemberAlumniStatus.mockReset();
  });

  test("sends the member's memberId (not userId) to the alumni-status endpoint", async () => {
    mockedGetAllUsers.mockResolvedValue([memberUser]);
    mockedSetMemberAlumniStatus.mockResolvedValue(undefined);

    render(<MembersManagement />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Current" }));
    });

    await waitFor(() => {
      expect(mockedSetMemberAlumniStatus).toHaveBeenCalledWith(
        "member-1",
        true,
      );
    });
    expect(mockedSetMemberAlumniStatus).not.toHaveBeenCalledWith(
      "user-1",
      true,
    );
  });

  test("Admin rows with no memberId have no alumni toggle to click", async () => {
    mockedGetAllUsers.mockResolvedValue([adminUser]);

    render(<MembersManagement />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: /current|alumni/i }),
    ).not.toBeInTheDocument();
    expect(mockedSetMemberAlumniStatus).not.toHaveBeenCalled();
  });
});
