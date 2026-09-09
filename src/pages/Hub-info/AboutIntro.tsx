// src/pages/Hub-info/AboutIntro.tsx
//
// The "Who We Are" opening of the About section - narrative + stat badges.
// No "explore further" CTA: the rest of the About content (Mission/Vision/
// Goals, Strategic Objectives, Core Values, Why NPC Innovation Hub) renders
// directly below this on both Home and /Hub-information, nothing is gated
// behind a click. Used on both, same reuse pattern as MissionSection.
import type { ElementType } from "react";
import { CalendarClock, FolderGit2, Users } from "lucide-react";
import { useHubStats } from "../../hooks/useHubStats";

interface StatBadgeProps {
  icon: ElementType;
  value: number | null;
  loading: boolean;
  label: string;
}

const StatBadge = ({ icon: Icon, value, loading, label }: StatBadgeProps) => {
  // Loading or failed-to-load both render nothing rather than a
  // misleading "0+" or "null+" - a stat that can't be confirmed live
  // is omitted, not guessed.
  if (!loading && value === null) return null;

  return (
    <div className="flex items-center gap-3 px-6 py-4">
      <Icon
        className="w-8 h-8 text-[#00A0E3] flex-shrink-0"
        aria-hidden="true"
      />
      <div>
        <div className="text-2xl md:text-3xl font-bold text-[#002b56] leading-none">
          {loading ? (
            <span className="inline-block w-12 h-7 bg-[#002b56]/10 rounded animate-pulse" />
          ) : (
            `${value}+`
          )}
        </div>
        <div className="text-sm text-[#002b56]/70 mt-1">{label}</div>
      </div>
    </div>
  );
};

const AboutIntro = () => {
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
          College. We are more than just a workspace, we are a catalyst for
          innovation, a platform for serving and strengthening our institution,
          and a home for the College&apos;s brightest tech minds.
        </p>
        <p>
          Located within the National Police College, we provide a dynamic
          ecosystem where developers, designers, and innovators converge to
          collaborate, learn, and build solutions that serve our institution.
        </p>
      </div>

      <div className="flex flex-wrap justify-center md:justify-start divide-x divide-[#002b56]/10 mt-10 -mx-6">
        <StatBadge
          icon={CalendarClock}
          value={yearsStrong}
          loading={false}
          label="Years Strong"
        />
        <StatBadge
          icon={FolderGit2}
          value={projectsBuilt}
          loading={loading}
          label="Projects Built"
        />
        <StatBadge
          icon={Users}
          value={communityMembers}
          loading={loading}
          label="Community Members"
        />
      </div>
    </div>
  );
};

export default AboutIntro;
