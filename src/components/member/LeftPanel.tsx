import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hash, Search, Plus, MoreVertical } from "lucide-react";

interface Member {
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline?: boolean;
}

interface LeftPanelProps {
  members: Member[];
  selected: number | null;
  onSelect?: (index: number) => void; // Add this prop
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  members,
  selected,
  onSelect,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHubClick = () => {
    navigate("/hub-channel");
  };

  const handleMemberClick = (index: number) => {
    // Call onSelect if it exists (for the Messages component)
    if (onSelect) {
      onSelect(index);
    } else {
      // Fallback to navigation if onSelect is not provided
      navigate(`/messages/${index}`);
    }
  };

  const isHub = location.pathname === "/hub-channel";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatTime = (time: string) => {
    // Enhanced time formatting
    const now = new Date();
    const messageTime = new Date(time);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return time;
    }
  };

  const truncateMessage = (message: string, maxLength: number = 35) => {
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-80 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl text-gray-800">Messages</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Plus size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Hub Collaboration Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-800">
            Hub Collaboration
          </h3>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>

        <div
          className={`flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
            isHub
              ? "bg-blue-50 border border-blue-200 text-blue-700"
              : "hover:bg-gray-50"
          }`}
          onClick={handleHubClick}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
            <Hash size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Hub Channel</div>
            <div className="text-sm text-gray-500">General discussions</div>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800">
              Direct Messages
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {members.length}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6">
          <ul className="space-y-1">
            {members.map((member, idx) => (
              <li
                key={member.name}
                className={`flex items-center gap-3 py-3 px-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selected === idx
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => handleMemberClick(idx)}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(member.name)}
                  </div>
                  {member.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 truncate">
                      {member.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatTime(member.time)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {truncateMessage(member.lastMessage)}
                  </div>
                </div>

                {member.unread > 0 && (
                  <div className="flex flex-col items-end">
                    <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 font-medium">
                      {member.unread > 99 ? "99+" : member.unread}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Online now</span>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
