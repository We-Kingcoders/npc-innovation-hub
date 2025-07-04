import React, { useState } from "react";

// Demo mock data
const chatMembers = [
  {
    name: "Sam Rwanda",
    lastMessage: "Hello, are you there?",
    time: "11:30 AM",
    unread: 1,
  },
  {
    name: "ALAN",
    lastMessage: "Hello, are you there?",
    time: "11:30 AM",
    unread: 1,
  },
  {
    name: "Peace",
    lastMessage: "Hello, are you there?",
    time: "11:30 AM",
    unread: 0,
  },
];

const chatMessages = [
  {
    from: "them",
    text: "Rorem ipsum dolor sit amet consectetur",
    time: "11:30 AM",
  },
  {
    from: "me",
    text: "Rorem ipsum dolor sit amet consectetur",
    time: "11:30 AM",
  },
  {
    from: "them",
    text: "Rorem ipsum dolor sit amet consectetur",
    time: "11:30 AM",
  },
  {
    from: "me",
    text: "Rorem ipsum dolor sit amet consectetur",
    time: "11:30 AM",
  },
];

export const Messages: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState(0);
  const [msg, setMsg] = useState("");

  return (
    <div className="flex gap-6">
      {/* Members List */}
      <div className="bg-white rounded-2xl shadow-lg p-8 w-80">
        <h3 className="font-semibold text-2xl mb-6">Messages</h3>
        <ul>
          {chatMembers.map((m, idx) => (
            <li
              key={m.name}
              className={`flex items-center gap-3 py-3 border-b cursor-pointer ${
                selectedMember === idx ? "bg-gray-100" : ""
              }`}
              onClick={() => setSelectedMember(idx)}
            >
              <div className="w-8 h-8 bg-[#0C2340] rounded-full" />
              <div className="flex-1">
                <div className="font-semibold">{m.name}</div>
                <div className="text-sm text-gray-400">{m.lastMessage}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">{m.time}</span>
                {m.unread > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-1">
                    {m.unread}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Chat Section */}
      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col p-8">
        <div className="flex-1">
          {chatMessages.map((msgObj, idx) => (
            <div
              key={idx}
              className={`flex items-start mb-6 ${
                msgObj.from === "me" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="w-8 h-8 bg-[#0C2340] rounded-full" />
              <div
                className={`max-w-md px-5 py-3 rounded-xl ml-4 mr-4 ${
                  msgObj.from === "me"
                    ? "bg-white border text-[#0C2340] self-end"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {msgObj.text}
                <div className="text-xs text-gray-400 mt-2 text-right">
                  {msgObj.time}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-3 mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            setMsg("");
          }}
        >
          <div className="w-8 h-8 bg-[#0C2340] rounded-full" />
          <input
            className="flex-1 rounded-lg border px-4 py-3 outline-none"
            placeholder="Type a message"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button
            type="submit"
            className="text-2xl ml-2 text-[#0C2340]"
            title="Send"
          >
            <svg
              width={30}
              height={30}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M2 28L29 15L2 2V12L20 15L2 18V28Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
