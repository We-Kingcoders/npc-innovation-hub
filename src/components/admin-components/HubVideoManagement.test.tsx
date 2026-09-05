jest.mock("../../api/admin/hubVideo.api", () => ({
  __esModule: true,
  getAdminHubVideo: jest.fn(),
  uploadHubVideo: jest.fn(),
  deleteHubVideo: jest.fn(),
}));

import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HubVideoManagement from "./HubVideoManagement";
import {
  getAdminHubVideo,
  uploadHubVideo,
  deleteHubVideo,
} from "../../api/admin/hubVideo.api";

const mockedGetHubVideo = getAdminHubVideo as jest.Mock;
const mockedUpload = uploadHubVideo as jest.Mock;
const mockedDelete = deleteHubVideo as jest.Mock;

describe("HubVideoManagement", () => {
  beforeEach(() => {
    mockedGetHubVideo.mockReset();
    mockedUpload.mockReset();
    mockedDelete.mockReset();
  });

  test("shows a loading skeleton before data resolves", () => {
    mockedGetHubVideo.mockReturnValue(new Promise(() => {}));
    const { container } = render(<HubVideoManagement />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  test("renders the current video when one exists", async () => {
    mockedGetHubVideo.mockResolvedValue({
      videoUrl: "https://example.com/intro.mp4",
      title: "Welcome",
      description: "A short intro",
    });
    render(<HubVideoManagement />);

    await waitFor(() => {
      expect(screen.getByText("Welcome")).toBeInTheDocument();
    });
    expect(screen.getByText("A short intro")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Video" }),
    ).toBeInTheDocument();
  });

  test("shows an empty state when no video has been uploaded", async () => {
    mockedGetHubVideo.mockResolvedValue(null);
    render(<HubVideoManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("No hub video has been uploaded yet."),
      ).toBeInTheDocument();
    });
  });

  test("uploads a chosen video file", async () => {
    mockedGetHubVideo.mockResolvedValue(null);
    mockedUpload.mockResolvedValue({
      videoUrl: "https://example.com/new.mp4",
    });

    const user = userEvent.setup();
    render(<HubVideoManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("No hub video has been uploaded yet."),
      ).toBeInTheDocument();
    });

    const fileInput = document.getElementById(
      "hub-video-file",
    ) as HTMLInputElement;
    const videoFile = new File(["content"], "intro.mp4", {
      type: "video/mp4",
    });
    await act(async () => {
      await user.upload(fileInput, videoFile);
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: /Upload Video/ }));
    });

    await waitFor(() => {
      expect(mockedUpload).toHaveBeenCalled();
    });
    const [formData] = mockedUpload.mock.calls[0];
    expect(formData.get("video")).toBeInstanceOf(File);
  });

  test("deletes the video after confirmation", async () => {
    mockedGetHubVideo.mockResolvedValue({
      videoUrl: "https://example.com/intro.mp4",
    });
    mockedDelete.mockResolvedValue(undefined);
    window.confirm = jest.fn(() => true);

    const user = userEvent.setup();
    render(<HubVideoManagement />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Remove Video" }),
      ).toBeInTheDocument();
    });

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Remove Video" }));
    });

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalled();
    });
    expect(
      screen.getByText("No hub video has been uploaded yet."),
    ).toBeInTheDocument();
  });
});
