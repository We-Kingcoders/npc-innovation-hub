// src/components/button/Footer.tsx
import React, { useState } from "react";
import HireUsModal from "../HireUsModal";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full font-sans mt-64">
      <HireUsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
                  src="/public/assets/images/hero.png"
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
              <h4 className="text-xl font-bold mb-4">NpcInnovationHub</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    What we do
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    Join Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Middle column */}
            <div>
              <h4 className="text-xl font-bold mb-4">Learn About Us</h4>
            </div>

            {/* Right column */}
            <div className="flex flex-col items-start md:items-end">
              <h4 className="text-xl font-bold mb-4">#Mugisha Emmanuell</h4>
              <div className="flex space-x-4 mt-2">
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom footer */}
          <div className="pt-4 border-t border-blue-800 text-white flex flex-col md:flex-row justify-between items-center text-sm">
            <a
              href="#"
              className="mb-2 md:mb-0 hover:text-gray-300 transition-colors"
            >
              Privacy
            </a>
            <div className="mb-2 md:mb-0">© Copyright {currentYear}</div>
            <div>NpcInnovationHub</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
