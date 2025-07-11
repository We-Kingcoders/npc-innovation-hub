import React from "react";
import { Bell, Mail, UserCircle, Search } from "lucide-react";

export const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 px-10  shadow-sm">
      {/* Search Bar */}
      <div className="w-[540px]">
        <div className="bg-white rounded-xl shadow-md flex items-center px-6 py-3">
          <Search className="text-gray-500 mr-3" size={20} />
          <input
            className="w-full outline-none border-none bg-transparent text-sm text-gray-700"
            placeholder="Search a resource or project"
          />
        </div>
      </div>

      {/* Icons Section */}
      <div className="flex gap-6 items-center">
        <button className="relative group hover:scale-105 transition-transform">
          <Bell
            className="text-gray-700 hover:text-indigo-600 transition"
            size={24}
          />
        </button>
        <button className="relative group hover:scale-105 transition-transform">
          <Mail
            className="text-gray-700 hover:text-indigo-600 transition"
            size={24}
          />
        </button>
        <button className="relative group hover:scale-105 transition-transform">
          <UserCircle
            className="text-gray-700 hover:text-indigo-600 transition"
            size={26}
          />
        </button>
      </div>
    </header>
  );
};
