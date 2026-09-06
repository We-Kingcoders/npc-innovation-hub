// src/pages/landing/AlumniSection.tsx
import React from "react";
import { useAlumni } from "../../hooks/useAlumni";

const AlumniSection: React.FC = () => {
  const { alumni, loading, error } = useAlumni();

  // No alumni yet (or the fetch failed) is a normal state for an optional
  // homepage section, not something to show an error/empty card for —
  // render nothing, matching HubIntroVideo's pattern.
  if (!loading && (error || alumni.length === 0)) return null;

  return (
    <section className="py-16 px-4 md:px-8 bg-[#f4f7fc]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002b56] mb-4">
            Our Alumni
          </h2>
          <p className="text-lg text-[#002b56]/80 max-w-2xl mx-auto">
            Celebrating the members who've moved on from NPC Innovation Hub to
            continue building great things.
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
    </section>
  );
};

export default AlumniSection;
