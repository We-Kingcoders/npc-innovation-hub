jest.mock("../client", () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import apiClient from "../client";
import { getHubVideo } from "./hubVideo.api";

const mockedGet = apiClient.get as jest.Mock;

const sampleVideo = {
  videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/hub-intro.mp4",
  title: "Welcome to the Hub",
  description: "A quick look at what we do.",
};

describe("getHubVideo", () => {
  afterEach(() => jest.clearAllMocks());

  test("calls the hub-video route", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", data: { video: null } },
    });

    await getHubVideo();

    expect(mockedGet).toHaveBeenCalledWith("/api/hub-video");
  });

  test("returns the video from the standard { data: { video } } envelope", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", data: { video: sampleVideo } },
    });

    const result = await getHubVideo();

    expect(result).toEqual(sampleVideo);
  });

  test("returns null from the standard envelope when no video has been uploaded", async () => {
    mockedGet.mockResolvedValue({
      data: { status: "success", data: { video: null } },
    });

    const result = await getHubVideo();

    expect(result).toBeNull();
  });

  test("accepts a flat { video } response with no data wrapper", async () => {
    mockedGet.mockResolvedValue({ data: { video: sampleVideo } });

    const result = await getHubVideo();

    expect(result).toEqual(sampleVideo);
  });

  test("accepts a flat { video: null } response with no data wrapper", async () => {
    mockedGet.mockResolvedValue({ data: { video: null } });

    const result = await getHubVideo();

    expect(result).toBeNull();
  });

  test("accepts the video object returned directly with no wrapper at all", async () => {
    mockedGet.mockResolvedValue({ data: sampleVideo });

    const result = await getHubVideo();

    expect(result).toEqual(sampleVideo);
  });

  test("returns null for an unrecognized shape instead of throwing", async () => {
    mockedGet.mockResolvedValue({ data: {} });

    const result = await getHubVideo();

    expect(result).toBeNull();
  });
});
