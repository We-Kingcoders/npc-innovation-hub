jest.mock("../services/member.service", () => ({
  __esModule: true,
  memberService: {
    getMember: jest.fn(),
    createMember: jest.fn(),
    updateMember: jest.fn(),
  },
}));

import { act, renderHook, waitFor } from "@testing-library/react";
import { memberService } from "../services/member.service";
import { useMember } from "./useMember";

const mockedCreateMember = memberService.createMember as jest.Mock;
const mockedUpdateMember = memberService.updateMember as jest.Mock;
const mockedGetMember = memberService.getMember as jest.Mock;

describe("useMember - saveMemberBasic error handling", () => {
  afterEach(() => jest.clearAllMocks());

  // Regression test: memberService goes through api/client.ts, whose
  // response interceptor rejects with a plain { message, statusCode, error }
  // object, not a raw axios error or an Error instance. The bug this covers:
  // saveMemberBasic's error state always rendered the generic
  // "An unexpected error occurred" fallback instead of the real backend
  // message (e.g. a role-validation error), because extractMessage only
  // recognized the two shapes the interceptor never actually produces.
  test("surfaces the real backend message instead of the generic fallback", async () => {
    mockedCreateMember.mockRejectedValue({
      message: "role must be at most 100 characters",
      statusCode: 400,
    });

    const { result } = renderHook(() => useMember());

    await act(async () => {
      await result.current.saveMemberBasic("user-1", {
        name: "Jane Doe",
        role: "x".repeat(101),
        bio: "",
        image: null,
      });
    });

    expect(result.current.error).toBe("role must be at most 100 characters");
    expect(result.current.error).not.toBe("An unexpected error occurred");
  });

  test("falls back to a generic message only when the error truly carries no message", async () => {
    mockedCreateMember.mockRejectedValue({});

    const { result } = renderHook(() => useMember());

    await act(async () => {
      await result.current.saveMemberBasic("user-1", {
        name: "Jane Doe",
        role: "Backend Developer",
        bio: "",
        image: null,
      });
    });

    expect(result.current.error).toBe("An unexpected error occurred");
  });

  test("saves successfully and clears any prior error", async () => {
    const saved = {
      id: "m-1",
      userId: "user-1",
      name: "Jane Doe",
      role: "Backend Developer",
      imageUrl: null,
      bio: "",
      skills: [],
    };
    mockedCreateMember.mockResolvedValue(saved);

    const { result } = renderHook(() => useMember());

    await act(async () => {
      const ok = await result.current.saveMemberBasic("user-1", {
        name: "Jane Doe",
        role: "Backend Developer",
        bio: "",
        image: null,
      });
      expect(ok).toBe(true);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.successMsg).toBe("Profile saved successfully!");
  });

  test("updates via memberService.updateMember once a member profile already exists", async () => {
    mockedGetMember.mockResolvedValue({
      id: "m-1",
      userId: "user-1",
      name: "Jane Doe",
      role: "Backend Developer",
      imageUrl: null,
      bio: "",
      skills: [],
    });
    mockedUpdateMember.mockResolvedValue({
      id: "m-1",
      userId: "user-1",
      name: "Jane Doe",
      role: "Full-Stack Developer",
      imageUrl: null,
      bio: "",
      skills: [],
    });

    const { result } = renderHook(() => useMember());

    await act(async () => {
      await result.current.fetchMember("user-1");
    });
    await waitFor(() => expect(result.current.memberExists).toBe(true));

    await act(async () => {
      await result.current.saveMemberBasic("user-1", {
        name: "Jane Doe",
        role: "Full-Stack Developer",
        bio: "",
        image: null,
      });
    });

    expect(mockedUpdateMember).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ role: "Full-Stack Developer" }),
    );
    expect(mockedCreateMember).not.toHaveBeenCalled();
  });
});
