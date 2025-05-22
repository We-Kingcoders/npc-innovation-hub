import React from 'react';

const Skills: React.FC = () => {
  return (
    <div className="w-full py-16 px-8 text-white font-sans" style={{ backgroundColor: '#002B56' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left content */}
          <div className="md:w-1/2 pr-4">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              We're not just building skills — we're building futures.
            </h2>
            
            <p className="text-lg mb-12 opacity-90">
              From classrooms to careers, #OurHUB empowers Africa's next generation of problem-solvers, creators, and leaders.
            </p>
            
            <div className="flex items-center text-lg">
              <span className="mr-4">Our full impact</span>
              <div className="bg-[#003366] p-2 rounded">
                <svg 
                  className="w-5 h-5" 
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
              </div>
            </div>
          </div>
          
          {/* Right stats grid */}
          <div className="md:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stat 1 */}
              <div className="bg-[#003366] rounded-lg p-6">
                <div className="mb-2">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold">260k+</div>
                <div className="text-sm opacity-80">graduates since 2022</div>
              </div>
              
              {/* Stat 2 */}
              <div className="bg-[#003366] rounded-lg p-6">
                <div className="mb-2">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold">65k</div>
                <div className="text-sm opacity-80">jobs created</div>
              </div>
              
              {/* Stat 3 */}
              <div className="bg-[#003366] rounded-lg p-6">
                <div className="mb-2">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold">22k</div>
                <div className="text-sm opacity-80">job placements</div>
              </div>
              {/* Stat 4 */}
              <div className="bg-[#003366] rounded-lg p-6">
                <div className="mb-2">
                  <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold">22k</div>
                <div className="text-sm opacity-80">job placements</div>
              </div>
              
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skills;