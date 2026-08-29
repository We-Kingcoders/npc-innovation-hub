jest.mock("../api/admin/application.api", () => ({
  __esModule: true,
  getApplications: jest.fn(),
  getApplication: jest.fn(),
  acceptApplication: jest.fn(),
  rejectApplication: jest.fn(),
}));

import { renderHook, act, waitFor } from "@testing-library/react";
import {
  getApplications,
  getApplication,
  acceptApplication,
  rejectApplication,
} from "../api/admin/application.api";
import {
  useApplications,
  useApplication,
  classifyMutationError,
} from "./useApplications";

const mockedGetApplications = getApplications as jest.Mock;
const mockedGetApplication = getApplication as jest.Mock;
const mockedAccept = acceptApplication as jest.Mock;
const mockedReject = rejectApplication as jest.Mock;

const sampleApplication = {
  id: "app-1",
  imageUrl: null,
  fullName: "Jane Doe",
  email: "jane@example.com",
  githubUrl: "https://github.com/jane",
  skills: ["React"],
  phoneNumber: "+250781234567",
  gender: "Female",
  strengths: "Fast learner",
  weaknesses: "Impatient",
  applicationLetterUrl: "https://files.example.com/letter.pdf",
  status: "Pending",
  reviewedBy: null,
  reviewedAt: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("classifyMutationError", () => {
  test("classifies a 409 as a conflict", () => {
    const result = classifyMutationError({
      statusCode: 409,
      message: "An application from this email is already pending review",
    });
    expect(result).toEqual({
      ok: false,
      kind: "conflict",
      message: "An application from this email is already pending review",
    });
  });

  test("classifies a 500 as a server error", () => {
    const result = classifyMutationError({
      statusCode: 500,
      message: "Server error",
    });
    expect(result.ok).toBe(false);
    expect((result as { kind: string }).kind).toBe("server");
  });

  test("classifies a network error (statusCode 0) as a server error", () => {
    const result = classifyMutationError({
      statusCode: 0,
      message: "Network error. Please check your connection.",
    });
    expect((result as { kind: string }).kind).toBe("server");
  });

  test("falls back to a generic message when none is provided", () => {
    const result = classifyMutationError({});
    expect((result as { message: string }).message).toMatch(/went wrong/i);
  });
});

describe("useApplications", () => {
  afterEach(() => jest.clearAllMocks());

  test("defaults the status filter to Pending", () => {
    const { result } = renderHook(() => useApplications());
    expect(result.current.statusFilter).toBe("Pending");
  });

  test("fetchApplications requests the current status filter", async () => {
    mockedGetApplications.mockResolvedValue({
      status: "success",
      results: 1,
      data: { applications: [sampleApplication] },
    });

    const { result } = renderHook(() => useApplications());

    await act(async () => {
      await result.current.fetchApplications();
    });

    expect(mockedGetApplications).toHaveBeenCalledWith("Pending");
    expect(result.current.applications).toEqual([sampleApplication]);
  });

  test("fetching with statusFilter 'All' omits the status filter", async () => {
    mockedGetApplications.mockResolvedValue({
      status: "success",
      results: 0,
      data: { applications: [] },
    });

    const { result } = renderHook(() => useApplications("All"));

    await act(async () => {
      await result.current.fetchApplications();
    });

    expect(mockedGetApplications).toHaveBeenCalledWith(undefined);
  });

  test("surfaces an error message when the fetch fails", async () => {
    mockedGetApplications.mockRejectedValue({
      statusCode: 500,
      message: "Server error",
    });

    const { result } = renderHook(() => useApplications());

    await act(async () => {
      await result.current.fetchApplications();
    });

    expect(result.current.error).toBe("Server error");
  });
});

describe("useApplication", () => {
  afterEach(() => jest.clearAllMocks());

  test("fetches the application on mount", async () => {
    mockedGetApplication.mockResolvedValue({
      status: "success",
      data: { application: sampleApplication },
    });

    const { result } = renderHook(() => useApplication("app-1"));

    await waitFor(() =>
      expect(result.current.application).toEqual(sampleApplication),
    );
    expect(mockedGetApplication).toHaveBeenCalledWith("app-1");
  });

  test("handleAccept updates the application and returns ok on success", async () => {
    mockedGetApplication.mockResolvedValue({
      status: "success",
      data: { application: sampleApplication },
    });
    const acceptedApplication = { ...sampleApplication, status: "Accepted" };
    mockedAccept.mockResolvedValue({
      status: "success",
      message: "Application accepted",
      data: {
        application: acceptedApplication,
        user: {
          id: "u1",
          email: "jane@example.com",
          firstName: "Jane",
          lastName: "Doe",
        },
        member: { id: "m1" },
      },
    });

    const { result } = renderHook(() => useApplication("app-1"));
    await waitFor(() => expect(result.current.application).not.toBeNull());

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current.handleAccept();
    });

    expect(mutationResult).toEqual({
      ok: true,
      application: acceptedApplication,
    });
    expect(result.current.application?.status).toBe("Accepted");
  });

  test("handleAccept returns a conflict result on a 409 without changing local state", async () => {
    mockedGetApplication.mockResolvedValue({
      status: "success",
      data: { application: sampleApplication },
    });
    mockedAccept.mockRejectedValue({
      statusCode: 409,
      message: "Application already decided",
    });

    const { result } = renderHook(() => useApplication("app-1"));
    await waitFor(() => expect(result.current.application).not.toBeNull());

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current.handleAccept();
    });

    expect(mutationResult).toEqual({
      ok: false,
      kind: "conflict",
      message: "Application already decided",
    });
    expect(result.current.application?.status).toBe("Pending");
  });

  test("handleReject sends the provided reason and updates state on success", async () => {
    mockedGetApplication.mockResolvedValue({
      status: "success",
      data: { application: sampleApplication },
    });
    const rejectedApplication = { ...sampleApplication, status: "Rejected" };
    mockedReject.mockResolvedValue({
      status: "success",
      message: "Application rejected",
      data: { application: rejectedApplication },
    });

    const { result } = renderHook(() => useApplication("app-1"));
    await waitFor(() => expect(result.current.application).not.toBeNull());

    await act(async () => {
      await result.current.handleReject({ reason: "Not a fit" });
    });

    expect(mockedReject).toHaveBeenCalledWith("app-1", { reason: "Not a fit" });
    expect(result.current.application?.status).toBe("Rejected");
  });
});
