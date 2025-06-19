import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { members } from "../../data/members";
import { getTechnologyIcon } from "../../data/iconUtils";

export const MemberDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const member = members.find((m) => m.id === id);
  const navigate = useNavigate();

  if (!member) {
    return <div className="text-center text-lg mt-32">Member not found.</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* profile section */}
      <section className="w-full max-w-[1000px] mx-auto mt-10 px-2 sm:px-4">
        <div className="flex flex-col md:flex-row items-start justify-start bg-white shadow-md overflow-hidden">
          <img
            src={member.imageUrl}
            alt={member.name}
            className="md:w-1/3 w-full object-cover h-56 md:h-auto shadow self-stretch"
          />
          <div className="flex flex-col justify-start md:ml-28 ml-0 p-6 md:p-8 md:w-1/2 w-full text-blue-950">
            <h1 className="text-3xl font-semibold">{member.name}</h1>
            <p className="text-sm font-bold mt-3 uppercase italic">
              {member.role}
            </p>
            <p className="mt-8 text-gray-700">{member.bio}</p>
            <a
              href="#"
              className="block mt-10 md:mt-20 text-blue-700 text-sm underline font-medium"
            >
              Learn how to become a member
            </a>
          </div>
        </div>
      </section>

      {/* Education Background */}
      <section className="w-full max-w-[1000px] mx-auto mt-12 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl text-blue-950 font-semibold text-center mb-4 sm:mb-6">
          Education background
        </h2>
        <p className="text-center text-gray-700 text-sm sm:text-base">
          "Education is the most powerful weapon which you can use to change the
          world." – <em>Nelson Mandela</em>
        </p>
        <div className="flex flex-col md:flex-row mt-6 sm:mt-8 bg-blue-950 rounded-md shadow-lg overflow-hidden min-h-[350px] sm:min-h-[400px]">
          <img
            src={member.education.imageUrl}
            alt={member.education.institution}
            className="md:w-1/3 w-full object-cover h-48 sm:h-60 md:h-auto"
          />
          <div className="flex flex-col justify-start md:ml-28 ml-0 p-6 md:p-8 md:w-1/2 w-full text-gray-100 text-left">
            <h3 className="text-xl sm:text-3xl text-gray-200 font-bold mb-2">
              {member.education.degree}
            </h3>
            <p className="mb-2 italic">{member.education.institution}</p>
            <p className="mt-6 sm:mt-8 text-gray-300">
              {member.education.description}
            </p>
            <button className="bg-transparent border border-white border-opacity-30 text-white mt-10 sm:mt-20 py-2 px-6 rounded-full text-sm self-center hover:bg-white hover:bg-opacity-10 transition">
              View more
            </button>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="w-full max-w-3xl mx-auto mt-10 sm:mt-12 px-2 sm:px-4 text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4">
          <hr className="border-t border-gray-300 w-20 sm:w-40" />
          <p className="text-blue-900 italic whitespace-nowrap text-xs sm:text-base">
            Member's contacts
          </p>
          <hr className="border-t border-gray-300 w-20 sm:w-40" />
        </div>
        <p className="text-gray-600 text-xs sm:text-sm mt-2 mb-6">
          Connect with the member below for collaboration or inquiries—just a
          click away.
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center mt-4">
          <a
            href={member.contacts.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-blue-500 hover:bg-blue-50 transition text-xs sm:text-base"
          >
            {/* LinkedIn SVG */}
            <svg
              className="w-6 sm:w-8 h-4 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.2c-1 0-1.7-.7-1.7-1.6 0-.9.7-1.6 1.7-1.6s1.7.7 1.7 1.6c0 .9-.7 1.6-1.7 1.6zm15.5 10.2h-3v-4.8c0-1.2-.4-2-1.5-2-1.1 0-1.7.7-1.7 2v4.8h-3v-9h3v1.2c.4-.6 1.2-1.5 2.9-1.5 2.1 0 3.2 1.4 3.2 4.1v5.2z" />
            </svg>
            LinkedIn
          </a>
          <a
            href={member.contacts.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-blue-500 hover:bg-gray-100 transition text-xs sm:text-base"
          >
            {/* Github SVG */}
            <svg
              className="w-6 sm:w-8 h-4 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.6 0-12 5.4-12 12 0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.3 1.2 2.9.9.1-.6.4-1.2.7-1.5-2.7-.3-5.5-1.4-5.5-6.1 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.5 1.2.9-.3 1.8-.5 2.8-.5.9 0 1.9.2 2.8.5 2.5-1.5 3.5-1.2 3.5-1.2.6 1.7.3 3 .1 3.3.8.9 1.2 2 1.2 3.4 0 4.8-2.8 5.7-5.5 6.1.4.3.8 1 .8 2v3c0 .4.2.7.8.6 4.8-1.6 8.2-6.1 8.2-11.4 0-6.6-5.4-12-12-12z" />
            </svg>
            Github
          </a>
          <a
            href={member.contacts.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-blue-400 hover:bg-blue-50 transition text-xs sm:text-base"
          >
            {/* Twitter SVG */}
            <svg
              className="w-6 sm:w-8 h-4 sm:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M24 4.6c-.9.4-1.8.6-2.8.8 1-.6 1.7-1.5 2.1-2.6-.9.6-1.9 1-3 1.2-.8-.9-2-1.5-3.3-1.5-2.5 0-4.5 2-4.5 4.5 0 .3 0 .7.1 1-3.7-.2-7-2-9.1-4.7-.4.7-.7 1.5-.7 2.3 0 1.6.8 3 2.1 3.9-.7 0-1.4-.2-2-.5v.1c0 2.3 1.6 4.2 3.9 4.7-.4.1-.8.2-1.3.2-.3 0-.6 0-.9-.1.6 1.8 2.3 3.1 4.3 3.1-1.6 1.3-3.5 2-5.6 2-.4 0-.8 0-1.2-.1 2 1.3 4.4 2 7 2 8.4 0 13-7 13-13 0-.2 0-.4 0-.6.9-.6 1.6-1.5 2.2-2.4z" />
            </svg>
            Twitter
          </a>
          <a
            href={member.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-blue-500 hover:bg-blue-50 transition text-xs sm:text-base"
          >
            {/* Telegram SVG */}
            <svg
              className="w-6 sm:w-8 h-4 sm:h-6"
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="120" cy="120" r="120" fill="#37AEE2" />
              <circle cx="120" cy="120" r="120" fill="url(#paint0_linear)" />
              <path
                d="M174.9 75.5l-23.2 109c-1.8 7.9-6.5 9.8-13.1 6.1l-36.3-26.8-17.5 16.8c-1.9 1.9-3.5 3.5-7.1 3.5l2.5-35.1 63.9-57.8c2.8-2.5-0.6-3.9-4.3-1.4l-79 49.6-34-10.6c-7.4-2.3-7.6-7.4 1.6-11l133.1-51.3c6.2-2.3 11.6 1.4 9.6 11.2z"
                fill="#fff"
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1="120"
                  y1="0"
                  x2="120"
                  y2="240"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2AABEE" />
                  <stop offset="1" stopColor="#229ED9" />
                </linearGradient>
              </defs>
            </svg>
            Telegram
          </a>
        </div>
      </section>

      {/* Skills */}
      <section className="w-full bg-blue-950 py-10 sm:py-12 mt-10 sm:mt-16">
        <section className="w-full max-w-[1000px] mx-auto px-2 sm:px-4">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-10 md:h-[36rem]">
            {/* Left Card Wrapper with center alignment */}
            <div className="md:w-[40%] w-full flex items-center justify-center mb-6 md:mb-0">
              <div className="w-full max-w-[22rem] h-[22rem] sm:h-[28rem] bg-gray-300 bg-opacity-20 p-6 sm:p-8 text-gray-200 shadow flex flex-col justify-between">
                <h3 className="text-xl sm:text-2xl mt-4 sm:mt-6 ml-4 sm:ml-8">
                  Skills
                </h3>
                <p className="text-gray-200 mb-4 sm:mb-6 ml-4 sm:ml-8 text-xs sm:text-base">
                  {member.name} excels in the following skills, which are
                  essential to their role and contributions.
                </p>
                <button
                  className="bg-transparent border border-gray-200 border-opacity-30 text-gray-200 mt-6 sm:mt-20 py-2 sm:py-3 px-6 sm:px-8 rounded-full text-xs sm:text-sm self-start md:self-center hover:bg-white hover:bg-opacity-10 transition"
                  onClick={() => navigate("/projects")}
                >
                  View more
                </button>
              </div>
            </div>
            {/* Right Skills Grid, also vertically centered */}
            <div className="md:w-2/3 w-full flex items-center">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {member.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-transparent border border-gray-400 border-opacity-30 rounded-md p-4 sm:p-6 text-white shadow flex flex-col"
                  >
                    <div className="flex flex-row items-center gap-2 mb-2 sm:mb-4">
                      <h4 className="text-lg sm:text-xl">{skill.name}</h4>
                    </div>
                    <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-4">
                      {skill.technologies.map((tech, techIdx) => (
                        <div
                          key={techIdx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {getTechnologyIcon(tech)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-200">
                              {tech}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 sm:w-20 bg-blue-900 h-2 rounded-full">
                              <div
                                className="bg-green-400 h-2 rounded-full"
                                style={{
                                  width: `${Math.max(70, skill.percent - techIdx * 5)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs italic text-gray-300 w-8">
                              {Math.max(70, skill.percent - techIdx * 5)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>

      <footer className="text-xs text-center text-gray-500 mt-12 sm:mt-16 border-t py-4">
        &copy; {new Date().getFullYear()} NPC Innovation Hub. All rights
        reserved.
      </footer>
    </div>
  );
};
