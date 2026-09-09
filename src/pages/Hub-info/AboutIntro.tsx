// src/pages/Hub-info/AboutIntro.tsx
//
// The "Who We Are" opening of the About section - narrative + stat badges +
// a CTA into the projects the Hub has actually shipped. Used both on Home's
// compact "about" preview and on the full /Hub-information page, same
// reuse pattern as MissionSection.
import { useNavigate } from "react-router-dom";
import { useHubStats } from "../../hooks/useHubStats";

interface StatBadgeProps {
  value: number | null;
  loading: boolean;
  label: string;
}

const StatBadge = ({ value, loading, label }: StatBadgeProps) => {
  // Loading or failed-to-load both render nothing rather than a
  // misleading "0+" or "null+" - a stat that can't be confirmed live
  // is omitted, not guessed.
  if (!loading && value === null) return null;

  return (
    <div className="text-center px-6 py-4">
      <div className="text-3xl md:text-4xl font-bold text-[#002b56]">
        {loading ? (
          <span className="inline-block w-12 h-8 bg-[#002b56]/10 rounded animate-pulse" />
        ) : (
          `${value}+`
        )}
      </div>
      <div className="text-sm md:text-base text-[#002b56]/70 mt-1">{label}</div>
    </div>
  );
};

const AboutIntro = () => {
  const navigate = useNavigate();
  const { yearsStrong, projectsBuilt, communityMembers, loading } =
    useHubStats();

  return (
    <div className="max-w-5xl mx-auto">
      <p className="text-sm font-bold uppercase tracking-wider text-[#00A0E3] mb-3 text-center md:text-left">
        Who We Are
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-[#002b56] mb-2 text-center md:text-left">
        National Police College&apos;s Innovation &amp; Technology Hub
      </h2>

      <div className="text-[#283D4B] space-y-4 mt-6 max-w-3xl mx-auto md:mx-0 text-center md:text-left">
        <p>
          Since our establishment in 2024, NPC Innovation Hub has been at the
          forefront of technology-driven learning at the National Police
          College. We are more than just a workspace — we are a catalyst for
          innovation, a platform for serving and strengthening our institution,
          and a home for the College&apos;s brightest tech minds.
        </p>
        <p>
          Located within the National Police College, we provide a dynamic
          ecosystem where developers, designers, and innovators converge to
          collaborate, learn, and build solutions that serve our institution.
        </p>
      </div>

      <div className="flex justify-center md:justify-start mt-8">
        <button
          className="rounded-full border-2 border-[#00A0E3] text-[#00A0E3] px-10 py-3 font-semibold hover:bg-[#00A0E3] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#00A0E3] focus:ring-offset-2"
          onClick={() => navigate("/projects")}
        >
          Explore Our Journey
        </button>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start divide-x divide-[#002b56]/10 mt-12 -mx-6">
        <StatBadge value={yearsStrong} loading={false} label="Years Strong" />
        <StatBadge
          value={projectsBuilt}
          loading={loading}
          label="Projects Built"
        />
        <StatBadge
          value={communityMembers}
          loading={loading}
          label="Community Members"
        />
      </div>
    </div>
  );
};

export default AboutIntro;
