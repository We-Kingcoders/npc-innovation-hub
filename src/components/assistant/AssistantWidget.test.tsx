jest.mock("../../api/assistant.api", () => ({
  __esModule: true,
  sendAssistantMessage: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AssistantWidget, { OPEN_ASSISTANT_CHAT_EVENT } from "./AssistantWidget";
import { sendAssistantMessage } from "../../api/assistant.api";

const mockedSend = sendAssistantMessage as jest.Mock;

function renderWidget() {
  return render(<AssistantWidget />);
}

function openPanel() {
  fireEvent.click(screen.getByLabelText("Chat with NPC Innovation Hub"));
}

describe("<AssistantWidget /> (floating NPC AI Assistant)", () => {
  afterEach(() => jest.clearAllMocks());

  it("starts closed - the panel isn't in the document until the launcher is clicked", () => {
    renderWidget();

    expect(
      screen.queryByText("Send a message to start chatting!"),
    ).not.toBeInTheDocument();

    openPanel();

    expect(
      screen.getByText("Send a message to start chatting!"),
    ).toBeInTheDocument();
    expect(screen.getByText("What is NPC Innovation Hub?")).toBeInTheDocument();
  });

  it("opens when another component dispatches the shared open event", () => {
    renderWidget();

    expect(
      screen.queryByText("Send a message to start chatting!"),
    ).not.toBeInTheDocument();

    fireEvent(window, new Event(OPEN_ASSISTANT_CHAT_EVENT));

    expect(
      screen.getByText("Send a message to start chatting!"),
    ).toBeInTheDocument();
  });

  it("closes on clicking the launcher again", () => {
    renderWidget();
    openPanel();
    expect(
      screen.getByText("Send a message to start chatting!"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close chat"));

    expect(
      screen.queryByText("Send a message to start chatting!"),
    ).not.toBeInTheDocument();
  });

  it("closes on Escape", () => {
    renderWidget();
    openPanel();
    expect(
      screen.getByText("Send a message to start chatting!"),
    ).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(
      screen.queryByText("Send a message to start chatting!"),
    ).not.toBeInTheDocument();
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

    renderWidget();
    openPanel();
    fireEvent.click(screen.getByText("What is NPC Innovation Hub?"));

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

    renderWidget();
    openPanel();
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

    renderWidget();
    openPanel();
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

    fireEvent.click(screen.getByText("Retry"));

    await waitFor(() =>
      expect(screen.getByText("Recovered reply.")).toBeInTheDocument(),
    );
    expect(mockedSend).toHaveBeenCalledTimes(2);
    expect(mockedSend.mock.calls[1][0]).toMatchObject({
      message: "What is NPC Innovation Hub?",
    });
  });

  it("does not send an empty or whitespace-only message", () => {
    renderWidget();
    openPanel();
    const input = screen.getByLabelText(
      "Type your question for the NPC Innovation Hub assistant",
    );

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(mockedSend).not.toHaveBeenCalled();
  });
});
