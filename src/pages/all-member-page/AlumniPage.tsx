import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlumni } from "../../api/member/alumni.api";
import type { AlumniSummary } from "../../api/member/alumni.api";

export const AlumniPage: React.FC = () => {
  const [alumni, setAlumni] = useState<AlumniSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAlumni();
        setAlumni(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load alumni.");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      {/* Hero */}
      <div className="bg-[#002b56] text-white text-center px-4 py-16">
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
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Alumni</h1>
        <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
          Celebrating the members who've moved on from NPC Innovation Hub to
          continue building great things.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-base">{error}</p>
          </div>
        ) : alumni.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              No alumni yet
            </h2>
            <p className="text-slate-500 text-base max-w-sm mx-auto">
              This page will feature past members once they've moved on from the
              hub.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {alumni.map((person, idx) => (
              <div
                key={`${person.name}-${idx}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-full h-40 bg-slate-100 overflow-hidden">
                  {person.imageUrl ? (
                    <img
                      src={person.imageUrl}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-2xl font-bold">
                      {person.name
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
                    {person.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{person.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
