jest.mock("./client", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

import apiClient from "./client";
import { profileService } from "./profileService";

describe("profileService.updateProfile", () => {
  afterEach(() => jest.clearAllMocks());

  const mockResponse = () =>
    (apiClient.patch as jest.Mock).mockResolvedValue({
      data: { status: "success", message: "ok", data: { user: {} } },
    });

  test("sends a real file under the 'images' key the backend's multer middleware expects, not a URL string", async () => {
    mockResponse();
    const file = new File(["fake image bytes"], "avatar.jpg", {
      type: "image/jpeg",
    });

    await profileService.updateProfile({
      firstName: "Jane",
      lastName: "Doe",
      image: file,
    });

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/users/update-profile",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const sentFormData = (apiClient.patch as jest.Mock).mock
      .calls[0][1] as FormData;
    expect(sentFormData.get("firstName")).toBe("Jane");
    expect(sentFormData.get("lastName")).toBe("Doe");
    expect(sentFormData.get("images")).toBe(file);
  });

  test("omits the images field entirely when no new photo was picked", async () => {
    mockResponse();

    await profileService.updateProfile({
      firstName: "Jane",
      phone: "+250781234567",
    });

    const sentFormData = (apiClient.patch as jest.Mock).mock
      .calls[0][1] as FormData;
    expect(sentFormData.get("images")).toBeNull();
    expect(sentFormData.get("phone")).toBe("+250781234567");
  });
});
