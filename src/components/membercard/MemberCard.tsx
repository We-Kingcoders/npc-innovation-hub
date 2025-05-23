import React from "react";
import { Link } from "react-router-dom";

type MemberCardProps = {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
};

export const MemberCard: React.FC<MemberCardProps> = ({
  id,
  name,
  role,
  imageUrl,
}) => (
  <div className="relative flex flex-col items-center">
    <Link to={`/members/${id}`} className="w-full group">
      <img
        src={imageUrl}
        alt={name}
        className="w-full aspect-square object-cover rounded-t-md rounded-b-none"
      />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-11/12 bg-white border border-gray-200 shadow p-4 flex flex-col items-center">
        <h3 className="font-semibold text-lg text-center">{name}</h3>
        <p className="text-sm italic text-gray-600 text-center mt-1">{role}</p>
        <span className="mt-4 bg-[#0a3665] group-hover:bg-blue-900 text-gray-100 text-sm px-5 py-2 rounded-full flex items-center transition">
          View more
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </span>
      </div>
    </Link>
  </div>
);
