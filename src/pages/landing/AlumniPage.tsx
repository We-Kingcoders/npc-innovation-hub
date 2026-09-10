// src/pages/landing/AlumniPage.tsx
//
// The full alumni directory - Home's AlumniSection shows a short preview
// with a "View All Alumni" CTA that lands here, same preview-plus-deep-page
// pattern as Members (/members) and Projects (/projects).
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useAlumni } from "../../hooks/useAlumni";

const AlumniPage = () => {
  const { alumni, loading, error } = useAlumni();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      {/* Hero banner - navy, matching the site's brand color everywhere else. */}
      <div className="bg-[#002B56] py-16 px-4 md:px-8 text-center">
        <GraduationCap
          className="w-10 h-10 text-white mx-auto mb-4"
          aria-hidden="true"
        />
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Our Alumni
        </h1>
        <p className="text-white/70 text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap">
          Members who&apos;ve moved from NPC Innovation Hub to continue building
          great things.
        </p>
      </div>

      <div className="container mx-auto max-w-6xl px-4 md:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#002B56] font-semibold mb-8 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : error || alumni.length === 0 ? (
          <p className="text-center text-lg text-[#002b56]/70 py-16">
            {error ?? "No alumni to show yet — check back soon."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {alumni.map((person, idx) => {
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
      </div>
    </div>
  );
};

export default AlumniPage;
