jest.mock("../api/member/hubVideo.api", () => ({
  __esModule: true,
  getHubVideo: jest.fn(),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { getHubVideo } from "../api/member/hubVideo.api";
import { useHubVideo } from "./useHubVideo";

const mockedGetHubVideo = getHubVideo as jest.Mock;

const sampleVideo = {
  videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/hub-intro.mp4",
  title: "Welcome to the Hub",
  description: "A quick look at what we do.",
};

describe("useHubVideo", () => {
  afterEach(() => jest.clearAllMocks());

  test("starts in a loading state", async () => {
    mockedGetHubVideo.mockResolvedValue(null);

    const { result } = renderHook(() => useHubVideo());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  test("populates the video when one has been uploaded", async () => {
    mockedGetHubVideo.mockResolvedValue(sampleVideo);

    const { result } = renderHook(() => useHubVideo());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.video).toEqual(sampleVideo);
  });

  test("resolves to null when no video has been uploaded yet", async () => {
    mockedGetHubVideo.mockResolvedValue(null);

    const { result } = renderHook(() => useHubVideo());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.video).toBeNull();
    expect(result.current.error).toBeNull();
  });

  test("surfaces an error message when the fetch fails", async () => {
    mockedGetHubVideo.mockRejectedValue({ message: "Server error" });

    const { result } = renderHook(() => useHubVideo());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("Server error");
    expect(result.current.video).toBeNull();
  });
});
