jest.mock("../../api/assistant.api", () => ({
  __esModule: true,
  sendAssistantMessage: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ChatDesign from "./Help";
import { sendAssistantMessage } from "../../api/assistant.api";

const mockedSend = sendAssistantMessage as jest.Mock;

function renderChat() {
  return render(
    <MemoryRouter>
      <ChatDesign />
    </MemoryRouter>,
  );
}

describe("ChatDesign (Chat with Us / NPC AI Assistant)", () => {
  afterEach(() => jest.clearAllMocks());

  it("shows suggested questions in the empty state before any message is sent", () => {
    renderChat();

    expect(screen.getByText("What is NPC Innovation Hub?")).toBeInTheDocument();
    expect(
      screen.getByText("Send a message to start chatting!"),
    ).toBeInTheDocument();
  });

  it("sends a suggested question on click and renders the assistant's reply", async () => {
    mockedSend.mockResolvedValue({
      success: true,
      data: {
        message: "NPC Innovation Hub is a tech innovation platform.",
        conversationId: "conv_1",
        language: "en",
      },
    });

    renderChat();
    fireEvent.click(screen.getByText("What is NPC Innovation Hub?"));

    expect(screen.getByText("What is NPC Innovation Hub?")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByText("NPC Innovation Hub is a tech innovation platform."),
      ).toBeInTheDocument(),
    );
    expect(mockedSend).toHaveBeenCalledWith(
      expect.objectContaining({ message: "What is NPC Innovation Hub?" }),
    );
  });

  it("sends a typed message on Enter and reuses the conversationId on the next turn", async () => {
    mockedSend
      .mockResolvedValueOnce({
        success: true,
        data: {
          message: "First reply.",
          conversationId: "conv_42",
          language: "en",
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          message: "Second reply.",
          conversationId: "conv_42",
          language: "en",
        },
      });

    renderChat();
    const input = screen.getByLabelText(
      "Type your question for the NPC Innovation Hub assistant",
    );

    fireEvent.change(input, {
      target: { value: "Tell me about your projects" },
    });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });
    await waitFor(() =>
      expect(screen.getByText("First reply.")).toBeInTheDocument(),
    );

    fireEvent.change(input, { target: { value: "Anything else?" } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });
    await waitFor(() =>
      expect(screen.getByText("Second reply.")).toBeInTheDocument(),
    );

    expect(mockedSend.mock.calls[1][0]).toMatchObject({
      conversationId: "conv_42",
    });
  });

  it("shows a distinct, friendly error and a working Retry button on failure", async () => {
    mockedSend
      .mockRejectedValueOnce({
        message:
          "The assistant is temporarily unavailable. Please try again shortly.",
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          message: "Recovered reply.",
          conversationId: "conv_7",
          language: "en",
        },
      });

    renderChat();
    const input = screen.getByLabelText(
      "Type your question for the NPC Innovation Hub assistant",
    );
    fireEvent.change(input, {
      target: { value: "What is NPC Innovation Hub?" },
    });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

    await waitFor(() =>
      expect(
        screen.getByText(
          "The assistant is temporarily unavailable. Please try again shortly.",
        ),
      ).toBeInTheDocument(),
    );

    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    await waitFor(() =>
      expect(screen.getByText("Recovered reply.")).toBeInTheDocument(),
    );
    expect(mockedSend).toHaveBeenCalledTimes(2);
    expect(mockedSend.mock.calls[1][0]).toMatchObject({
      message: "What is NPC Innovation Hub?",
    });
  });

  it("does not send an empty or whitespace-only message", () => {
    renderChat();
    const input = screen.getByLabelText(
      "Type your question for the NPC Innovation Hub assistant",
    );

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockedSend).not.toHaveBeenCalled();
  });
});
