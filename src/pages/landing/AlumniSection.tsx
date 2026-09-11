// src/pages/landing/AlumniSection.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAlumni } from "../../hooks/useAlumni";

// getAlumni() returns the full list with no pagination - unlike Members
// and Projects, this section used to render every alumnus directly on
// Home with no cap and no "View all" page to send the rest to. Capped
// here to match the same short-preview-plus-deep-page pattern the rest
// of the site uses (see HubMembersSection.tsx / ProjectsShowcase.tsx),
// with the full list living at /alumni.
const PREVIEW_COUNT = 8;

const AlumniSection: React.FC = () => {
  const { alumni, loading, error } = useAlumni();
  const navigate = useNavigate();

  // No alumni yet (or the fetch failed) is a normal state for an optional
  // homepage section, not something to show an error/empty card for —
  // render nothing, matching HubIntroVideo's pattern.
  if (!loading && (error || alumni.length === 0)) return null;

  const preview = alumni.slice(0, PREVIEW_COUNT);

  return (
    <section className="py-16 px-4 md:px-8 bg-[#f4f7fc]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002b56] mb-4">
            Our Alumni
          </h2>
          {/* whitespace-nowrap here forced this full sentence onto one
              line regardless of container width - confirmed via a real
              320px-viewport render (not just reading the CSS) to overflow
              the page by ~150px. Wraps normally now. */}
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#002b56]/80">
            Members who&apos;ve moved from NPC Innovation Hub to continue
            building great things.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {preview.map((person, idx) => {
              if (!person) return null;
              const name = person.name || "Unknown";

              return (
                <div
                  key={`${name}-${idx}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-full h-40 bg-slate-100 overflow-hidden">
                    {person.imageUrl ? (
                      <img
                        src={person.imageUrl}
                        alt={name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                        {name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-[#002b56] text-base leading-tight">
                      {name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {person.role ?? "—"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && alumni.length > PREVIEW_COUNT && (
          <div className="flex justify-center mt-12">
            <button
              className="text-lg py-3 px-10 border-2 border-[#002b56] text-[#002b56] rounded-full shadow-sm hover:bg-[#e6f0ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#002b56] focus:ring-opacity-50"
              onClick={() => navigate("/alumni")}
            >
              View All Alumni
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AlumniSection;
