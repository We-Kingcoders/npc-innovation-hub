import React, { useState } from "react";
import { MemberCard } from "../../components/membercard/MemberCard";
import { members } from "../../data/members";

const PAGE_SIZE = 6;

export const InnovationHubMembersPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const paginatedMembers = members.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const pageCount = Math.ceil(members.length / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0a3665] h-40 sm:h-52 md:h-64 relative mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-semibold text-center absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-10 px-2 sm:px-0 w-full">
          NPC Innovation hub members
        </h2>
        <p className="text-gray-300 text-center text-xs sm:text-sm md:text-base absolute top-16 sm:top-20 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-4/5 md:w-2/3 z-10 px-2">
          We are a team of dedicated full-stack developers collaborating at the
          NPC Innovation Hub. Together, we build innovative, scalable, and
          user-centered software solutions that make a real-world impact.
        </p>
      </div>

      <div className="w-full max-w-6xl mx-auto px-1 sm:px-2 -mt-12 sm:-mt-24 relative z-20">
        <div className="bg-white rounded-md shadow-lg p-4 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-16 sm:gap-y-24 md:gap-y-32 gap-x-4 sm:gap-x-6 md:gap-x-8 pb-16 sm:pb-24">
            {paginatedMembers.map((member) => (
              <MemberCard
                key={member.id}
                id={member.id}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
              />
            ))}
          </div>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-center  mt-6 sm:mt-8 gap-2 sm:gap-0">
          <div className="flex gap-2 items-center flex-wrap">
            {[...Array(pageCount)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded ${
                  page === i + 1
                    ? "bg-[#0a3665] text-white"
                    : "bg-gray-200 text-gray-700"
                } transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
