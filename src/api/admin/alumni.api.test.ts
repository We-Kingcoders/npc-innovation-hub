jest.mock("../client", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    patch: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
  handleApiError: (error: unknown) =>
    error instanceof Error ? error.message : "An error occurred",
}));

import apiClient from "../client";
import { createAlumni, updateAlumni } from "./alumni.api";

describe("alumni.api toFormData", () => {
  afterEach(() => jest.clearAllMocks());

  test("createAlumni sends the name under the fullName key the backend expects", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { status: "success", data: { alumni: { id: "a1" } } },
    });

    await createAlumni({ name: "Jane Doe", role: "Software Engineer" });

    const sentFormData = (apiClient.post as jest.Mock).mock
      .calls[0][1] as FormData;
    expect(sentFormData.get("fullName")).toBe("Jane Doe");
    expect(sentFormData.get("name")).toBeNull();
    expect(sentFormData.get("role")).toBe("Software Engineer");
  });

  test("createAlumni sends fullName correctly even without a photo", async () => {
    (apiClient.post as jest.Mock).mockResolvedValue({
      data: { status: "success", data: { alumni: { id: "a1" } } },
    });

    await createAlumni({ name: "No Photo Person", role: "Designer" });

    const sentFormData = (apiClient.post as jest.Mock).mock
      .calls[0][1] as FormData;
    expect(sentFormData.get("fullName")).toBe("No Photo Person");
    expect(sentFormData.get("image")).toBeNull();
  });

  test("updateAlumni also sends the fullName key", async () => {
    (apiClient.patch as jest.Mock).mockResolvedValue({
      data: { status: "success", data: { alumni: { id: "a1" } } },
    });

    await updateAlumni("a1", { name: "Updated Name" });

    const sentFormData = (apiClient.patch as jest.Mock).mock
      .calls[0][1] as FormData;
    expect(sentFormData.get("fullName")).toBe("Updated Name");
  });
});
