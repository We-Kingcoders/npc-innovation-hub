// src/components/button/Footer.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Info,
  Home as HomeIcon,
  UserPlus,
  Target,
  Users,
  FolderGit2,
  HelpCircle,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import HireUsModal from "../HireUsModal";
import JoinUsModal from "../JoinUsModal";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div id="footer" className="w-full font-sans scroll-mt-16 lg:scroll-mt-20">
      <HireUsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <JoinUsModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      {/* Main footer with angled background */}
      <div
        className="w-full pt-16 pb-12 relative"
        style={{ backgroundColor: "#002B56" }}
      >
        {/* White angled overlay at the top */}
        <div
          className="absolute top-0 left-0 right-0 h-20 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 100%)" }}
        ></div>

        <div className="max-w-5xl mx-auto px-4">
          {/* Footer main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white mb-16">
            {/* Left column */}
            <div>
              <h4 className="text-xl font-bold mb-4">NPC INNOVATION HUB</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/Hub-information"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <Info
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    What we do
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#home"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <HomeIcon
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <UserPlus
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Join Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Middle column */}
            <div>
              <h4 className="text-xl font-bold mb-4">Learn About Us</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/Hub-information"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <Target
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Our Mission &amp; Vision
                  </Link>
                </li>
                <li>
                  <Link
                    to="/#members"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <Users
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Our Members
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <FolderGit2
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Our Projects
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right column */}
            <div>
              <h4 className="text-xl font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/faqs"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <HelpCircle
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chat-with-us"
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <MessageCircle
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Chat with Us
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 hover:text-gray-300 transition-colors"
                  >
                    <Briefcase
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden="true"
                    />
                    Hire Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="pt-4 border-t border-blue-800 text-white flex flex-col md:flex-row justify-center md:justify-between items-center text-sm">
            {/* "Privacy" link removed: no privacy policy page exists yet -
                a dead link was worse than no link. Add back once there's a
                real page to point to. */}
            <div className="mb-2 md:mb-0">© Copyright {currentYear}</div>
            <div className="font-bold">NPC INNOVATION HUB</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
