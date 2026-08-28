jest.mock("../api/applicationService", () => ({
  __esModule: true,
  submitMembershipApplication: jest.fn(),
}));

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JoinUsModal, {
  isValidEmail,
  isValidHttpUrl,
  isValidPdfFile,
  isValidImageFile,
  getApplicationFormErrors,
  MAX_FILE_SIZE_BYTES,
} from "./JoinUsModal";
import { submitMembershipApplication } from "../api/applicationService";
import type { MembershipApplicationFormValues } from "../types/application.types";

const mockedSubmit = submitMembershipApplication as jest.Mock;

const oversizedFile = (name: string, type: string): File => {
  const file = new File(["content"], name, { type });
  Object.defineProperty(file, "size", { value: MAX_FILE_SIZE_BYTES + 1 });
  return file;
};

const EMPTY_FORM: MembershipApplicationFormValues = {
  fullName: "",
  email: "",
  githubUrl: "",
  skills: [],
  phoneNumber: "",
  gender: "",
  strengths: "",
  weaknesses: "",
  applicationLetter: null,
  image: null,
};

describe("isValidEmail", () => {
  test("accepts a well-formed email", () => {
    expect(isValidEmail("jane@example.com")).toBe(true);
  });

  test("rejects a string without an @", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });
});

describe("isValidHttpUrl", () => {
  test("accepts an https URL", () => {
    expect(isValidHttpUrl("https://github.com/jane")).toBe(true);
  });

  test("rejects a non-URL string", () => {
    expect(isValidHttpUrl("just some text")).toBe(false);
  });

  test("rejects a non-http(s) protocol", () => {
    expect(isValidHttpUrl("ftp://example.com/file")).toBe(false);
  });
});

describe("isValidPdfFile", () => {
  test("accepts a .pdf file under the size limit", () => {
    const file = new File(["content"], "letter.pdf", {
      type: "application/pdf",
    });
    expect(isValidPdfFile(file)).toBe(true);
  });

  test("rejects a non-pdf file", () => {
    const file = new File(["content"], "letter.docx", {
      type: "application/msword",
    });
    expect(isValidPdfFile(file)).toBe(false);
  });

  test("rejects a pdf file over 5MB", () => {
    expect(isValidPdfFile(oversizedFile("letter.pdf", "application/pdf"))).toBe(
      false,
    );
  });

  test("rejects when no file is provided (required field)", () => {
    expect(isValidPdfFile(null)).toBe(false);
  });
});

describe("isValidImageFile", () => {
  test("is valid when no file is provided (optional field)", () => {
    expect(isValidImageFile(null)).toBe(true);
  });

  test("accepts a .png file under the size limit", () => {
    const file = new File(["content"], "photo.png", { type: "image/png" });
    expect(isValidImageFile(file)).toBe(true);
  });

  test("rejects an unsupported image extension", () => {
    const file = new File(["content"], "photo.bmp", { type: "image/bmp" });
    expect(isValidImageFile(file)).toBe(false);
  });

  test("rejects an image file over 5MB", () => {
    expect(isValidImageFile(oversizedFile("photo.png", "image/png"))).toBe(
      false,
    );
  });
});

describe("getApplicationFormErrors", () => {
  test("flags every required field as missing on an empty form", () => {
    const errors = getApplicationFormErrors(EMPTY_FORM);
    expect(Object.keys(errors)).toEqual(
      expect.arrayContaining([
        "fullName",
        "email",
        "githubUrl",
        "skills",
        "phoneNumber",
        "gender",
        "strengths",
        "weaknesses",
        "applicationLetter",
      ]),
    );
  });

  test("returns no errors for a fully valid form", () => {
    const pdf = new File(["content"], "letter.pdf", {
      type: "application/pdf",
    });
    const errors = getApplicationFormErrors({
      ...EMPTY_FORM,
      fullName: "Jane Doe",
      email: "jane@example.com",
      githubUrl: "https://github.com/jane",
      skills: ["React"],
      phoneNumber: "+250781234567",
      gender: "Female",
      strengths: "Fast learner",
      weaknesses: "Impatient",
      applicationLetter: pdf,
    });
    expect(errors).toEqual({});
  });

  test("does not require the optional image field", () => {
    const pdf = new File(["content"], "letter.pdf", {
      type: "application/pdf",
    });
    const errors = getApplicationFormErrors({
      ...EMPTY_FORM,
      fullName: "Jane Doe",
      email: "jane@example.com",
      githubUrl: "https://github.com/jane",
      skills: ["React"],
      phoneNumber: "+250781234567",
      gender: "Female",
      strengths: "Fast learner",
      weaknesses: "Impatient",
      applicationLetter: pdf,
      image: null,
    });
    expect(errors.image).toBeUndefined();
  });
});

describe("<JoinUsModal />", () => {
  beforeEach(() => {
    mockedSubmit.mockReset();
  });

  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <JoinUsModal isOpen={false} onClose={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("blocks submission and shows field errors when required fields are empty", async () => {
    render(<JoinUsModal isOpen={true} onClose={jest.fn()} />);

    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );

    expect(
      await screen.findByText(/full name is required/i),
    ).toBeInTheDocument();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  const fillRequiredFields = async () => {
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "+250781234567" },
    });
    fireEvent.change(screen.getByLabelText(/^gender/i), {
      target: { value: "Female" },
    });
    fireEvent.change(screen.getByLabelText(/github url/i), {
      target: { value: "https://github.com/jane" },
    });
    fireEvent.change(screen.getByLabelText(/your strengths/i), {
      target: { value: "Fast learner" },
    });
    fireEvent.change(screen.getByLabelText(/your weaknesses/i), {
      target: { value: "Impatient" },
    });

    fireEvent.change(screen.getByLabelText(/add a skill/i), {
      target: { value: "React" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^add$/i }));

    const pdf = new File(["content"], "letter.pdf", {
      type: "application/pdf",
    });
    await act(async () => {
      await userEvent.upload(screen.getByLabelText(/application letter/i), pdf);
    });
  };

  test("submits successfully and shows a non-resubmittable confirmation", async () => {
    mockedSubmit.mockResolvedValue({
      status: "success",
      message:
        "Application submitted successfully. We will review it and get back to you.",
      data: { application: { id: "app-1" } },
    });

    render(<JoinUsModal isOpen={true} onClose={jest.fn()} />);
    await fillRequiredFields();

    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );

    expect(
      await screen.findByText(/application submitted successfully/i),
    ).toBeInTheDocument();
    expect(mockedSubmit).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: /submit application/i }),
    ).not.toBeInTheDocument();
  });

  test("shows a specific 'already applied' message on a 409 response, not a generic error", async () => {
    mockedSubmit.mockRejectedValue({
      statusCode: 409,
      message: "An application from this email is already pending review",
    });

    render(<JoinUsModal isOpen={true} onClose={jest.fn()} />);
    await fillRequiredFields();

    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );

    expect(
      await screen.findByText(/already pending review/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/already applied/i)).toBeInTheDocument();
  });

  test("shows the backend's message verbatim on a 400 response", async () => {
    mockedSubmit.mockRejectedValue({
      statusCode: 400,
      message: "githubUrl must be a valid URL",
    });

    render(<JoinUsModal isOpen={true} onClose={jest.fn()} />);
    await fillRequiredFields();

    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );

    expect(
      await screen.findByText(/githuburl must be a valid url/i),
    ).toBeInTheDocument();
  });

  test("shows a generic retryable error on a network/500 failure", async () => {
    mockedSubmit.mockRejectedValue({
      statusCode: 0,
      message: "Network error. Please check your connection.",
    });

    render(<JoinUsModal isOpen={true} onClose={jest.fn()} />);
    await fillRequiredFields();

    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );

    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit application/i }),
    ).not.toBeDisabled();
  });

  test("does not persist form values to localStorage", async () => {
    mockedSubmit.mockResolvedValue({
      status: "success",
      message: "Application submitted successfully.",
      data: { application: { id: "app-1" } },
    });

    render(<JoinUsModal isOpen={true} onClose={jest.fn()} />);
    await fillRequiredFields();
    fireEvent.click(
      screen.getByRole("button", { name: /submit application/i }),
    );

    await waitFor(() => expect(mockedSubmit).toHaveBeenCalledTimes(1));
    expect(window.localStorage.length).toBe(0);
  });
});
