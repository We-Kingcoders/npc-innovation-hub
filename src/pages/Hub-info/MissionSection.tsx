const HubInfo = () => {
  return (
    <div>
      {/* Yellow Header Bar */}
      <div className="bg-yellow-400 h-20 w-full flex items-center px-6"></div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-14">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 py-12">
          NPCInnovationHub information
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* MISSION Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-400 px-6 py-6">
              <h2 className="text-2xl font-semibold text-black text-center">
                MISSION
              </h2>
            </div>
            <div className="p-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700 italic">
                    We craft innovative, user-centric software solutions that
                    drive business success and enhance user experiences.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700 italic">
                    Our team thrives on collaboration, continuous learning, and
                    delivering high-quality, scalable applications.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* VISION Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-400 px-6 py-6">
              <h2 className="text-2xl font-semibold text-black text-center">
                VISION
              </h2>
            </div>
            <div className="p-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700 italic">
                    We envision leading the future of software innovation by
                    crafting intelligent, scalable solutions that empower users.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700 italic">
                    Our commitment to excellence positions us to shape a
                    smarter, more connected world.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* GOALS Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gray-400 px-6 py-6">
              <h2 className="text-2xl font-semibold text-black text-center">
                GOALS
              </h2>
            </div>
            <div className="p-12">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700 italic">
                    We aim to deliver high-quality, secure software on schedule,
                    enhancing user satisfaction.
                  </p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-green-600 rounded-full mr-3"></span>
                  <p className="text-gray-700 italic">
                    Our focus is on innovation, efficiency, and fostering a
                    culture of learning.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HubInfo;
