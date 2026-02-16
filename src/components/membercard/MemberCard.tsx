import React, { useEffect } from "react";

export interface MemberCardProps {
  id: string;
  name: string;
  role?: string;
  imageUrl?: string;
  techStack?: string[]; // max 4 tags
  tagline?: string;
  available?: boolean;
  onViewProfile?: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ── Static fallback data (replace with backend data when ready) ──────────────
const STATIC_ROLE = "Full-Stack Developer";
const STATIC_TAGLINE = "Building scalable solutions that make a real impact.";
const STATIC_TECH_STACK = ["React", "Node.js", "TypeScript", "PostgreSQL"];
// ─────────────────────────────────────────────────────────────────────────────

const MC_STYLE_ID = "mc-card-styles";

const MC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.mc-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 1px solid #dde6f0;
  border-radius: 20px;
  padding: 32px 24px 24px;
  box-shadow: 0 2px 16px rgba(10,54,101,0.08), 0 1px 4px rgba(10,54,101,0.05);
  transition: transform 0.28s cubic-bezier(.22,.68,0,1.2), box-shadow 0.28s ease;
  overflow: hidden;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  animation: mc-in 0.45s ease both;
  height: 100%;
}

/* Accent top bar — slides in on hover */
.mc-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #0a3665 0%, #1a6fc4 60%, #3d9fff 100%);
  opacity: 0;
  transition: opacity 0.25s ease;
}

/* Subtle inner glow on hover */
.mc-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(26,111,196,0.04) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.mc-card:hover {
  transform: translateY(-7px);
  box-shadow: 0 20px 48px rgba(10,54,101,0.16), 0 4px 16px rgba(10,54,101,0.08);
}
.mc-card:hover::before { opacity: 1; }
.mc-card:hover::after  { opacity: 1; }
.mc-card:hover .mc-tag { background: #d8e8f8; color: #0a3665; border-color: #b8d0ec; }
.mc-card:hover .mc-avatar-ring { box-shadow: 0 0 0 3px #1a6fc4, 0 6px 20px rgba(10,54,101,0.25); }

@keyframes mc-in {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Availability badge ─────────────────────────────────────────── */
.mc-avail {
  position: absolute; top: 16px; right: 16px;
  display: flex; align-items: center; gap: 5px;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 10px;
}
.mc-avail--open {
  color: #1d7a50;
  background: #e6f7ef;
  border: 1px solid #b2e4cc;
}
.mc-avail--busy {
  color: #7a8a9e;
  background: #f0f3f7;
  border: 1px solid #d8e0ea;
}
.mc-avail-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}
.mc-avail-dot--open { animation: mc-blink 2s ease-in-out infinite; }
@keyframes mc-blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }

/* ── Avatar ──────────────────────────────────────────────────────── */
.mc-avatar-wrap {
  width: 108px; height: 108px;
  margin-bottom: 16px;
  flex-shrink: 0;
}
.mc-avatar-ring {
  width: 108px; height: 108px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #0a3665 0%, #1a6fc4 100%);
  box-shadow: 0 0 0 3px #ffffff, 0 4px 18px rgba(10,54,101,0.22);
  transition: box-shadow 0.28s ease;
}
.mc-avatar-img,
.mc-avatar-ph {
  width: 100%; height: 100%;
  border-radius: 50%;
  border: 3px solid #ffffff;
  display: block;
}
.mc-avatar-img { object-fit: cover; }
.mc-avatar-ph {
  display: flex;
  align-items: center; justify-content: center;
  background: linear-gradient(145deg, #0a3665 0%, #1462a8 50%, #1a6fc4 100%);
  font-family: 'Syne', 'DM Sans', sans-serif;
  font-size: 1.75rem; font-weight: 800; color: #ffffff;
  letter-spacing: -0.02em;
}

/* ── Name ────────────────────────────────────────────────────────── */
.mc-name {
  font-family: 'Syne', 'DM Sans', sans-serif;
  font-size: 1.05rem; font-weight: 700; color: #0d1f35;
  letter-spacing: -0.02em; text-align: center; line-height: 1.25;
  margin: 0 0 8px;
}

/* ── Role pill ───────────────────────────────────────────────────── */
.mc-role {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: #1a6fc4; background: #e8f1fb;
  padding: 5px 13px; border-radius: 20px;
  border: 1px solid #c8ddf4;
  margin-bottom: 16px;
}
.mc-role-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #1a6fc4;
  flex-shrink: 0;
}

/* ── Divider ─────────────────────────────────────────────────────── */
.mc-divider {
  width: calc(100% + 48px);
  height: 1px;
  background: linear-gradient(90deg, transparent, #dde6f0 20%, #dde6f0 80%, transparent);
  margin: 0 -24px 16px;
}

/* ── Tech tags ───────────────────────────────────────────────────── */
.mc-stack {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 6px; list-style: none; padding: 0; margin: 0 0 14px;
}
.mc-tag {
  font-size: 0.66rem; font-weight: 600; letter-spacing: 0.03em;
  color: #3a5a80; background: #edf2fa; border: 1px solid #d0ddf0;
  padding: 4px 10px; border-radius: 7px; white-space: nowrap;
  transition: background 0.18s, color 0.18s, border-color 0.18s;
}

/* ── Tagline ─────────────────────────────────────────────────────── */
.mc-tagline {
  font-size: 0.77rem; font-style: italic; color: #8498b4;
  text-align: center; line-height: 1.55; padding: 0 6px;
  margin: 0 0 20px; flex: 1;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── CTA Button ──────────────────────────────────────────────────── */
.mc-btn {
  width: 100%;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 11px 0; border-radius: 11px;
  background: #0a3665; color: #ffffff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em;
  border: none; cursor: pointer;
  transition: background 0.22s, gap 0.22s, box-shadow 0.22s, transform 0.15s;
  margin-top: auto;
}
.mc-btn:hover {
  background: #1a6fc4;
  gap: 11px;
  box-shadow: 0 5px 16px rgba(26,111,196,0.38);
  transform: translateY(-1px);
}
.mc-btn:active { transform: translateY(0); }
.mc-btn:focus-visible { outline: 2px solid #1a6fc4; outline-offset: 3px; }
.mc-btn-arrow {
  width: 14px; height: 14px; flex-shrink: 0;
  transition: transform 0.22s;
}
.mc-btn:hover .mc-btn-arrow { transform: translateX(3px); }
`;

export const MemberCard: React.FC<MemberCardProps> = ({
  id,
  name,
  role,
  imageUrl,
  techStack,
  tagline,
  available,
  onViewProfile,
}) => {
  useEffect(() => {
    if (!document.getElementById(MC_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = MC_STYLE_ID;
      style.textContent = MC_CSS;
      document.head.appendChild(style);
    }
  }, []);

  // Use live data if available, otherwise fall back to static placeholder
  const displayRole = role || STATIC_ROLE;
  const displayTagline = tagline || STATIC_TAGLINE;
  const displayStack = (
    techStack && techStack.length > 0 ? techStack : STATIC_TECH_STACK
  ).slice(0, 4);
  const initials = getInitials(name);
  const showAvail = available !== undefined;

  return (
    <article className="mc-card" data-id={id}>
      {/* Availability badge */}
      {showAvail && (
        <span
          className={`mc-avail ${available ? "mc-avail--open" : "mc-avail--busy"}`}
        >
          <span
            className={`mc-avail-dot ${available ? "mc-avail-dot--open" : ""}`}
          />
          {available ? "Open" : "Busy"}
        </span>
      )}

      {/* ① Profile photo */}
      <div className="mc-avatar-wrap">
        <div className="mc-avatar-ring">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${name} photo`}
              className="mc-avatar-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const ph = e.currentTarget.nextElementSibling as HTMLElement;
                if (ph) ph.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="mc-avatar-ph"
            style={{ display: imageUrl ? "none" : "flex" }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* ② Full name */}
      <h3 className="mc-name">{name}</h3>

      {/* ③ Main role */}
      <span className="mc-role">
        <span className="mc-role-dot" />
        {displayRole}
      </span>

      <div className="mc-divider" />

      {/* ④ Tech stack tags */}
      <ul className="mc-stack" aria-label="Tech stack">
        {displayStack.map((tech) => (
          <li key={tech} className="mc-tag">
            {tech}
          </li>
        ))}
      </ul>

      {/* ⑤ Tagline */}
      <p className="mc-tagline">"{displayTagline}"</p>

      {/* ⑥ View Profile */}
      <button
        className="mc-btn"
        type="button"
        onClick={() => onViewProfile?.(id)}
        aria-label={`View ${name}'s profile`}
      >
        View Profile
        <svg
          className="mc-btn-arrow"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </article>
  );
};
