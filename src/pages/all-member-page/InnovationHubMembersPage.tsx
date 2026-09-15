import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberCard } from "../../components/membercard/MemberCard";
import { getPublicMembers } from "../../api/member/member.api";
import type { PublicMemberSummary } from "../../api/member/member.api";

const PAGE_SIZE = 6;

/* ── Page-level styles injected once into <head> ──────────────────── */
const PAGE_STYLE_ID = "ihp-styles";
const PAGE_CSS = `
/* No Google Fonts import here any more - Syne/DM Sans were a one-off
   pulled in just for this page, on top of the site's own default (Inter,
   set globally in index.css). Dropped in favour of that default so this
   page's type matches the rest of the site instead of standing apart. */

/* ── Palette ───────────────────────────────────────────────────────────
   Reuses the site's actual navy token (#002B56, matching
   tailwind.config.js's npc.navy.DEFAULT and the Footer/Navbar) - this
   page previously ran its own separate palette on top of that, adding
   gold/cyan/violet accents that appear nowhere else on the site. */
.ihp-root {
  --navy:      #002B56;
  --page-bg:   #f4f7fc;
  min-height: 100vh;
  background: var(--page-bg);
}

/* Wrapper */
.ihp-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 8px 20px 60px;
  position: relative;
  z-index: 10;
}

/* Grid */
.ihp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
@media (max-width: 900px) { .ihp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) {
  .ihp-grid { grid-template-columns: 1fr; gap: 16px; }
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
  font-size: 0.82rem; font-weight: 600;
  border: 1.5px solid #dde6f0;
  background: #ffffff;
  color: #4a5e78;
  cursor: pointer;
  transition: all 0.18s ease;
}
.ihp-page-btn:hover:not(:disabled) { border-color: var(--navy); color: var(--navy); }
.ihp-page-btn.active {
  background: var(--navy);
  border-color: transparent;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0,43,86,0.42);
}
.ihp-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* Respect users who prefer less motion */
@media (prefers-reduced-motion: reduce) {
  .ihp-skeleton::after {
    animation: none !important;
  }
}
`;

function injectPageStyles() {
  if (typeof document === "undefined") return;
  // Update in place rather than bailing out, so an edit to PAGE_CSS is picked
  // up on hot-reload instead of leaving the previous <style> tag in the head.
  const existing = document.getElementById(PAGE_STYLE_ID);
  if (existing) {
    if (existing.textContent !== PAGE_CSS) existing.textContent = PAGE_CSS;
    return;
  }
  const el = document.createElement("style");
  el.id = PAGE_STYLE_ID;
  el.textContent = PAGE_CSS;
  document.head.appendChild(el);
}

export const InnovationHubMembersPage: React.FC = () => {
  const [members, setMembers] = useState<PublicMemberSummary[]>([]);
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
        setError(null);
        const result = await getPublicMembers(page, PAGE_SIZE);
        setMembers(result.members);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error("Failed to fetch public members:", err);
        const apiErr = err as { statusCode?: number; message?: string };
        setError(apiErr.message ?? "Failed to load members.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, [page]);

  return (
    <div className="ihp-root">
      {/* Plain centered title, no decorative hero banner - matches the
          Header component HubMembersSection.tsx (the homepage's own
          members teaser) already uses: navy text directly on the page
          background, not a separate navy panel with a badge and a "Go
          Back" button. Clicking "View All Members" on the homepage
          should land straight on the cards, not another whole banner
          moment first. */}
      <div className="pt-12 pb-6 px-5 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#002B56] mb-4">
          Meet the Developers
        </h1>
        <p className="text-lg md:text-xl font-medium text-[#002B56]/80 max-w-2xl mx-auto">
          A team of dedicated engineers at the NPC Innovation Hub building
          scalable, user-centered software that makes a real-world impact.
        </p>
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="ihp-wrap">
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
                  id={member.userId}
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
