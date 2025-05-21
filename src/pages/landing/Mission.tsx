import React from 'react';

const Mission: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-16 px-8 font-sans">
      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-10 ml-16 text-center md:text-left md:max-w-3xl">
        #OurHUB empowers students to build skills and drive real-world impact through innovation and tech.
      </h2>
      
      {/* Video Section */}
      <div className="relative mb-10 rounded-lg overflow-hidden shadow-l">
        <img 
          src="/public/assets/images/hero.png" 
          alt="Students collaborating" 
          className="w-full h-auto object-cover"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center">
              <svg 
                className="w-6 h-6 md:w-8 md:h-8 text-gray-500" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div className="text-gray-800 md:max-w-4xl">
        <p className="text-base md:text-lg">
          #OurHUB is a vibrant, student-led innovation space where creativity, technology, and 
          collaboration come together to solve real-world challenges. It's a hands-on environment 
          designed to equip young Africans with practical skills in tech, entrepreneurship, and 
          problem-solving. With a focus on impact, #OurHUB supports thousands of learners on 
          their journey from education to employment, creating job opportunities, fostering 
          startups, and building a future-ready workforce. It's more than a hub — it's a movement 
          shaping Africa's tomorrow.
        </p>
      </div>
    </div>
  );
};

export default Mission;