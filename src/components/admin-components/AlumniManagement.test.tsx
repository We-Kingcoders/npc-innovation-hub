jest.mock("../../api/admin/alumni.api", () => ({
  __esModule: true,
  getAlumniList: jest.fn(),
  createAlumni: jest.fn(),
  updateAlumni: jest.fn(),
  deleteAlumni: jest.fn(),
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlumniManagement from "./AlumniManagement";
import {
  getAlumniList,
  createAlumni,
  deleteAlumni,
} from "../../api/admin/alumni.api";
import type { Alumni } from "../../types/alumni.types";

const mockedGetAlumniList = getAlumniList as jest.Mock;
const mockedCreateAlumni = createAlumni as jest.Mock;
const mockedDeleteAlumni = deleteAlumni as jest.Mock;

const sampleAlumni: Alumni[] = [
  {
    id: "alumni-1",
    name: "Grace Uwase",
    role: "Product Manager",
    imageUrl: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("AlumniManagement", () => {
  beforeEach(() => {
    mockedGetAlumniList.mockReset();
    mockedCreateAlumni.mockReset();
    mockedDeleteAlumni.mockReset();
  });

  test("shows a loading skeleton before data resolves", () => {
    mockedGetAlumniList.mockReturnValue(new Promise(() => {}));
    const { container } = render(<AlumniManagement />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders existing alumni entries", async () => {
    mockedGetAlumniList.mockResolvedValue(sampleAlumni);
    render(<AlumniManagement />);

    await waitFor(() => {
      expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    });
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("Alumni (1)")).toBeInTheDocument();
  });

  test("shows an empty state when there are no entries", async () => {
    mockedGetAlumniList.mockResolvedValue([]);
    render(<AlumniManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("No alumni entries yet. Add one above."),
      ).toBeInTheDocument();
    });
  });

  test("creates a new alumni entry from the form", async () => {
    mockedGetAlumniList.mockResolvedValue([]);
    mockedCreateAlumni.mockResolvedValue({
      id: "alumni-2",
      name: "Eric Habimana",
      role: "Software Engineer",
      imageUrl: null,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    const user = userEvent.setup();
    render(<AlumniManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("No alumni entries yet. Add one above."),
      ).toBeInTheDocument();
    });

    await act(async () => {
      await user.type(screen.getByLabelText("Full Name"), "Eric Habimana");
      await user.type(screen.getByLabelText("Role"), "Software Engineer");
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Add Entry" }));
    });

    await waitFor(() => {
      expect(mockedCreateAlumni).toHaveBeenCalledWith({
        name: "Eric Habimana",
        role: "Software Engineer",
        image: null,
      });
    });
    expect(await screen.findByText("Eric Habimana")).toBeInTheDocument();
  });

  test("deletes an alumni entry after confirmation", async () => {
    mockedGetAlumniList.mockResolvedValue(sampleAlumni);
    mockedDeleteAlumni.mockResolvedValue(undefined);
    window.confirm = jest.fn(() => true);

    const user = userEvent.setup();
    render(<AlumniManagement />);

    await waitFor(() => {
      expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Delete" }));
    });

    await waitFor(() => {
      expect(mockedDeleteAlumni).toHaveBeenCalledWith("alumni-1");
    });
    expect(
      screen.getByText("No alumni entries yet. Add one above."),
    ).toBeInTheDocument();
  });
});
