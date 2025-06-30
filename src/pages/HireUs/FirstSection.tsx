const InnovationHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 font-sans">
      {/* Transparent Navigation Bar */}
      <header className="bg-transparent absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900 tracking-tight">
            NpclnnovationHub
          </div>
          <nav className="hidden md:flex space-x-8">
            <a
              href="#"
              className="text-blue-700 hover:text-gray-600 text-xl font-medium transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-blue-600 hover:text-gray-700 text-xl font-medium transition-colors"
            >
              AboutHub
            </a>
            <a
              href="#"
              className="text-blue-700 hover:text-gray-600 text-xl font-medium transition-colors"
            >
              Members
            </a>
            <a
              href="#"
              className="text-blue-700 hover:text-gray-600 text-xl font-medium transition-colors"
            >
              Projects
            </a>
            <button
              style={{ backgroundColor: "#002B56" }}
              className="hover:brightness-110 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center py-16 md:py-24">
            {/* Left Column - Text Content */}
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-32">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-2">
                Our Hire Us Process:
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                <span className="text-purple-600">From Planning to</span>
                <br />
                <span className="text-gray-900">Deployment.</span>
              </h2>
              <p className="text-gray-600 text-xl mb-8 leading-relaxed max-w-md">
                We handle your project from planning to deployment with
                professional, end-to-end solutions.
              </p>

              <div className="flex items-center space-x-4 mb-8">
                <button
                  style={{ backgroundColor: "#002B56" }}
                  className="text-white font-medium py-3 px-6 rounded-full text-sm transition duration-200 hover:brightness-110"
                >
                  More Info
                </button>

                {/* Team member avatars */}
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/40?img=1"
                      alt="JD"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/40?img=2"
                      alt="AM"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/40?img=3"
                      alt="SK"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white overflow-hidden">
                    <img
                      src="https://i.pravatar.cc/40?img=4"
                      alt="TM"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <a
                  href="/members"
                  className="text-gray-600 font-medium hover:underline"
                >
                  + More
                </a>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/assets/images/Group 69.png"
                alt="Innovation Hub Process"
                className="w-full max-w-xl h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InnovationHub;
