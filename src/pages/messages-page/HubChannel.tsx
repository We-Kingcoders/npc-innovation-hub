import React, { useState } from "react";
import {
  Hash,
  Users,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Reply,
} from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel"; // adjust path if needed

const members = [
  {
    name: "Sam Rwanda",
    color: "#0C2340",
    lastMessage: "Hello, are you there?",
    time: "11:30 AM",
    unread: 1,
  },
  {
    name: "ALAN",
    color: "#0C2340",
    lastMessage: "Hello, are you there?",
    time: "11:30 AM",
    unread: 1,
  },
  {
    name: "Peace",
    color: "#A4E451",
    lastMessage: "Hello, are you there?",
    time: "11:30 AM",
    unread: 0,
  },
];

const hubChannelMessages = [
  {
    id: 1,
    name: "Sam Rwanda",
    color: "#0C2340",
    text: "Welcome everyone to the Hub Channel! Let's collaborate and share ideas effectively. Looking forward to productive discussions.",
    time: "11:30 AM",
    reactions: [
      { emoji: "👍", count: 3 },
      { emoji: "❤️", count: 1 },
    ],
  },
  {
    id: 2,
    name: "Peace",
    color: "#A4E451",
    text: "Great to be here! I'm excited to work with this amazing team. Does anyone have updates on the current project status?",
    time: "11:32 AM",
    reactions: [{ emoji: "😊", count: 2 }],
  },
  {
    id: 3,
    name: "Sam Rwanda",
    color: "#0C2340",
    text: "The project is moving along well. We've completed the initial phase and are now focusing on the implementation details. I'll share a detailed update in our next meeting.",
    time: "11:35 AM",
    reactions: [],
  },
  {
    id: 4,
    name: "ALAN",
    color: "#1a3a5c",
    text: "Perfect! I've been working on the documentation. Will have it ready for review by tomorrow. Any specific areas you'd like me to focus on?",
    time: "11:40 AM",
    reactions: [{ emoji: "🔥", count: 1 }],
  },
];

export const HubChannel: React.FC = () => {
  const [message, setMessage] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message sending logic here
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex gap-6">
      <LeftPanel members={members} selected={null} />

      {/* Channel chat section */}
      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col relative">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                <Hash size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Hub Channel
                </h2>
                <p className="text-sm text-gray-500">
                  General discussions and collaboration
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users size={16} />
                <span>{members.length} members</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {hubChannelMessages.map((msg) => (
            <div
              key={msg.id}
              className="group relative"
              onMouseEnter={() => setHoveredMessage(msg.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                  style={{ backgroundColor: msg.color }}
                >
                  {getInitials(msg.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {msg.name}
                    </span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>

                  <div className="text-gray-700 leading-relaxed text-sm mb-2">
                    {msg.text}
                  </div>

                  {/* Reactions */}
                  {msg.reactions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {msg.reactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-gray-600">
                            {reaction.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message Actions */}
              {hoveredMessage === msg.id && (
                <div className="absolute top-0 right-0 flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-200 p-1">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Add reaction"
                  >
                    <Smile size={16} className="text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Reply"
                  >
                    <Reply size={16} className="text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="More options"
                  >
                    <MoreHorizontal size={16} className="text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-100">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
              style={{ backgroundColor: "#0C2340" }}
            >
              Me
            </div>

            <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <input
                type="text"
                placeholder="Type a message in #hub-channel..."
                className="flex-1 outline-none bg-transparent text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Add emoji"
                >
                  <Smile size={18} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!message.trim()}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <Send size={18} />
            </button>
          </form>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute bottom-24 right-8 bg-white rounded-lg shadow-lg border border-gray-200 p-4 grid grid-cols-8 gap-2 z-10">
              {[
                "😀",
                "😊",
                "😂",
                "🥰",
                "😍",
                "🤔",
                "😢",
                "😡",
                "👍",
                "👎",
                "❤️",
                "🔥",
                "👏",
                "🎉",
                "💯",
                "🚀",
              ].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setMessage((prev) => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg text-lg transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Typing indicator placeholder */}
        <div className="px-6 pb-2">
          <div className="text-xs text-gray-500">
            {/* You can add typing indicators here */}
          </div>
        </div>
      </div>
    </div>
  );
};
