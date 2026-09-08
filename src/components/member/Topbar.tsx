import React from "react";
import { Mail, UserCircle, Search } from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";

export const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 px-10">
      {/* Search Bar */}
      <div className="w-[540px]">
        <div className="bg-white border border-mist-300 rounded-xl shadow-sm flex items-center px-6 py-3 focus-within:border-navy-500 transition-colors">
          <Search className="text-mist-500 mr-3" size={20} />
          <input
            className="w-full outline-none border-none bg-transparent text-sm text-navy-800 placeholder:text-mist-500"
            placeholder="Search a resource or project"
          />
        </div>
      </div>

      {/* Icons Section */}
      <div className="flex gap-3 items-center">
        <NotificationBell />
        {[Mail, UserCircle].map((Icon, i) => (
          <button
            key={i}
            className="w-10 h-10 rounded-xl bg-white border border-mist-300 text-navy-700
                       flex items-center justify-center shadow-sm transition-colors
                       hover:bg-navy-800 hover:border-navy-800 hover:text-white"
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </header>
  );
};
