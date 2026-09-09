import { useNavigate } from "react-router-dom";

interface HubInfoProps {
  // Home's single-page "about" section embeds these cards inline and needs
  // a way back to the full AboutHub page (WhyHub / FAQs / Support); the
  // dedicated /Hub-information route renders this same component as the
  // page itself, where a link to itself would be redundant - off by
  // default, only Home's usage opts in.
  showCta?: boolean;
}

const HubInfo = ({ showCta = false }: HubInfoProps) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* MISSION Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-[#002B56] px-6 py-6">
              <h2 className="text-2xl font-semibold text-white text-center">
                MISSION
              </h2>
            </div>
            <div className="p-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700">
                    We empower student innovators through a collaborative
                    ecosystem built on technology, mentorship, and hands-on
                    skill development.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700">
                    Our work accelerates the National Police College&apos;s
                    digital transformation and strengthens its institutional
                    capacity.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* VISION Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-[#002B56] px-6 py-6">
              <h2 className="text-2xl font-semibold text-white text-center">
                VISION
              </h2>
            </div>
            <div className="p-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700">
                    We envision being the National Police College&apos;s leading
                    center for technology innovation and student-led
                    problem-solving.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700">
                    Our commitment to excellence positions the College as a hub
                    of technology excellence and sustainable innovation.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* GOALS Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-[#002B56] px-6 py-6">
              <h2 className="text-2xl font-semibold text-white text-center">
                GOALS
              </h2>
            </div>
            <div className="p-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700">
                    We aim to deliver high-quality, secure software that serves
                    the National Police College&apos;s needs, enhancing user
                    satisfaction.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700">
                    Our focus is on innovation, efficiency, and fostering a
                    culture of learning.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {showCta && (
          <div className="flex justify-center mt-12">
            <button
              className="text-lg py-3 px-12 border-2 border-[#002b56] text-[#002b56] rounded-[33px] shadow-md hover:bg-[#e6f0ff] transition-colors focus:outline-none focus:ring-2 focus:ring-[#002b56] focus:ring-opacity-50"
              onClick={() => navigate("/Hub-information")}
            >
              Learn More About Us
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HubInfo;
