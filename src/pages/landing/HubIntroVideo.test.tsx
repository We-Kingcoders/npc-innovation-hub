jest.mock("../../hooks/useHubVideo", () => ({
  __esModule: true,
  useHubVideo: jest.fn(),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { useHubVideo } from "../../hooks/useHubVideo";
import HubIntroVideo, { getCloudinaryVideoThumbnail } from "./HubIntroVideo";

const mockedUseHubVideo = useHubVideo as jest.Mock;

const sampleVideo = {
  videoUrl: "https://res.cloudinary.com/demo/video/upload/v1/hub-intro.mp4",
  title: "Welcome to the Hub",
  description: "A quick look at what we do.",
};

describe("getCloudinaryVideoThumbnail", () => {
  test("swaps a Cloudinary video extension for .jpg", () => {
    expect(
      getCloudinaryVideoThumbnail(
        "https://res.cloudinary.com/demo/video/upload/v1/hub-intro.mp4",
      ),
    ).toBe("https://res.cloudinary.com/demo/video/upload/v1/hub-intro.jpg");
  });

  test("preserves a query string after the extension", () => {
    expect(
      getCloudinaryVideoThumbnail(
        "https://res.cloudinary.com/demo/video/upload/v1/hub-intro.mp4?x=1",
      ),
    ).toBe("https://res.cloudinary.com/demo/video/upload/v1/hub-intro.jpg?x=1");
  });

  test("returns null for a non-Cloudinary URL", () => {
    expect(
      getCloudinaryVideoThumbnail("https://cdn.example.com/hub-intro.mp4"),
    ).toBeNull();
  });

  test("returns null for a Cloudinary URL that isn't a video delivery URL", () => {
    expect(
      getCloudinaryVideoThumbnail(
        "https://res.cloudinary.com/demo/image/upload/v1/photo.jpg",
      ),
    ).toBeNull();
  });
});

describe("<HubIntroVideo />", () => {
  afterEach(() => jest.clearAllMocks());

  test("renders nothing when no video has been uploaded", () => {
    mockedUseHubVideo.mockReturnValue({
      video: null,
      loading: false,
      error: null,
      fetchVideo: jest.fn(),
    });

    const { container } = render(<HubIntroVideo />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders nothing while loading", () => {
    mockedUseHubVideo.mockReturnValue({
      video: null,
      loading: true,
      error: null,
      fetchVideo: jest.fn(),
    });

    const { container } = render(<HubIntroVideo />);

    expect(container).toBeEmptyDOMElement();
  });

  test("renders the title, description, and a play button when a video exists, without loading the video itself", () => {
    mockedUseHubVideo.mockReturnValue({
      video: sampleVideo,
      loading: false,
      error: null,
      fetchVideo: jest.fn(),
    });

    render(<HubIntroVideo />);

    expect(screen.getByText("Welcome to the Hub")).toBeInTheDocument();
    expect(screen.getByText("A quick look at what we do.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /play video/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("hub-intro-video")).not.toBeInTheDocument();
  });

  test("mounts the video element only after the play button is clicked, with no autoplay attribute", () => {
    mockedUseHubVideo.mockReturnValue({
      video: sampleVideo,
      loading: false,
      error: null,
      fetchVideo: jest.fn(),
    });

    render(<HubIntroVideo />);

    fireEvent.click(screen.getByRole("button", { name: /play video/i }));

    const videoEl = screen.getByTestId("hub-intro-video");
    expect(videoEl).toBeInTheDocument();
    expect(videoEl).not.toHaveAttribute("autoplay");
    expect(videoEl).toHaveAttribute(
      "src",
      "https://res.cloudinary.com/demo/video/upload/v1/hub-intro.mp4",
    );
  });
});
