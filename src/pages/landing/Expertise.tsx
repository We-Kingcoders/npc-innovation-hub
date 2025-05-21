import React from 'react';

const Expertise: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans">
      {/* Top section */}
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        {/* Left content */}
        <div className="flex flex-col justify-center md:w-1/2 md:pr-8">
          <p className="text-blue-900 font-medium mb-2">Our Expertise</p>
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            This is<br />
            <span className="text-blue-700">#Expertise</span>
          </h1>
          <p className="text-blue-900 mb-10 max-w-sm">
            Secure, user-centric digital solutions for web and mobile.
          </p>
          <div>
            <button className="flex items-center border border-gray-300 rounded-full px-6 py-2.5 text-blue-900 text-sm hover:bg-gray-50 transition">
              Discover our Skills
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right main image */}
        <div className="md:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="/public/assets/images/hero.png" 
              alt="Smiling professional with smartphone" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom image grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left image - server room */}
        <div className="col-span-12 md:col-span-4">
          <div className="rounded-2xl overflow-hidden shadow-lg h-48 md:h-52">
            <img 
              src="/public/assets/images/hero.png" 
              alt="Professional in blue server room" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Middle image - airport/hallway */}
        <div className="col-span-12 md:col-span-5">
        <div className="rounded-2xl overflow-hidden shadow-lg h-[30rem] md:h-[20rem] relative">
          <img 
            src="/public/assets/images/hero.png" 
            alt="Professional in airport hallway" 
            className="w-full h-full object-cover"
          />
        </div>

        </div>

        {/* Right image - person with laptop */}
        <div className="col-span-12 md:col-span-3">
          <div className="rounded-2xl overflow-hidden shadow-lg h-[18rem] md:h-40 mt-0 md:mt-9">
            <img 
              src="/public/assets/images/hero.png" 
              alt="Professional with laptop" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expertise;