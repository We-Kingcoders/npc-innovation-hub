// Regression coverage for a real stored-XSS hole: renderMarkdown() used to
// run its regex substitutions directly on raw blog content and hand the
// result straight to dangerouslySetInnerHTML - a blog post whose body
// literally contained "<script>...</script>" rendered as a real, executing
// script tag for every visitor of that post, not just the author. Fixed by
// escaping the raw text before any markdown substitution runs.
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "blog-1" }),
}));

jest.mock("../../hooks/useBlogs", () => ({
  __esModule: true,
  useBlogs: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import { useBlogs } from "../../hooks/useBlogs";
import BlogDetails from "./BlogDetails";

const mockedUseBlogs = useBlogs as jest.Mock;

const baseBlog = {
  id: "blog-1",
  title: "Test Post",
  summary: "A test post",
  image: null,
  category: "Front-end",
  authorId: "author-1",
  isPublished: true,
  viewCount: 3,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("<BlogDetails /> markdown rendering", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders a literal <script> tag in the content as inert text, not an executing script element", () => {
    mockedUseBlogs.mockReturnValue({
      selectedBlog: {
        ...baseBlog,
        content: "Hello <script>window.__xss = true;</script> world",
      },
      loading: false,
      error: null,
      fetchPublicBlogById: jest.fn(),
      clearSelectedBlog: jest.fn(),
    });

    const { container } = render(<BlogDetails />);

    // The escaped text is visible as plain content...
    expect(container.textContent).toContain(
      "<script>window.__xss = true;</script>",
    );
    // ...and, critically, no real <script> element was created from it.
    expect(container.querySelector("script")).toBeNull();
  });

  it("still renders legitimate markdown (heading, bold, list) as real HTML elements", () => {
    mockedUseBlogs.mockReturnValue({
      selectedBlog: {
        ...baseBlog,
        content: "## A Heading\n\n**bold text**\n\n- item one\n- item two",
      },
      loading: false,
      error: null,
      fetchPublicBlogById: jest.fn(),
      clearSelectedBlog: jest.fn(),
    });

    const { container } = render(<BlogDetails />);

    expect(
      screen.getByRole("heading", { name: "A Heading", level: 2 }),
    ).toBeInTheDocument();
    expect(container.querySelector("strong")?.textContent).toBe("bold text");
    expect(container.querySelectorAll("li")).toHaveLength(2);
  });
});
