jest.mock("../client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

import apiClient from "../client";
import {
  getApplications,
  getApplication,
  acceptApplication,
  rejectApplication,
} from "./application.api";

const mockedGet = apiClient.get as jest.Mock;
const mockedPatch = apiClient.patch as jest.Mock;

describe("getApplications", () => {
  afterEach(() => jest.clearAllMocks());

  test("fetches all applications with no status filter by default", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", results: 0, data: { applications: [] } },
    });

    await getApplications();

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/admin/applications",
      expect.objectContaining({ params: undefined }),
    );
  });

  test("passes the status as a query param when provided", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", results: 0, data: { applications: [] } },
    });

    await getApplications("Pending");

    expect(mockedGet).toHaveBeenCalledWith(
      "/api/admin/applications",
      expect.objectContaining({ params: { status: "Pending" } }),
    );
  });
});

describe("getApplication", () => {
  afterEach(() => jest.clearAllMocks());

  test("fetches a single application by id", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", data: { application: { id: "app-1" } } },
    });

    await getApplication("app-1");

    expect(mockedGet).toHaveBeenCalledWith("/api/admin/applications/app-1");
  });
});

describe("acceptApplication", () => {
  afterEach(() => jest.clearAllMocks());

  test("sends a PATCH with no body to the accept route", async () => {
    mockedPatch.mockResolvedValue({
      data: {
        status: "success",
        message: "Application accepted",
        data: {
          application: { id: "app-1" },
          user: { id: "u1", email: "a@b.com", firstName: "A", lastName: "B" },
          member: { id: "m1" },
        },
      },
    });

    await acceptApplication("app-1");

    expect(mockedPatch).toHaveBeenCalledWith(
      "/api/admin/applications/app-1/accept",
    );
  });
});

describe("rejectApplication", () => {
  afterEach(() => jest.clearAllMocks());

  test("sends the reason in the request body when provided", async () => {
    mockedPatch.mockResolvedValue({
      data: {
        status: "success",
        message: "Application rejected",
        data: { application: { id: "app-1" } },
      },
    });

    await rejectApplication("app-1", { reason: "Not a fit right now" });

    expect(mockedPatch).toHaveBeenCalledWith(
      "/api/admin/applications/app-1/reject",
      { reason: "Not a fit right now" },
    );
  });

  test("sends an empty body when no reason is given", async () => {
    mockedPatch.mockResolvedValue({
      data: {
        status: "success",
        message: "Application rejected",
        data: { application: { id: "app-1" } },
      },
    });

    await rejectApplication("app-1");

    expect(mockedPatch).toHaveBeenCalledWith(
      "/api/admin/applications/app-1/reject",
      {},
    );
  });
});
