import { render, screen } from "@testing-library/react";
import ProjectTable from "./ProjectTable";
import type { MemberProject } from "../../api/member/project.api";
import { useAuth } from "../../hooks/useAuth";

jest.mock("../../hooks/useAuth");
const mockedUseAuth = useAuth as jest.Mock;

const baseProject: MemberProject = {
  id: "p1",
  userId: "owner-1",
  title: "Smart Report Platform",
  description: "A dashboard for reporting",
  owner: "Jane Doe",
  ownerRole: "Member",
  ownerAvatar: "",
  image: "",
  link: "",
  demo: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function renderTable(project: MemberProject) {
  return render(
    <ProjectTable
      projects={[project]}
      onDelete={jest.fn()}
      onUpdate={jest.fn()}
    />,
  );
}

describe("ProjectTable ownership-gated actions", () => {
  test("shows Edit and Delete for a project the viewer owns", () => {
    mockedUseAuth.mockReturnValue({ user: { id: "owner-1" } });
    renderTable(baseProject);

    // Table + card view both render (ResponsiveTable), so use getAllByTitle.
    expect(screen.getAllByTitle("Edit project").length).toBeGreaterThan(0);
    expect(screen.getAllByTitle("Delete project").length).toBeGreaterThan(0);
    expect(screen.getAllByTitle("View project").length).toBeGreaterThan(0);
  });

  test("hides Edit and Delete for a project the viewer does not own, but keeps View", () => {
    mockedUseAuth.mockReturnValue({ user: { id: "someone-else" } });
    renderTable(baseProject);

    expect(screen.queryByTitle("Edit project")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Delete project")).not.toBeInTheDocument();
    expect(screen.getAllByTitle("View project").length).toBeGreaterThan(0);
  });

  test("hides Edit and Delete when there is no authenticated user", () => {
    mockedUseAuth.mockReturnValue({ user: null });
    renderTable(baseProject);

    expect(screen.queryByTitle("Edit project")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Delete project")).not.toBeInTheDocument();
  });
});
