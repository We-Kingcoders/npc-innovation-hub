// src/hooks/useHubStats.ts
//
// Backs the About section's "X+ Years / X+ Projects / X+ Members" stat
// badges. The previous About section (Expertise/Skills/landing-Mission,
// removed in fix/home-about-section-real-content) showed fabricated
// numbers hardcoded as literals ("260k+ graduates", a duplicated "22k job
// placements" stat) - to avoid repeating that, every stat here is either
// computed from a real, confirmed fact (the Hub's founding year) or
// fetched live from the same APIs the Members/Projects sections already
// use, so it can never drift out of date the way a hardcoded number would.
import { useEffect, useState } from "react";
import { getAllProjects } from "../api/member/project.api";
import { getPublicMembers } from "../api/member/member.api";

// Confirmed with the Hub: established 2024 at the National Police College.
const HUB_FOUNDED_YEAR = 2024;

export interface HubStats {
  yearsStrong: number;
  projectsBuilt: number | null;
  communityMembers: number | null;
  loading: boolean;
}

export function useHubStats(): HubStats {
  const [projectsBuilt, setProjectsBuilt] = useState<number | null>(null);
  const [communityMembers, setCommunityMembers] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // Independent stats, fetched in parallel - one failing (or the member
    // endpoint requiring auth in some environment) shouldn't blank out the
    // other. Only page 1/limit 1 of members is needed since all that's
    // used is the response's totalMembers count, not the member list.
    Promise.allSettled([getAllProjects(), getPublicMembers(1, 1)])
      .then(([projectsResult, membersResult]) => {
        if (cancelled) return;
        if (projectsResult.status === "fulfilled") {
          setProjectsBuilt(projectsResult.value.totalItems);
        }
        if (membersResult.status === "fulfilled") {
          setCommunityMembers(membersResult.value.totalMembers);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Computed, not hardcoded, so this stays accurate as the site ages
  // instead of needing a manual edit every year.
  const yearsStrong = Math.max(1, new Date().getFullYear() - HUB_FOUNDED_YEAR);

  return { yearsStrong, projectsBuilt, communityMembers, loading };
}
