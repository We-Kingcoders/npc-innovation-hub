jest.mock("../services/profile.service", () => ({
  __esModule: true,
  profileService: {
    getProfile: jest.fn(),
    getMe: jest.fn(),
    updateProfile: jest.fn(),
    updatePassword: jest.fn(),
  },
}));

import { act, renderHook } from "@testing-library/react";
import { profileService } from "../services/profile.service";
import { useProfile } from "./useProfile";

const mockedUpdateProfile = profileService.updateProfile as jest.Mock;

describe("useProfile - updateProfile error handling", () => {
  afterEach(() => jest.clearAllMocks());

  // Regression test: profileService goes through api/client.ts, whose
  // response interceptor rejects with a plain { message, statusCode, error }
  // object, not a raw axios error or an Error instance. extractMessage only
  // recognized those two shapes, so a real backend message always rendered
  // as the generic "An unexpected error occurred" instead.
  test("surfaces the real backend message instead of the generic fallback", async () => {
    mockedUpdateProfile.mockRejectedValue({
      message: "Phone number is invalid",
      statusCode: 400,
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ phone: "not-a-phone" });
    });

    expect(result.current.error).toBe("Phone number is invalid");
    expect(result.current.error).not.toBe("An unexpected error occurred");
  });

  test("falls back to a generic message only when the error truly carries no message", async () => {
    mockedUpdateProfile.mockRejectedValue({});

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ firstName: "Jane" });
    });

    expect(result.current.error).toBe("An unexpected error occurred");
  });

  test("updates successfully and reports success", async () => {
    mockedUpdateProfile.mockResolvedValue({
      id: "u-1",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      image: null,
      phone: "+250700000000",
      gender: "female",
      verified: true,
      role: "Member",
      isActive: true,
      createdAt: "",
      updatedAt: "",
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      const ok = await result.current.updateProfile({ firstName: "Jane" });
      expect(ok).toBe(true);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.successMsg).toBe("Profile updated successfully!");
  });
});
