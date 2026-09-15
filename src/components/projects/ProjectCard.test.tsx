import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";

const baseProps = {
  id: "project-1",
  userId: "user-1",
  image: "https://example.com/project.jpg",
  title: "Smart Movement Platform",
  description: "A responsive, real-time coordination engine.",
  ownerRole: "Admin",
  ownerAvatar: "https://example.com/avatar.jpg",
  link: "https://example.com/project",
  demo: "",
  createdAt: "2026-09-15T00:00:00.000Z",
  updatedAt: "2026-09-15T00:00:00.000Z",
};

describe("<ProjectCard />", () => {
  test("renders the real owner name when one is set", () => {
    render(<ProjectCard {...baseProps} owner="Jane Doe" />);

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
  });

  // Regression test: a project created (or never since re-saved) before
  // the backend owner-name fix landed can still have this exact literal
  // string stored - showing it verbatim to a public visitor read as a
  // broken page, not a missing name.
  test('falls back to "Unknown" instead of showing the literal "undefined undefined"', () => {
    render(<ProjectCard {...baseProps} owner="undefined undefined" />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.queryByText("undefined undefined")).not.toBeInTheDocument();
  });

  test('falls back to "Unknown" when owner is empty', () => {
    render(<ProjectCard {...baseProps} owner="" />);

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  test("applies the same fallback to the featured variant", () => {
    render(
      <ProjectCard
        {...baseProps}
        owner="undefined undefined"
        variant="featured"
      />,
    );

    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
