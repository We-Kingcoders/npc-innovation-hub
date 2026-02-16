import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberCard } from "../../components/membercard/MemberCard";

const PAGE_SIZE = 6;

interface Member {
  id: string;
  userId: string;
  name: string;
  role: string;
  imageUrl?: string;
  techStack?: string[];
  tagline?: string;
  available?: boolean;
}

/* ── Page-level styles injected once into <head> ──────────────────── */
const PAGE_STYLE_ID = "ihp-styles";
const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

/* Hero */
.ihp-hero {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 56px 24px 80px;
  background: #0a3665;
  background-image:
    radial-gradient(ellipse 80% 60% at 20% 50%, rgba(26,111,196,0.25) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(26,111,196,0.15) 0%, transparent 60%);
}
.ihp-hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}

/* ── Back button ───────────────────────────────────────────────────── */
.ihp-back-row {
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0 28px 0;
  max-width: 1160px;
  margin: 0 auto;
}
.ihp-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px 9px 10px;
  border-radius: 999px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  color: rgba(255,255,255,0.88);
  background: rgba(255,255,255,0.08);
  border: 1.5px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
  text-decoration: none;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.ihp-back-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #06b6d4 100%);
  border-color: transparent;
  color: #ffffff;
  transform: translateX(-3px) scale(1.04);
  box-shadow: 0 6px 28px rgba(99,102,241,0.55), 0 2px 8px rgba(6,182,212,0.3);
}
.ihp-back-btn:active {
  transform: translateX(-1px) scale(0.98);
}
.ihp-back-icon {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.35) 0%, rgba(6,182,212,0.25) 100%);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.28s ease;
}
.ihp-back-btn:hover .ihp-back-icon {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.35);
  transform: rotate(-5deg) scale(1.1);
}
.ihp-back-icon svg {
  width: 14px; height: 14px;
  stroke: rgba(255,255,255,0.9);
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.2s;
}
.ihp-back-btn:hover .ihp-back-icon svg {
  stroke: #ffffff;
}

/* Badge */
.ihp-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #f0a500;
  background: rgba(240,165,0,0.12);
  border: 1px solid rgba(240,165,0,0.25);
  padding: 5px 14px;
  border-radius: 20px;
  margin-bottom: 18px;
}
.ihp-badge-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #f0a500;
  animation: ihp-pulse 2s ease-in-out infinite;
}
@keyframes ihp-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.7);} }

.ihp-h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0 0 14px;
}
.ihp-h1 span { color: #f0a500; }
.ihp-subtitle {
  font-family: 'DM Sans', sans-serif;
  font-size: clamp(0.85rem, 1.8vw, 0.98rem);
  color: rgba(255,255,255,0.6);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.65;
}

/* Wrapper */
.ihp-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 20px 60px;
  position: relative;
  z-index: 10;
}

/* Stats bar */
.ihp-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #dde6f0;
  border-radius: 14px;
  padding: 16px 24px;
  margin: -36px 0 32px;
  box-shadow: 0 2px 12px rgba(10,54,101,0.08);
}
.ihp-stats-left { display: flex; align-items: center; gap: 20px; }
.ihp-stat { display: flex; flex-direction: column; gap: 2px; }
.ihp-stat-num {
  font-family: 'Syne', sans-serif;
  font-size: 1.3rem; font-weight: 700; color: #0a3665; line-height: 1;
}
.ihp-stat-label {
  font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase; color: #8498b4;
}
.ihp-stat-div { width: 1px; height: 32px; background: #dde6f0; }
.ihp-stats-right { font-size: 0.8rem; color: #8498b4; font-family: 'DM Sans', sans-serif; }
.ihp-stats-right strong { color: #0a3665; }

/* Grid */
.ihp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) { .ihp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) {
  .ihp-grid { grid-template-columns: 1fr; gap: 16px; }
  .ihp-stats { margin: -28px 0 24px; padding: 14px 16px; }
  .ihp-back-row { padding-bottom: 20px; }
  .ihp-back-btn { font-size: 0.84rem; padding: 8px 16px 8px 8px; }
}

/* Skeleton */
.ihp-skeleton {
  background: #ffffff;
  border: 1px solid #dde6f0;
  border-radius: 18px;
  height: 300px;
  overflow: hidden;
  position: relative;
}
.ihp-skeleton::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(232,241,251,0.6) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: ihp-shimmer 1.4s ease-in-out infinite;
}
@keyframes ihp-shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }

/* Pagination */
.ihp-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
  flex-wrap: wrap;
}
.ihp-page-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 9px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem; font-weight: 600;
  border: 1.5px solid #dde6f0;
  background: #ffffff;
  color: #4a5e78;
  cursor: pointer;
  transition: all 0.18s ease;
}
.ihp-page-btn:hover:not(:disabled) { border-color: #1a6fc4; color: #1a6fc4; }
.ihp-page-btn.active { background: #0a3665; border-color: #0a3665; color: #ffffff; box-shadow: 0 2px 8px rgba(10,54,101,0.3); }
.ihp-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
`;

function injectPageStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(PAGE_STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = PAGE_STYLE_ID;
  el.textContent = PAGE_CSS;
  document.head.appendChild(el);
}

export const InnovationHubMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    injectPageStyles();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/members?page=${page}&limit=${PAGE_SIZE}`,
        );
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        if (Array.isArray(data.data?.members)) {
          setMembers(data.data.members);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [page]);

  const openCount = members.filter((m) => m.available === true).length;
  const totalMembers = members.length > 0 ? members.length * totalPages : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f7fc" }}>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="ihp-hero">
        {/* Back button — top-left inside hero */}
        <div className="ihp-back-row">
          <button className="ihp-back-btn" onClick={() => navigate(-1)}>
            <span className="ihp-back-icon">
              <svg viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </span>
            Go Back
          </button>
        </div>

        <div className="ihp-badge">
          <span className="ihp-badge-dot" />
          Innovation Hub
        </div>
        <h1 className="ihp-h1">
          Meet the <span>Developers</span>
        </h1>
        <p className="ihp-subtitle">
          A team of dedicated engineers at the NPC Innovation Hub building
          scalable, user-centered software that makes a real-world impact.
        </p>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="ihp-wrap">
        {/* Stats bar */}
        <div className="ihp-stats">
          <div className="ihp-stats-left">
            <div className="ihp-stat">
              <span className="ihp-stat-num">{totalMembers || "—"}</span>
              <span className="ihp-stat-label">Members</span>
            </div>
            <div className="ihp-stat-div" />
            <div className="ihp-stat">
              <span className="ihp-stat-num">{loading ? "—" : openCount}</span>
              <span className="ihp-stat-label">Open to collab</span>
            </div>
            <div className="ihp-stat-div" />
            <div className="ihp-stat">
              <span className="ihp-stat-num">{totalPages}</span>
              <span className="ihp-stat-label">Pages</span>
            </div>
          </div>
          <div className="ihp-stats-right">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="ihp-grid">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <div key={i} className="ihp-skeleton" />
            ))}
          </div>
        ) : error ? (
          <p
            style={{ textAlign: "center", color: "#ef4444", padding: "80px 0" }}
          >
            {error}
          </p>
        ) : (
          <div className="ihp-grid">
            {members.map((member, i) => (
              <div key={member.id} style={{ animationDelay: `${i * 0.06}s` }}>
                <MemberCard
                  id={member.id}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                  techStack={member.techStack ?? []}
                  tagline={member.tagline ?? ""}
                  available={member.available}
                  onViewProfile={(id: string) => {
                    navigate(`/members/${id}`);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="ihp-pagination">
            <button
              className="ihp-page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`ihp-page-btn${page === i + 1 ? " active" : ""}`}
                onClick={() => setPage(i + 1)}
                aria-label={`Page ${i + 1}`}
                aria-current={page === i + 1 ? "page" : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="ihp-page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
