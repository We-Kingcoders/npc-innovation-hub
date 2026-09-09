const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useAlumni", () => ({
  __esModule: true,
  useAlumni: jest.fn(),
}));

import { render, screen } from "@testing-library/react";
import { useAlumni } from "../../hooks/useAlumni";
import AlumniSection from "./AlumniSection";

const mockedUseAlumni = useAlumni as jest.Mock;

describe("<AlumniSection />", () => {
  afterEach(() => jest.clearAllMocks());

  test("shows a loading skeleton before data resolves", () => {
    mockedUseAlumni.mockReturnValue({
      alumni: [],
      loading: true,
      error: null,
      fetchAlumni: jest.fn(),
    });

    const { container } = render(<AlumniSection />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders a promoted member and a standalone alumnus together", () => {
    mockedUseAlumni.mockReturnValue({
      alumni: [
        { name: "Promoted Member", imageUrl: null, role: "Backend Developer" },
        { name: "Standalone Alumnus", imageUrl: null, role: "Other" },
      ],
      loading: false,
      error: null,
      fetchAlumni: jest.fn(),
    });

    render(<AlumniSection />);

    expect(screen.getByText("Our Alumni")).toBeInTheDocument();
    expect(screen.getByText("Promoted Member")).toBeInTheDocument();
    expect(screen.getByText("Standalone Alumnus")).toBeInTheDocument();
  });

  test("crops each photo from the top instead of the center, so heads aren't cut off", () => {
    mockedUseAlumni.mockReturnValue({
      alumni: [
        {
          name: "Grace Uwase",
          imageUrl: "https://example.com/grace.jpg",
          role: "Product Manager",
        },
      ],
      loading: false,
      error: null,
      fetchAlumni: jest.fn(),
    });

    render(<AlumniSection />);

    const photo = screen.getByAltText("Grace Uwase");
    expect(photo).toHaveClass("object-cover");
    expect(photo).toHaveClass("object-top");
  });

  test("renders nothing when there are no alumni yet", () => {
    mockedUseAlumni.mockReturnValue({
      alumni: [],
      loading: false,
      error: null,
      fetchAlumni: jest.fn(),
    });

    const { container } = render(<AlumniSection />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing when the fetch fails, rather than showing an error banner", () => {
    mockedUseAlumni.mockReturnValue({
      alumni: [],
      loading: false,
      error: "Network error",
      fetchAlumni: jest.fn(),
    });

    const { container } = render(<AlumniSection />);

    expect(container).toBeEmptyDOMElement();
  });

  test("does not crash when the list contains a malformed entry", () => {
    mockedUseAlumni.mockReturnValue({
      alumni: [
        undefined,
        { name: "", imageUrl: null, role: "Other" },
        { name: "Grace Uwase", imageUrl: null, role: "Product Manager" },
      ],
      loading: false,
      error: null,
      fetchAlumni: jest.fn(),
    });

    render(<AlumniSection />);

    expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
