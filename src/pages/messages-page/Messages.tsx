import React, { useState } from "react";
import { Smile, Reply, Paperclip, Send, MoreHorizontal } from "lucide-react";
import LeftPanel from "../../components/member/LeftPanel"; // Make sure path is correct

// Define proper interfaces
interface Reaction {
  emoji: string;
  count: number;
}

interface Message {
  id: number;
  from: "them" | "me";
  text: string;
  time: string;
  reactions: Reaction[]; // Both message types can have reactions
}

interface Member {
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
}

const chatMembers: Member[] = [
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

const defaultMessages: Message[] = [
  {
    id: 1,
    from: "them",
    text: "Hi there! How are you doing today?",
    time: "11:30 AM",
    reactions: [{ emoji: "👍", count: 2 }],
  },
  {
    id: 2,
    from: "me",
    text: "Hey! I'm doing great, thanks for asking. How about you?",
    time: "11:31 AM",
    reactions: [],
  },
  {
    id: 3,
    from: "them",
    text: "I'm doing well too! Just working on some projects. What have you been up to?",
    time: "11:33 AM",
    reactions: [{ emoji: "😊", count: 1 }],
  },
];

const reactionEmojis = ["👍", "❤️", "😊", "😂", "👏", "🔥"];

export const Messages: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [msg, setMsg] = useState("");
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [showReactions, setShowReactions] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [messagesByMember, setMessagesByMember] = useState<
    Record<number, Message[]>
  >({
    0: defaultMessages,
    1: [],
    2: [],
  });

  const selectedName =
    selectedIndex !== null ? chatMembers[selectedIndex]?.name : "";
  const messages =
    selectedIndex !== null ? messagesByMember[selectedIndex] || [] : [];

  const handleReaction = (messageId: number, emoji: string) => {
    if (selectedIndex === null) return;

    setMessagesByMember((prev) => {
      const updatedMessages = (prev[selectedIndex] || []).map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1 }],
            };
          }
        }
        return msg;
      });

      return {
        ...prev,
        [selectedIndex]: updatedMessages,
      };
    });

    setShowReactions(null);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (msg.trim() && selectedIndex !== null) {
      const newMessage: Message = {
        id: messages.length + 1,
        from: "me",
        text: msg,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reactions: [],
      };
      setMessagesByMember((prev) => ({
        ...prev,
        [selectedIndex]: [...(prev[selectedIndex] || []), newMessage],
      }));
      setMsg("");
    }
  };

  return (
    <div className="flex gap-6">
      <LeftPanel
        members={chatMembers}
        selected={selectedIndex}
        onSelect={setSelectedIndex}
      />

      <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col p-8 relative">
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedName}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map((msgObj) => (
            <div
              key={msgObj.id}
              className={`flex items-start group relative ${
                msgObj.from === "me" ? "flex-row-reverse" : ""
              }`}
              onMouseEnter={() => setHoveredMessage(msgObj.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-[#0C2340] to-[#1a3a5c] rounded-full flex items-center justify-center text-white font-medium">
                {msgObj.from === "me" ? "Me" : selectedName?.charAt(0)}
              </div>

              <div
                className={`max-w-md px-4 py-3 rounded-2xl mx-3 relative ${
                  msgObj.from === "me"
                    ? "bg-[#0C2340] text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="text-sm leading-relaxed">{msgObj.text}</div>
                <div
                  className={`text-xs mt-2 ${
                    msgObj.from === "me" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  {msgObj.time}
                </div>

                {msgObj.reactions.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {msgObj.reactions.map((reaction, idx) => (
                      <div
                        key={idx}
                        className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs flex items-center gap-1"
                      >
                        <span>{reaction.emoji}</span>
                        <span>{reaction.count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {hoveredMessage === msgObj.id && (
                <div
                  className={`absolute top-0 flex items-center gap-2 ${
                    msgObj.from === "me" ? "left-0" : "right-0"
                  }`}
                >
                  <button
                    onClick={() => setShowReactions(msgObj.id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    title="Add reaction"
                  >
                    <Smile className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    title="Reply"
                  >
                    <Reply className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                    title="More"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}

              {showReactions === msgObj.id && (
                <div className="absolute top-12 z-10 bg-white rounded-lg shadow-lg p-2 flex gap-1">
                  {reactionEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msgObj.id, emoji)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-xl"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-[#0C2340] to-[#1a3a5c] rounded-full flex items-center justify-center text-white font-medium">
            Me
          </div>

          <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-4 py-3 border border-gray-200">
            <input
              className="flex-1 outline-none text-sm"
              placeholder="Type a message..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button
              type="button"
              className="text-gray-400 hover:text-[#0C2340]"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="text-gray-400 hover:text-[#0C2340]"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          <button
            type="submit"
            disabled={!msg.trim()}
            className="p-3 bg-[#0C2340] text-white rounded-lg hover:bg-[#1a3a5c] disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {showEmojiPicker && (
          <div className="absolute bottom-24 right-8 bg-white rounded-lg shadow-lg p-4 grid grid-cols-8 gap-2 z-10">
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
                  setMsg((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
