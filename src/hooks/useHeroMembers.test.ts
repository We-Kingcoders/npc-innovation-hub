jest.mock("../api/member/heroMembers.api", () => ({
  __esModule: true,
  getHeroMembers: jest.fn(),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { getHeroMembers } from "../api/member/heroMembers.api";
import { useHeroMembers } from "./useHeroMembers";

const mockedGetHeroMembers = getHeroMembers as jest.Mock;

const sampleMember = {
  id: "hm-1",
  name: "Jane Doe",
  imageUrl: "https://example.com/jane.jpg",
  role: "Full Stack Developer",
};

describe("useHeroMembers", () => {
  afterEach(() => jest.clearAllMocks());

  test("starts in a loading state", async () => {
    mockedGetHeroMembers.mockResolvedValue([]);

    const { result } = renderHook(() => useHeroMembers());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  test("fetches members on mount and populates them", async () => {
    mockedGetHeroMembers.mockResolvedValue([sampleMember]);

    const { result } = renderHook(() => useHeroMembers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.members).toEqual([sampleMember]);
    expect(result.current.error).toBeNull();
  });

  test("resolves to an empty array when there are no featured members", async () => {
    mockedGetHeroMembers.mockResolvedValue([]);

    const { result } = renderHook(() => useHeroMembers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.members).toEqual([]);
  });

  test("surfaces an error message when the fetch fails", async () => {
    mockedGetHeroMembers.mockRejectedValue({ message: "Server error" });

    const { result } = renderHook(() => useHeroMembers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Server error");
    expect(result.current.members).toEqual([]);
  });
});
