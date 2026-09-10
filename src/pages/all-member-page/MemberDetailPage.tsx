import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTechnologyIcon } from "../../data/iconUtils";
import { getMemberById } from "../../api/member/member.api";
import type { Member } from "../../types/member.types";

// ── Decorative-only palette for skill category cards (no server field for this) ──
const SKILL_CARD_GRADIENTS = [
  { grad: "from-violet-500 to-purple-600", bar: "bg-violet-400" },
  { grad: "from-blue-500 to-cyan-600", bar: "bg-cyan-400" },
  { grad: "from-emerald-500 to-teal-600", bar: "bg-emerald-400" },
  { grad: "from-orange-500 to-rose-500", bar: "bg-orange-400" },
];

interface ContactPlatform {
  label: string;
  emoji: string;
  grad: string;
  glow: string;
  href: string;
  icon: (c: string) => React.ReactNode;
}

function buildContactPlatforms(
  contacts: Member["contacts"],
): ContactPlatform[] {
  if (!contacts) return [];
  const platforms: ContactPlatform[] = [];

  if (contacts.linkedin) {
    platforms.push({
      label: "LinkedIn",
      emoji: "💼",
      grad: "from-[#0077b5] to-[#004182]",
      glow: "rgba(0,119,181,0.45)",
      href: contacts.linkedin,
      icon: (c) => (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.2c-1 0-1.7-.7-1.7-1.6 0-.9.7-1.6 1.7-1.6s1.7.7 1.7 1.6c0 .9-.7 1.6-1.7 1.6zm15.5 10.2h-3v-4.8c0-1.2-.4-2-1.5-2-1.1 0-1.7.7-1.7 2v4.8h-3v-9h3v1.2c.4-.6 1.2-1.5 2.9-1.5 2.1 0 3.2 1.4 3.2 4.1v5.2z" />
        </svg>
      ),
    });
  }
  if (contacts.github) {
    platforms.push({
      label: "GitHub",
      emoji: "🐙",
      grad: "from-gray-700 to-gray-900",
      glow: "rgba(55,65,81,0.5)",
      href: contacts.github,
      icon: (c) => (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.2 2.9.9.1-.6.4-1.2.7-1.5-2.7-.3-5.5-1.4-5.5-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.5 1.2.9-.3 1.8-.5 2.8-.5.9 0 1.9.2 2.8.5 2.5-1.5 3.5-1.2 3.5-1.2.6 1.7.3 3 .1 3.3.8.9 1.2 2 1.2 3.4 0 4.8-2.8 5.7-5.5 6.1.4.3.8 1 .8 2v3c0 .4.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z" />
        </svg>
      ),
    });
  }
  if (contacts.twitter) {
    platforms.push({
      label: "Twitter",
      emoji: "🐦",
      grad: "from-sky-400 to-sky-600",
      glow: "rgba(14,165,233,0.45)",
      href: contacts.twitter,
      icon: (c) => (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.6c-.9.4-1.8.6-2.8.8 1-.6 1.7-1.5 2.1-2.6-.9.6-1.9 1-3 1.2-.8-.9-2-1.5-3.3-1.5-2.5 0-4.5 2-4.5 4.5 0 .3 0 .7.1 1-3.7-.2-7-2-9.1-4.7-.4.7-.7 1.5-.7 2.3 0 1.6.8 3 2.1 3.9-.7 0-1.4-.2-2-.5v.1c0 2.3 1.6 4.2 3.9 4.7-.4.1-.8.2-1.3.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1-1.6 1.3-3.5 2-5.6 2-.4 0-.8 0-1.2-.1 2 1.3 4.4 2 7 2 8.4 0 13-7 13-13 0-.2 0-.4 0-.6.9-.6 1.6-1.5 2.2-2.4z" />
        </svg>
      ),
    });
  }
  if (contacts.instagram) {
    platforms.push({
      label: "Instagram",
      emoji: "📷",
      grad: "from-[#f58529] via-[#dd2a7b] to-[#8134af]",
      glow: "rgba(221,42,123,0.45)",
      href: contacts.instagram,
      icon: (c) => (
        <svg className={c} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-2.7 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.3 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.3 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.42.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43-.26-.66-.6-1.22-1.16-1.77-.55-.56-1.11-.9-1.77-1.16-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.7 2 12 2zm0 1.8c2.65 0 2.97.01 4.02.06.97.04 1.5.2 1.85.34.46.18.79.4 1.14.75.35.35.57.68.75 1.14.14.35.3.88.34 1.85.05 1.05.06 1.37.06 4.02s-.01 2.97-.06 4.02c-.04.97-.2 1.5-.34 1.85-.18.46-.4.79-.75 1.14-.35.35-.68.57-1.14.75-.35.14-.88.3-1.85.34-1.05.05-1.37.06-4.02.06s-2.97-.01-4.02-.06c-.97-.04-1.5-.2-1.85-.34-.46-.18-.79-.4-1.14-.75-.35-.35-.57-.68-.75-1.14-.14-.35-.3-.88-.34-1.85C3.81 14.97 3.8 14.65 3.8 12s.01-2.97.06-4.02c.04-.97.2-1.5.34-1.85.18-.46.4-.79.75-1.14.35-.35.68-.57 1.14-.75.35-.14.88-.3 1.85-.34C9.03 3.81 9.35 3.8 12 3.8zm0 3.05a5.15 5.15 0 100 10.3 5.15 5.15 0 000-10.3zm0 8.5a3.35 3.35 0 110-6.7 3.35 3.35 0 010 6.7zm5.36-8.7a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
        </svg>
      ),
    });
  }
  if (contacts.portfolio) {
    platforms.push({
      label: "Portfolio",
      emoji: "🌐",
      grad: "from-[#0C2340] to-[#14375F]",
      glow: "rgba(12,35,64,0.45)",
      href: contacts.portfolio,
      icon: (c) => (
        <svg
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2 12h20M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z"
          />
        </svg>
      ),
    });
  }

  return platforms;
}

function formatEducationYears(education: Member["education"]): string | null {
  if (!education?.startYear) return null;
  return `${education.startYear} – ${education.endYear ?? "Present"}`;
}

// ── Animation keyframes injected once ────────────────────────────────────────
const STYLES = `
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes avatarPulse {
    0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.35); }
    50%      { box-shadow:0 0 0 10px rgba(99,102,241,0); }
  }
  .anim-0 { animation: fadeUp .5s .00s both; }
  .anim-1 { animation: fadeUp .5s .08s both; }
  .anim-2 { animation: fadeUp .5s .16s both; }
  .anim-3 { animation: fadeUp .5s .24s both; }
  .anim-4 { animation: fadeUp .5s .32s both; }
  .anim-5 { animation: fadeUp .5s .40s both; }
  .clickable { transition: transform .15s, box-shadow .15s; }
  .clickable:active { transform: scale(.96); }
  .avatar-pulse { animation: avatarPulse 3s ease-in-out infinite; }
  .shimmer-hover:hover .shimmer-layer {
    animation: shimmer 1.2s linear infinite;
    background: linear-gradient(105deg,transparent 40%,rgba(255,255,255,.18) 50%,transparent 60%);
    background-size: 200% auto;
  }
`;
// ─────────────────────────────────────────────────────────────────────────────

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const found = await getMemberById(id);
        setMember(found);
      } catch (e) {
        const apiErr = e as { statusCode?: number; message?: string };
        setError(
          apiErr.statusCode === 404
            ? "This member doesn't exist or may have been removed."
            : (apiErr.message ?? "Failed to load member."),
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-16 px-4 sm:px-8 pt-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-11 w-52 bg-gray-200 rounded-full" />
          <div className="w-full h-80 bg-gray-200 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="h-64 bg-gray-200 rounded-3xl" />
            <div className="h-64 bg-gray-200 rounded-3xl" />
            <div className="h-64 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error / Not found ── */
  if (error || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-gray-800">
          Member not found 😕
        </h2>
        <p className="text-gray-500 text-base text-center max-w-sm">
          {error ?? "This member doesn't exist or may have been removed."}
        </p>
        <button
          onClick={() => navigate("/members")}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-base font-bold rounded-full hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
        >
          ← Back to Members
        </button>
      </div>
    );
  }

  const contactPlatforms = buildContactPlatforms(member.contacts);
  const educationYears = formatEducationYears(member.education);
  const hashtags = member.hashtags ?? [];
  const skillCategories = member.skillCategories ?? [];

  const heroChips = [
    member.education?.institution
      ? { e: "🎓", t: member.education.institution }
      : null,
  ].filter((c): c is { e: string; t: string } => c !== null);

  return (
    <>
      <style>{STYLES}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pb-0">
        {/* ════════ BACK BUTTON ════════ */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-7 anim-0">
          <button
            onClick={() => navigate("/members")}
            className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-full text-base font-bold
              bg-white/70 backdrop-blur-md border border-white/90 text-slate-700 shadow-sm
              hover:bg-gradient-to-r hover:from-blue-600 hover:to-violet-600
              hover:text-white hover:border-transparent hover:shadow-xl
              transition-all duration-300"
          >
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-blue-100 to-violet-100
                group-hover:from-white/20 group-hover:to-white/10
                transition-all duration-300"
            >
              <svg
                className="w-4 h-4 text-blue-700 group-hover:text-white transition-colors duration-300"
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
            </span>
            ← Back to All Members
          </button>
        </div>

        {/* ════════════════════════════════════════════
            1. HERO PROFILE BANNER
        ════════════════════════════════════════════ */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-5 anim-1">
          <div className="w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Photo */}
            <div className="relative md:w-2/5 w-full flex-shrink-0">
              <img
                src={member.imageUrl ?? ""}
                alt={member.name}
                className="w-full h-64 sm:h-80 md:h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent
                md:bg-gradient-to-r md:from-transparent md:to-slate-900/20"
              />
              <span
                className="absolute bottom-5 left-5 md:hidden px-4 py-1.5 rounded-full text-sm font-bold
                bg-white/20 backdrop-blur-sm text-white border border-white/30"
              >
                🚀 {member.role}
              </span>
            </div>

            {/* Content */}
            <div
              className="flex-1 flex flex-col justify-center px-8 sm:px-10 py-10
              bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/60"
            >
              <span
                className="hidden md:inline-flex w-fit px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest
                bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 mb-5"
              >
                🚀 {member.role}
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                {member.name}
              </h1>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-7 max-w-xl">
                {member.bio}
              </p>
              {heroChips.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-7">
                  {heroChips.map((chip) => (
                    <span
                      key={chip.t}
                      className="flex items-center gap-2 bg-white rounded-full px-4 py-2 text-sm sm:text-base text-slate-600 shadow-sm border border-slate-100 font-medium"
                    >
                      {chip.e} {chip.t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            2. ABOUT GRID
        ════════════════════════════════════════════ */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-14 anim-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            👤 About {member.name}
          </h2>
          <p className="text-slate-500 text-base mb-8">
            Get to know this member up close.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            {/* Profile card */}
            <div
              className="clickable bg-white rounded-3xl shadow-lg border border-slate-100 p-7
              flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div
                className="avatar-pulse rounded-full p-[3px]
                bg-gradient-to-tr from-violet-500 via-blue-500 to-cyan-400 mb-5"
              >
                <img
                  src={member.imageUrl ?? ""}
                  alt={member.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-1">
                {member.name}
              </h3>
              <span
                className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                bg-gradient-to-r from-blue-100 to-violet-100 text-blue-700 mb-6"
              >
                {member.role}
              </span>
              <div className="w-full space-y-2.5 text-sm sm:text-base text-slate-600 text-left">
                {member.education?.institution && (
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                    <span className="text-lg flex-shrink-0">🎓</span>
                    <span className="leading-snug">
                      {member.education.institution}
                    </span>
                  </div>
                )}
                {member.contacts?.linkedin && (
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-3 py-2.5">
                    <svg
                      className="w-5 h-5 text-blue-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.2c-1 0-1.7-.7-1.7-1.6 0-.9.7-1.6 1.7-1.6s1.7.7 1.7 1.6c0 .9-.7 1.6-1.7 1.6zm15.5 10.2h-3v-4.8c0-1.2-.4-2-1.5-2-1.1 0-1.7.7-1.7 2v4.8h-3v-9h3v1.2c.4-.6 1.2-1.5 2.9-1.5 2.1 0 3.2 1.4 3.2 4.1v5.2z" />
                    </svg>
                    <a
                      href={member.contacts.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold truncate"
                    >
                      {member.name} on LinkedIn
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* CV / Resume downloads */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {member.cvUrl ? (
                  <a
                    href={member.cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clickable flex flex-col items-center gap-2 rounded-2xl py-6 px-3 text-center font-bold text-base text-white
                      bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all"
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    📄 View CV
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl py-6 px-3 text-center font-medium text-sm text-slate-400 bg-slate-50 border border-dashed border-slate-200">
                    No CV provided
                  </div>
                )}
                {member.resumeUrl ? (
                  <a
                    href={member.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clickable flex flex-col items-center gap-2 rounded-2xl py-6 px-3 text-center font-bold text-base text-white
                      bg-gradient-to-br from-violet-500 to-purple-700 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all"
                  >
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    📋 Resume
                  </a>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl py-6 px-3 text-center font-medium text-sm text-slate-400 bg-slate-50 border border-dashed border-slate-200">
                    No resume provided
                  </div>
                )}
              </div>
            </div>

            {/* Bio card */}
            <div
              className="clickable rounded-3xl shadow-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-2xl transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg,#fffbeb 0%,#fef3c7 55%,#fde68a 100%)",
              }}
            >
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-lg font-extrabold text-amber-900 mb-4 flex items-center gap-2">
                  ✍️ Bio
                </h3>
                <p className="text-amber-800 text-base leading-relaxed flex-1">
                  {member.bio}
                </p>
                {hashtags.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-amber-200/70 flex gap-2 flex-wrap">
                    {hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-amber-200/70 text-amber-900"
                      >
                        #{tag.replace(/ /g, "")}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            3. EDUCATION BACKGROUND
        ════════════════════════════════════════════ */}
        {member.education && (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-14 anim-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              🎓 Education Background
            </h2>
            <p className="text-slate-500 text-base italic mb-8">
              "Education is the most powerful weapon which you can use to change
              the world." — Nelson Mandela
            </p>
            <div className="w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
              {/* Image */}
              <div className="relative lg:w-2/5 w-full flex-shrink-0">
                <img
                  src={member.education.imageUrl}
                  alt={member.education.institution}
                  className="w-full h-56 sm:h-72 lg:h-full object-cover"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-transparent to-transparent
                  lg:bg-gradient-to-r lg:from-transparent lg:to-blue-950/50"
                />
                <div className="absolute bottom-5 left-5 flex gap-2 lg:hidden flex-wrap">
                  {educationYears && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      🏛️ {educationYears}
                    </span>
                  )}
                  {member.education.status && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/30 backdrop-blur-sm text-emerald-200 border border-emerald-400/30">
                      🟢 {member.education.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Text */}
              <div
                className="flex-1 bg-gradient-to-br from-blue-950 via-indigo-950 to-blue-900
                px-8 sm:px-12 py-10 flex flex-col justify-center text-white"
              >
                <div className="hidden lg:flex items-center gap-3 mb-6 flex-wrap">
                  {educationYears && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/15 text-blue-200 border border-white/20">
                      🏛️ {educationYears}
                    </span>
                  )}
                  {member.education.status && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      🟢 {member.education.status}
                    </span>
                  )}
                </div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-300 mb-3">
                  {member.education.department ?? "Degree Programme"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-snug">
                  {member.education.degree}
                </h3>
                <p className="text-blue-300 italic text-base mb-6">
                  🏫 {member.education.institution}
                </p>
                <p className="text-blue-100 text-base leading-relaxed">
                  {member.education.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════
            4. CONTACTS
        ════════════════════════════════════════════ */}
        {contactPlatforms.length > 0 && (
          <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 mt-14 anim-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
              📬 Contact {member.name}
            </h2>
            <p className="text-slate-500 text-base mb-8">
              Reach out for collaboration, inquiries, or just to connect.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 w-full">
              {contactPlatforms.map((p) => (
                <a
                  key={p.label}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`shimmer-hover clickable group relative flex flex-col items-center justify-center gap-3
                    rounded-3xl py-9 sm:py-11 px-4 text-white font-extrabold text-base overflow-hidden
                    bg-gradient-to-br ${p.grad} shadow-lg
                    hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300`}
                  style={{ "--glow": p.glow } as React.CSSProperties}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = `0 0 28px 6px ${p.glow}`)
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
                >
                  <div className="shimmer-layer absolute inset-0 pointer-events-none" />
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 z-10">
                    {p.icon("w-7 h-7 text-white")}
                  </div>
                  <span className="z-10 text-base sm:text-lg">
                    {p.emoji} {p.label}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ════════════════════════════════════════════
            5. SKILLS
        ════════════════════════════════════════════ */}
        {skillCategories.length > 0 && (
          <section className="w-full mt-16 anim-5">
            <div className="w-full bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-14 px-4 sm:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                      ⚡ Skills & Technologies
                    </h2>
                    <p className="text-blue-300 text-base">
                      {member.name}'s core competencies — click any card to
                      highlight it.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/projects")}
                    className="clickable w-fit px-6 py-3 rounded-full text-base font-bold
                      text-blue-200 border border-blue-400/40 bg-white/5
                      hover:bg-white/15 hover:border-blue-300 hover:text-white
                      backdrop-blur-sm transition-all"
                  >
                    🔗 View Projects →
                  </button>
                </div>

                {/* Skill category cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  {skillCategories.map((category, idx) => {
                    const active = activeSkill === idx;
                    const palette =
                      SKILL_CARD_GRADIENTS[idx % SKILL_CARD_GRADIENTS.length];
                    return (
                      <div
                        key={category.category}
                        onClick={() => setActiveSkill(active ? null : idx)}
                        className={`clickable relative rounded-3xl p-7 cursor-pointer border transition-all duration-300
                          ${
                            active
                              ? "bg-white/15 border-white/35 shadow-2xl scale-[1.02]"
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]"
                          }`}
                      >
                        {/* Header row */}
                        <div className="flex items-center gap-4 mb-7">
                          <span
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                            bg-gradient-to-br ${palette.grad} shadow-lg`}
                          >
                            {getTechnologyIcon(category.category)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-extrabold text-lg leading-tight">
                              {category.category}
                            </h4>
                            <p className="text-blue-300 text-sm">
                              {category.overall}% overall
                            </p>
                          </div>
                          {/* Circular progress */}
                          <svg
                            className="w-12 h-12 -rotate-90 flex-shrink-0"
                            viewBox="0 0 36 36"
                          >
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              fill="none"
                              stroke="rgba(255,255,255,0.1)"
                              strokeWidth="3"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="14"
                              fill="none"
                              stroke={`url(#cg-${idx})`}
                              strokeWidth="3"
                              strokeDasharray={`${(category.overall / 100) * 87.96} 87.96`}
                              strokeLinecap="round"
                            />
                            <defs>
                              <linearGradient id={`cg-${idx}`}>
                                <stop stopColor="#34d399" />
                                <stop offset="1" stopColor="#60a5fa" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        {/* Individual skill bars */}
                        <div className="space-y-4">
                          {category.skills.map((skill) => (
                            <div key={skill.name}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-base">
                                    {getTechnologyIcon(skill.name)}
                                  </span>
                                  <span className="text-sm sm:text-base text-gray-200 font-semibold">
                                    {skill.name}
                                  </span>
                                </div>
                                <span className="text-sm text-blue-300 font-bold">
                                  {skill.percent}%
                                </span>
                              </div>
                              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-2.5 rounded-full ${palette.bar} transition-all duration-700`}
                                  style={{ width: `${skill.percent}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Active dot */}
                        {active && (
                          <div
                            className="absolute top-5 right-5 w-3 h-3 rounded-full bg-green-400"
                            style={{
                              boxShadow: "0 0 10px 3px rgba(52,211,153,0.7)",
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ════════ FOOTER ════════ */}
        <footer className="text-sm text-center text-slate-400 border-t border-slate-200 py-7 bg-white">
          © {new Date().getFullYear()} NPC Innovation Hub · All rights reserved
          🚀
        </footer>
      </div>
    </>
  );
};
