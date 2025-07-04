import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

const notifications = [
  "Uploaded new project",
  "Updated E-commerce",
  "A member messaged you",
  "Uploaded new project",
  "Updated E-commerce",
  "A member messaged you",
];

const projects = [
  "Bus management system",
  "E-commerce",
  "Online booking",
  "E-learning platform",
  "Pay as you go",
  "e-Ticket",
];

const messages = [
  { name: "Sam Rwanda", text: "Hello, are you there?" },
  { name: "ALAN", text: "Hello, are you there?" },
  { name: "Peace", text: "Hello, are you there?" },
];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // ✅ Set up navigation

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center col-span-1">
          <div className="w-28 h-28 bg-[#0C2340] rounded-full mb-4" />
          <div className="text-xl font-semibold">Sam Rwanda</div>
          <div className="text-gray-500 mb-4">Full Stack Developer</div>
          <div className="flex gap-2 mb-3">
            <button className="bg-[#9B5CFF] text-white px-4 py-2 rounded-lg">
              Edit profile
            </button>
            <button className="bg-[#9B5CFF] text-white px-4 py-2 rounded-lg">
              Add resource
            </button>
          </div>
          <button className="self-end">
            <svg
              width={28}
              height={28}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx={14} cy={14} r={12} />
              <circle cx={14} cy={14} r={2} />
              <circle cx={19} cy={14} r={2} />
              <circle cx={9} cy={14} r={2} />
            </svg>
          </button>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-lg p-8 col-span-1">
          <h3 className="font-semibold text-lg mb-4">Recent projects</h3>
          <ul>
            {projects.map((p) => (
              <li className="flex items-center gap-2 mb-2" key={p}>
                <div className="w-7 h-7 bg-[#0C2340] rounded-md" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg p-8 col-span-1">
          <h3 className="font-semibold text-lg mb-4">Recent notifications</h3>
          <ul>
            {notifications.map((n, i) => (
              <li className="flex items-center gap-2 mb-2" key={i}>
                <svg
                  width={18}
                  height={18}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx={9} cy={9} r={8} />
                  <path d="M9 13v.01" />
                  <path d="M9 9V5" />
                </svg>
                <span>{n}</span>
                <span className="ml-auto text-xs text-gray-400">
                  2 hours ago
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Add Project - Navigates to /dashboard/projects/new */}
        <div
          className="bg-white rounded-2xl shadow-lg col-span-1 flex flex-col items-center justify-center h-48 mt-4 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => navigate("/dashboard/projects/new")}
        >
          <button className="text-4xl text-gray-400">+</button>
          <div className="text-lg mt-2">Add project</div>
        </div>

        {/* Manage Projects */}
        <div className="bg-white rounded-2xl shadow-lg col-span-1 flex flex-col items-center justify-center h-48 mt-4">
          <svg
            width={40}
            height={40}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx={20} cy={20} r={18} />
            <path d="M20 12v8l5 5" />
          </svg>
          <div className="text-lg mt-2">Manage Projects</div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl shadow-lg p-8 col-span-1 mt-4">
          <h3 className="font-semibold text-lg mb-4">Messages</h3>
          <ul>
            {messages.map((m) => (
              <li className="flex items-center gap-2 mb-3" key={m.name}>
                <div className="w-7 h-7 bg-[#0C2340] rounded-full" />
                <div>
                  <div>{m.name}</div>
                  <div className="text-sm text-gray-400">{m.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
