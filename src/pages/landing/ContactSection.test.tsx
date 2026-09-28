jest.mock("../../api/contactService", () => ({
  __esModule: true,
  submitContactMessage: jest.fn(),
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactSection from "./ContactSection";
import { submitContactMessage } from "../../api/contactService";

const mockedSubmit = submitContactMessage as jest.Mock;

function renderSection() {
  return render(
    <MemoryRouter>
      <ContactSection />
    </MemoryRouter>,
  );
}

function fillForm() {
  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Jane Visitor" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "jane@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Hello, I have a question." },
  });
}

describe("ContactSection - real backend submission", () => {
  afterEach(() => jest.clearAllMocks());

  it("submits the form to the backend (not a mailto: link) with the entered fields", async () => {
    mockedSubmit.mockResolvedValue({
      status: "success",
      message:
        "Your message has been sent successfully. We will review it and get back to you soon.",
      data: {
        contactMessage: {
          id: "1",
          email: "jane@example.com",
          name: "Jane Visitor",
          createdAt: new Date().toISOString(),
        },
      },
    });

    renderSection();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(mockedSubmit).toHaveBeenCalledWith({
        name: "Jane Visitor",
        email: "jane@example.com",
        message: "Hello, I have a question.",
      }),
    );
  });

  it("shows a success state naming the submitted email after a successful submission", async () => {
    mockedSubmit.mockResolvedValue({
      status: "success",
      message: "ok",
      data: {
        contactMessage: {
          id: "1",
          email: "jane@example.com",
          name: "Jane Visitor",
          createdAt: new Date().toISOString(),
        },
      },
    });

    renderSection();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText("Message Sent!")).toBeInTheDocument(),
    );
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    // The form itself is replaced by the success panel.
    expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
  });

  it("shows a distinct error message and keeps the form on failure, without submitting via mailto", async () => {
    mockedSubmit.mockRejectedValue({
      response: {
        data: { message: "Too many requests. Please try again later." },
      },
    });

    renderSection();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(
        screen.getByText("Too many requests. Please try again later."),
      ).toBeInTheDocument(),
    );
    // The form is still there - the visitor can retry.
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("lets the visitor send another message from the success state", async () => {
    mockedSubmit.mockResolvedValue({
      status: "success",
      message: "ok",
      data: {
        contactMessage: {
          id: "1",
          email: "jane@example.com",
          name: "Jane Visitor",
          createdAt: new Date().toISOString(),
        },
      },
    });

    renderSection();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText("Message Sent!")).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /send another message/i }),
    );

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("still shows the direct email link as a fallback contact method", () => {
    renderSection();
    const emailLink = screen.getByText("npcinnovationhub2024@gmail.com");
    expect(emailLink.closest("a")).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:npcinnovationhub2024@gmail.com"),
    );
  });
});
