// src/components/button/Footer.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import HireUsModal from "../HireUsModal";
import JoinUsModal from "../JoinUsModal";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full font-sans mt-64">
      <HireUsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <JoinUsModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />

      <style>{`
        .hire-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #002B56;
          color: #fff;
          font-weight: 700;
          font-size: 0.88rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          padding: 0.72rem 1.6rem;
          border-radius: 999px;
          border: 2px solid #002B56;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.3s ease;
          box-shadow: 0 4px 14px rgba(0,43,86,0.25);
        }
        .hire-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #fff;
          transform: translateX(-101%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .hire-btn:hover::before { transform: translateX(0); }
        .hire-btn:hover { color: #002B56; box-shadow: 0 6px 20px rgba(0,43,86,0.3); }
        .hire-btn span, .hire-btn svg { position: relative; z-index: 1; }
        .hire-btn svg { transition: transform 0.3s ease; }
        .hire-btn:hover svg { transform: translateX(5px); }
        .hire-btn:active { transform: scale(0.97); }
      `}</style>

      {/* Main footer with angled background */}
      <div
        className="w-full pt-24 pb-12 relative min-h-[500px]"
        style={{ backgroundColor: "#002B56" }}
      >
        {/* White angled overlay at the top */}
        <div
          className="absolute top-0 left-0 right-0 h-20 bg-white"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 100%)" }}
        ></div>

        <div className="max-w-5xl mx-auto px-4">
          {/* Top card with image and text */}
          <div className="max-w-5xl mx-auto -mt-44 mb-20 relative z-10">
            <div
              className="flex flex-col md:flex-row overflow-hidden rounded-lg shadow-lg bg-green-200"
              style={{ border: "1px solid #002B56" }}
            >
              {/* Left side - Image */}
              <div className="md:w-1/2 overflow-hidden">
                <img
                  src="/assets/images/hero.png"
                  alt="Person with glasses"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right side - Text and button */}
              <div className="md:w-1/2 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">
                  This is the best choice you've made
                </h3>
                <p className="text-blue-900 mb-6">
                  The smartest choice for your future.
                </p>
                <div>
                  <button
                    className="hire-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span>Hire Us</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white mb-24">
            {/* Left column */}
            <div>
              <h4 className="text-xl font-bold mb-4">NPC INNOVATION HUB</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/Hub-information"
                    className="hover:text-gray-300 transition-colors"
                  >
                    What we do
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="hover:text-gray-300 transition-colors"
                  >
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
                    className="hover:text-gray-300 transition-colors"
                  >
                    Our Mission &amp; Vision
                  </Link>
                </li>
                <li>
                  <Link
                    to="/members"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Our Members
                  </Link>
                </li>
                <li>
                  <Link
                    to="/projects"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Our Projects
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right column */}
            {/* TODO(content): this column had a hardcoded "#Mugisha
                Emmanuell" heading here with social icons underneath. Left
                out rather than guessed at - it reads like a specific
                person's name/handle, not a generic label like the other two
                columns, and neither it nor the social links (all led
                nowhere - href="#") could be verified as real. Restore with
                real destinations, or remove this column, once confirmed. */}

            {/* Social links removed: none had a real destination
                (all href="#") and no verified NPC Innovation Hub social
                accounts were available to link instead. Add them back here
                with real URLs once the hub has accounts to share. */}
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
