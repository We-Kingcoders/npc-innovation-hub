import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserManagementTable from "./UserManagementTable";
import { Gender, UserRole } from "../../types/user.types";
import type { User } from "../../types/user.types";

const baseUser: User = {
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

const noop = async () => {};

function renderTable(users: User[], onAlumniToggle = jest.fn(async () => {})) {
  render(
    <UserManagementTable
      users={users}
      isLoading={false}
      onRoleChange={noop}
      onStatusToggle={noop}
      onAlumniToggle={onAlumniToggle}
      onDeleteUser={noop}
    />,
  );
  return { onAlumniToggle };
}

describe("UserManagementTable alumni toggle", () => {
  test("toggling a Member row's alumni status sends memberId, not userId", async () => {
    const { onAlumniToggle } = renderTable([baseUser]);

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: "Current" }));
    });

    expect(onAlumniToggle).toHaveBeenCalledWith("user-1", "member-1", true);
  });

  test("hides the alumni toggle for a row with memberId: null and never calls onAlumniToggle", async () => {
    const adminUser: User = {
      ...baseUser,
      id: "admin-1",
      role: UserRole.ADMIN,
      memberId: null,
    };
    const { onAlumniToggle } = renderTable([adminUser]);

    expect(
      screen.queryByRole("button", { name: /current|alumni/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTitle("No member profile to promote or demote"),
    ).toBeInTheDocument();
    expect(onAlumniToggle).not.toHaveBeenCalled();
  });
});
