// src/pages/apply/ApplyPage.tsx
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitMembershipApplication } from "../../api/applicationService";
import { getApplicationFormErrors } from "../../components/JoinUsModal";
import { APPLICATION_GENDERS } from "../../types/application.types";
import type { MembershipApplicationFormValues } from "../../types/application.types";

type Status = "idle" | "loading" | "success" | "error";
type ErrorKind = "duplicate" | "generic";

const INITIAL_FORM: MembershipApplicationFormValues = {
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

const buildApplicationFormData = (
  form: MembershipApplicationFormValues,
): FormData => {
  const data = new FormData();
  data.append("fullName", form.fullName.trim());
  data.append("email", form.email.trim());
  data.append("githubUrl", form.githubUrl.trim());
  data.append("skills", JSON.stringify(form.skills));
  data.append("phoneNumber", form.phoneNumber.trim());
  data.append("gender", form.gender);
  data.append("strengths", form.strengths.trim());
  data.append("weaknesses", form.weaknesses.trim());
  if (form.applicationLetter)
    data.append("applicationLetter", form.applicationLetter);
  if (form.image) data.append("image", form.image);
  return data;
};

const formatFileSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const baseInput =
  "w-full font-sans text-sm text-[#1a2d4a] bg-[#f5f8fc] border-[1.5px] border-[#dce8f5] rounded-xl px-3.5 py-2.5 outline-none " +
  "transition-all duration-200 ease-in-out placeholder:text-[#a4b5cc] " +
  "focus:border-[#0055b3] focus:bg-white focus:ring-2 focus:ring-[#0055b3]/10 " +
  "hover:border-[#afc8e8]";

const errorInput =
  "border-[#e05252] bg-[#fff8f8] focus:border-[#e05252] focus:ring-red-100";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p className="text-xs font-bold tracking-[.14em] uppercase text-[#002B56]/45 mb-4">
    {children}
  </p>
);

const Divider = () => (
  <div
    className="my-6 h-px"
    style={{ background: "linear-gradient(90deg,#e2eaf4,transparent)" }}
  />
);

const Field: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="text-sm font-medium text-[#2d3f5c] tracking-[.01em]"
    >
      {label}
      {required && <span className="text-[#e05252] ml-0.5">*</span>}
    </label>
    {children}
    {error && (
      <span className="text-xs text-[#e05252] -mt-0.5 flex items-center gap-1">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
        {error}
      </span>
    )}
  </div>
);

export const ApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] =
    useState<MembershipApplicationFormValues>(INITIAL_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uploadPercent, setUploadPercent] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [touched, setTouched] = useState<
    Partial<Record<keyof MembershipApplicationFormValues, boolean>>
  >({});

  const letterInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const errors = useMemo(() => getApplicationFormErrors(form), [form]);

  const getError = (field: keyof MembershipApplicationFormValues): string =>
    touched[field] ? errors[field] || "" : "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: keyof MembershipApplicationFormValues) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || form.skills.includes(value)) {
      setSkillInput("");
      return;
    }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, value] }));
    setSkillInput("");
    setTouched((prev) => ({ ...prev, skills: true }));
  };

  const removeSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, applicationLetter: file }));
    setTouched((prev) => ({ ...prev, applicationLetter: true }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
    setTouched((prev) => ({ ...prev, image: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      githubUrl: true,
      skills: true,
      phoneNumber: true,
      gender: true,
      strengths: true,
      weaknesses: true,
      applicationLetter: true,
      image: true,
    });
    if (Object.keys(errors).length > 0) return;

    setStatus("loading");
    setErrorMsg("");
    setUploadPercent(0);
    try {
      const formData = buildApplicationFormData(form);
      const response = await submitMembershipApplication(
        formData,
        setUploadPercent,
      );
      setSuccessMsg(response.message);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const apiErr = err as { statusCode?: number; message?: string };
      if (apiErr.statusCode === 409) {
        setErrorKind("duplicate");
        setErrorMsg(
          apiErr.message ||
            "An application from this email is already pending review",
        );
      } else {
        setErrorKind("generic");
        setErrorMsg(
          apiErr.message || "Something went wrong. Please try again.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      {/* Hero */}
      <div
        className="px-4 py-16 text-center text-white"
        style={{
          background:
            "linear-gradient(135deg,#002B56 0%,#004a94 60%,#0066cc 100%)",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-sm font-semibold
            bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Go Back
        </button>
        <p className="text-[#7ec8f5] text-xs font-medium tracking-[.16em] uppercase mb-2">
          NPC Innovation Hub
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
          Join the Hub
        </h1>
        <p className="text-white/70 text-base max-w-xl mx-auto">
          Tell us about yourself and attach your application letter — we'll
          review it and get back to you by email.
        </p>
      </div>

      {/* Form / success card */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 -mt-10 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-9">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div
                className="flex items-center justify-center w-[72px] h-[72px] rounded-full"
                style={{
                  background: "linear-gradient(135deg,#002B56,#004a94)",
                  boxShadow: "0 8px 24px rgba(0,43,86,.3)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-[#002B56] text-2xl font-extrabold">
                Application Submitted!
              </h2>
              <p className="text-[#5a7091] text-sm leading-relaxed max-w-md">
                {successMsg ||
                  "Application submitted successfully. We will review it and get back to you by email."}
              </p>
              <button
                onClick={() => navigate("/")}
                type="button"
                className="mt-2 px-7 py-2.5 rounded-full border-2 border-[#002B56] bg-transparent text-[#002B56] text-sm font-bold cursor-pointer transition-all duration-200 hover:bg-[#002B56] hover:text-white active:scale-95"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <SectionLabel>Personal Information</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="apply-full-name"
                  label="Full Name"
                  required
                  error={getError("fullName")}
                >
                  <input
                    id="apply-full-name"
                    className={`${baseInput} ${getError("fullName") ? errorInput : ""}`}
                    type="text"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("fullName")}
                    autoComplete="name"
                  />
                </Field>
                <Field
                  id="apply-email"
                  label="Email Address"
                  required
                  error={getError("email")}
                >
                  <input
                    id="apply-email"
                    className={`${baseInput} ${getError("email") ? errorInput : ""}`}
                    type="email"
                    name="email"
                    placeholder="jane.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1 mt-4">
                <Field
                  id="apply-phone"
                  label="Phone Number"
                  required
                  error={getError("phoneNumber")}
                >
                  <input
                    id="apply-phone"
                    className={`${baseInput} ${getError("phoneNumber") ? errorInput : ""}`}
                    type="tel"
                    name="phoneNumber"
                    placeholder="+250781234567"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phoneNumber")}
                    autoComplete="tel"
                  />
                </Field>
                <Field
                  id="apply-gender"
                  label="Gender"
                  required
                  error={getError("gender")}
                >
                  <select
                    id="apply-gender"
                    className={`${baseInput} cursor-pointer ${getError("gender") ? errorInput : ""}`}
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    onBlur={() => handleBlur("gender")}
                  >
                    <option value="">Select gender</option>
                    {APPLICATION_GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <Divider />

              <SectionLabel>Links &amp; Skills</SectionLabel>
              <Field
                id="apply-github"
                label="GitHub URL"
                required
                error={getError("githubUrl")}
              >
                <input
                  id="apply-github"
                  className={`${baseInput} ${getError("githubUrl") ? errorInput : ""}`}
                  type="url"
                  name="githubUrl"
                  placeholder="https://github.com/username"
                  value={form.githubUrl}
                  onChange={handleChange}
                  onBlur={() => handleBlur("githubUrl")}
                  autoComplete="url"
                />
              </Field>

              <div className="mt-4">
                <Field
                  id="apply-skill-input"
                  label="Add a skill"
                  required
                  error={getError("skills")}
                >
                  <div className="flex gap-2">
                    <input
                      id="apply-skill-input"
                      className={baseInput}
                      type="text"
                      placeholder="e.g. React, Node.js…"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onBlur={() => handleBlur("skills")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-5 rounded-xl bg-[#002B56] text-white text-sm font-bold hover:bg-[#004a94] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </Field>
                {form.skills.length > 0 && (
                  <ul
                    aria-label="Selected skills"
                    className="flex flex-wrap gap-2 mt-3 list-none p-0 m-0"
                  >
                    {form.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-1.5 bg-[#e6f0ff] text-[#002B56] text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(skill)}
                          className="text-[#002B56]/60 hover:text-[#e05252]"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <Divider />

              <SectionLabel>About You</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="apply-strengths"
                  label="Your Strengths"
                  required
                  error={getError("strengths")}
                >
                  <textarea
                    id="apply-strengths"
                    className={`${baseInput} resize-y min-h-[90px] leading-relaxed ${getError("strengths") ? errorInput : ""}`}
                    name="strengths"
                    placeholder="What are you good at?"
                    value={form.strengths}
                    onChange={handleChange}
                    onBlur={() => handleBlur("strengths")}
                  />
                </Field>
                <Field
                  id="apply-weaknesses"
                  label="Your Weaknesses"
                  required
                  error={getError("weaknesses")}
                >
                  <textarea
                    id="apply-weaknesses"
                    className={`${baseInput} resize-y min-h-[90px] leading-relaxed ${getError("weaknesses") ? errorInput : ""}`}
                    name="weaknesses"
                    placeholder="Where do you want to grow?"
                    value={form.weaknesses}
                    onChange={handleChange}
                    onBlur={() => handleBlur("weaknesses")}
                  />
                </Field>
              </div>

              <Divider />

              <SectionLabel>Documents</SectionLabel>
              <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                <Field
                  id="apply-letter"
                  label="Application Letter (PDF)"
                  required
                  error={getError("applicationLetter")}
                >
                  <button
                    type="button"
                    onClick={() => letterInputRef.current?.click()}
                    className={`${baseInput} text-left ${getError("applicationLetter") ? errorInput : ""}`}
                  >
                    {form.applicationLetter
                      ? `${form.applicationLetter.name} (${formatFileSize(form.applicationLetter.size)})`
                      : "Click to choose a PDF file"}
                  </button>
                  <input
                    id="apply-letter"
                    ref={letterInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleLetterChange}
                  />
                </Field>

                <Field
                  id="apply-photo"
                  label="Profile Photo (optional)"
                  error={getError("image")}
                >
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className={`${baseInput} text-left ${getError("image") ? errorInput : ""}`}
                  >
                    {form.image
                      ? `${form.image.name} (${formatFileSize(form.image.size)})`
                      : "Click to choose a photo"}
                  </button>
                  <input
                    id="apply-photo"
                    ref={imageInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Field>
              </div>

              {status === "error" && errorMsg && errorKind === "duplicate" && (
                <div className="flex items-start gap-2.5 mt-5 px-4 py-3.5 bg-[#fff8ea] border border-[#f0d9a6] rounded-xl text-sm text-[#8a6d1f]">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0 mt-0.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 2" />
                  </svg>
                  <div>
                    <p className="font-bold">You've already applied</p>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {status === "error" && errorMsg && errorKind === "generic" && (
                <div className="flex items-center gap-2 mt-5 px-4 py-3 bg-[#fff2f2] border border-[#f5c6c6] rounded-xl text-sm text-[#c0392b]">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {errorMsg}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className={[
                    "relative w-full py-3.5 rounded-xl border-0 text-white text-sm font-bold tracking-wide",
                    "transition-all duration-200 cursor-pointer select-none",
                    status === "loading"
                      ? "opacity-55 cursor-not-allowed"
                      : "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,43,86,.35)] active:translate-y-0",
                  ].join(" ")}
                  style={{
                    background: "linear-gradient(135deg,#002B56,#004a94)",
                    boxShadow: "0 4px 16px rgba(0,43,86,.3)",
                  }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Uploading… {uploadPercent}%
                    </span>
                  ) : (
                    "Submit Application →"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyPage;
