jest.mock("../../api/admin/alumni.api", () => ({
  __esModule: true,
  getAlumniList: jest.fn(),
  createAlumni: jest.fn(),
  updateAlumni: jest.fn(),
  deleteAlumni: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "react-hot-toast";
import AlumniManagement from "./AlumniManagement";
import {
  getAlumniList,
  createAlumni,
  deleteAlumni,
} from "../../api/admin/alumni.api";
import type { Alumni } from "../../types/alumni.types";
import { MEMBER_ROLES } from "../../types/member.types";

const mockedToastError = toast.error as jest.Mock;

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
    mockedToastError.mockReset();
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
      role: "Full-Stack Developer",
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
      await user.selectOptions(
        screen.getByLabelText("Role"),
        "Full-Stack Developer",
      );
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Add Entry" }));
    });

    await waitFor(() => {
      expect(mockedCreateAlumni).toHaveBeenCalledWith({
        name: "Eric Habimana",
        role: "Full-Stack Developer",
        image: null,
      });
    });
    expect(await screen.findByText("Eric Habimana")).toBeInTheDocument();
  });

  test("only offers the backend-approved role values, not free text", async () => {
    mockedGetAlumniList.mockResolvedValue([]);
    render(<AlumniManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("No alumni entries yet. Add one above."),
      ).toBeInTheDocument();
    });

    const roleField = screen.getByLabelText("Role");
    expect(roleField.tagName).toBe("SELECT");

    const optionValues = Array.from(roleField.querySelectorAll("option")).map(
      (opt) => opt.textContent,
    );
    MEMBER_ROLES.forEach((role) => {
      expect(optionValues).toContain(role);
    });
    // Placeholder plus the exact enum, nothing extra.
    expect(optionValues).toHaveLength(MEMBER_ROLES.length + 1);
  });

  test("a failed create request leaves the list unchanged and shows an error", async () => {
    mockedGetAlumniList.mockResolvedValue([]);
    mockedCreateAlumni.mockRejectedValue(
      new Error(
        "Failed to create alumni entry: role must be one of: Frontend Developer, ...",
      ),
    );

    const user = userEvent.setup();
    render(<AlumniManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("No alumni entries yet. Add one above."),
      ).toBeInTheDocument();
    });

    await act(async () => {
      await user.type(screen.getByLabelText("Full Name"), "Eric Habimana");
      await user.selectOptions(screen.getByLabelText("Role"), "Other");
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Add Entry" }));
    });

    await waitFor(() => {
      expect(mockedCreateAlumni).toHaveBeenCalled();
    });

    // The list must stay empty — no partial/undefined entry was appended.
    expect(
      screen.getByText("No alumni entries yet. Add one above."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Eric Habimana")).not.toBeInTheDocument();
    expect(mockedToastError).toHaveBeenCalledWith(
      "Failed to create alumni entry: role must be one of: Frontend Developer, ...",
    );
  });

  test("does not crash when the list contains a malformed entry", async () => {
    mockedGetAlumniList.mockResolvedValue([
      undefined as unknown as Alumni,
      sampleAlumni[0],
    ]);

    render(<AlumniManagement />);

    await waitFor(() => {
      expect(screen.getByText("Grace Uwase")).toBeInTheDocument();
    });
    // The real entry still renders; the page did not white-screen.
    expect(screen.getByText("Alumni (2)")).toBeInTheDocument();
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
