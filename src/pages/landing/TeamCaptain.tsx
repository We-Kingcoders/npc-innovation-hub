import React from 'react';

const TeamCaptain: React.FC = () => {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      {/* Profile Image */}
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-800 mb-6">
        <img 
          src="/public/assets/images/hero.png" 
          alt="MUGISHA Emmy" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Name */}
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        MUGISHA Emmy
      </h2>
      
      {/* Title */}
      <p className="text-gray-600">
        Team captain in Innovation Hub
      </p>
    </div>
  );
};

export default TeamCaptain;