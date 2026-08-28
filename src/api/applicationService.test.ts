jest.mock("./client", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

import apiClient from "./client";
import { submitMembershipApplication } from "./applicationService";

describe("submitMembershipApplication", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("posts to /api/applications as multipart/form-data and returns the response body", async () => {
    const fakeResponseBody = {
      status: "success",
      message:
        "Application submitted successfully. We will review it and get back to you.",
      data: {
        application: {
          id: "abc123",
          fullName: "Jane Doe",
          status: "Pending",
        },
      },
    };
    (apiClient.post as jest.Mock).mockResolvedValue({ data: fakeResponseBody });

    const formData = new FormData();
    formData.append("fullName", "Jane Doe");

    const result = await submitMembershipApplication(formData);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/applications",
      formData,
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "multipart/form-data",
        }),
      }),
    );
    expect(result).toEqual(fakeResponseBody);
  });

  test("reports upload progress via the onUploadProgress callback", async () => {
    const fakeResponseBody = {
      status: "success",
      message: "ok",
      data: { application: { id: "x" } },
    };
    (apiClient.post as jest.Mock).mockImplementation(
      (
        _url: string,
        _data: FormData,
        config: {
          onUploadProgress?: (evt: { loaded: number; total: number }) => void;
        },
      ) => {
        config.onUploadProgress?.({ loaded: 50, total: 100 });
        return Promise.resolve({ data: fakeResponseBody });
      },
    );

    const onProgress = jest.fn();
    const formData = new FormData();

    await submitMembershipApplication(formData, onProgress);

    expect(onProgress).toHaveBeenCalledWith(50);
  });
});
