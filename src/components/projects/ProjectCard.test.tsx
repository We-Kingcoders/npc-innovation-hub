import { render, screen } from "@testing-library/react";
import ProjectCard from "./ProjectCard";

const baseProps = {
  id: "project-1",
  userId: "user-1",
  image: "https://example.com/project.jpg",
  title: "Smart Movement Platform",
  description: "A responsive, real-time coordination engine.",
  owner: "Jane Doe",
  ownerRole: "Admin",
  ownerAvatar: "https://example.com/avatar.jpg",
  link: "https://example.com/project",
  demo: "",
  createdAt: "2026-09-15T00:00:00.000Z",
  updatedAt: "2026-09-15T00:00:00.000Z",
};

describe("<ProjectCard />", () => {
  test("renders the project's own content", () => {
    render(<ProjectCard {...baseProps} />);

    expect(screen.getByText("Smart Movement Platform")).toBeInTheDocument();
    expect(
      screen.getByText("A responsive, real-time coordination engine."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View more/i })).toHaveAttribute(
      "href",
      "https://example.com/project",
    );
  });

  // This is a public showcase card, not a byline - who created a project
  // was never something a visitor to the website needed to see, and (see
  // git history) showing it was actively broken for projects created
  // before an owner-name backend fix landed ("undefined undefined").
  // Simplest fix once that data bug surfaced: don't render owner info
  // here at all, regardless of what's actually in the field.
  test("never renders owner/creator info, even when it's set", () => {
    render(<ProjectCard {...baseProps} owner="Jane Doe" ownerRole="Admin" />);

    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  test("never renders owner/creator info on the featured variant either", () => {
    render(
      <ProjectCard
        {...baseProps}
        owner="Jane Doe"
        ownerRole="Admin"
        variant="featured"
      />,
    );

    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  test("still renders correctly when owner is the old broken literal string", () => {
    render(<ProjectCard {...baseProps} owner="undefined undefined" />);

    expect(screen.getByText("Smart Movement Platform")).toBeInTheDocument();
    expect(screen.queryByText("undefined undefined")).not.toBeInTheDocument();
  });
});
