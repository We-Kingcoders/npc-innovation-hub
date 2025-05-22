// src/components/button/landing/HubMembersSection.tsx
import React, { useState } from "react";

// Define types
interface MemberData {
  id: number;
  name: string;
  role: string;
  location?: string;
  email?: string;
  bio?: string;
  description?: string;
  skills?: string[];
  projects?: number;
  joinedYear?: number;
  image: string;
  icon?: string;
}

interface MemberCardProps {
  member: MemberData;
}

interface MemberGridProps {
  members: MemberData[];
}

interface HeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Member Card Component - Displays individual member information
 */
const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="backdrop-blur-md border-2 border-white rounded-[30px] p-6 pt-12 transition-shadow duration-300">
      <div className="flex flex-col items-center">
        <div className="mb-4 w-full overflow-hidden rounded-[20px]">
          <img 
            src={member.image} 
            alt={`${member.name} profile`} 
            className="w-full h-[300px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        
        <div className="text-center mt-2 w-full">
          <h2 className="text-3xl font-bold text-[#002b56] mb-2">{member.name}</h2>
          
          <div className="flex items-center justify-center mb-3">
            {member.icon ? (
              <img src={member.icon} alt="Role icon" className="w-5 h-5 mr-2" />
            ) : (
              <div className="w-5 h-5 mr-2 text-[#002b56] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 9V7C16 5.89543 15.1046 5 14 5H10C8.89543 5 8 5.89543 8 7V9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            )}
            <p className="text-xl text-[#002b56] font-medium">{member.role}</p>
          </div>
          
          {(member.location || member.email) && (
            <div className="flex flex-col space-y-2 mb-4">
              {member.location && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 mr-2 text-gray-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13V13.01M12 9C12.5523 9 13 8.55228 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55228 11.4477 9 12 9ZM12 9V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M12 21C16.4183 17 20 13.4183 20 10C20 6.13401 16.4183 3 12 3C7.58172 3 4 6.13401 4 10C4 13.4183 7.58172 17 12 21Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{member.location}</p>
                </div>
              )}
              
              {member.email && (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 mr-2 text-gray-600 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M2 7L12 13L22 7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
              )}
            </div>
          )}
          
          <p className="text-base text-center text-gray-700 px-2 mb-4">
            {member.bio || member.description}
          </p>
          
          {member.skills && member.skills.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-[#002b56] mb-2">Key Skills</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {member.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-[#e6f0ff] text-[#002b56] text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {(member.projects !== undefined || member.joinedYear !== undefined) && (
            <div className="flex justify-between mt-6 border-t border-gray-100 pt-4">
              {member.projects !== undefined && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Projects</p>
                  <p className="text-lg font-bold text-[#002b56]">{member.projects}</p>
                </div>
              )}
              
              {member.joinedYear !== undefined && (
                <div className="text-center">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-lg font-bold text-[#002b56]">{member.joinedYear}</p>
                </div>
              )}
            </div>
          )}
          
          <button className="mt-6 bg-[#002b56] text-white py-2 px-6 rounded-full hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Member Grid Component - Displays a grid of member cards
 */
const MemberGrid: React.FC<MemberGridProps> = ({ members }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {members.map((member) => (
        <MemberCard 
          key={member.id} 
          member={member}
        />
      ))}
    </div>
  );
};

/**
 * Header Component - Displays page header with title and subtitle
 */
const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-[#002b56] mb-4">
        {title}
      </h1>
      <p className="text-xl font-medium text-[#002b56] max-w-4xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

/**
 * Main HubMembersSection component - Displays the hub members section
 */
const HubMembersSection: React.FC = () => {
  const [members] = useState<MemberData[]>([

    {
      id: 1,
      name: "Emmanuel MUGISHA",
      role: "Full Stack Developer",
      bio: "Pioneering developer exploring the intersection of decentralized systems and traditional finance to build trusted, transparent applications.",
      image: "/public/assets/images/hero.png"
    },
    {
      id: 2,
      name: "Alain SHEMA",
      role: "Full Stack Developer",
      bio: "Pioneering developer exploring the intersection of decentralized systems and traditional finance to build trusted, transparent applications.",
      image: "/public/assets/images/hero.png"
    },
    {
      id: 3,
      name: "Samuel NSHIMIYIMANA",
      role: "Full Stack Developer",
      bio: "Pioneering developer exploring the intersection of decentralized systems and traditional finance to build trusted, transparent applications.",
      image: "/public/assets/images/hero.png"
    },
   
  ]);

  const handleViewAllMembers = () => {
    console.log("View all members clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f3fdfe] to-[#a7e1e7]">
      <header className="pt-12 pb-6 px-4 md:px-8">
        <div className="container mx-auto pt-28 max-w-7xl">
          <Header 
            title="Hub Members Profile" 
            subtitle="Meet our talented tech professionals who are driving innovation and collaboration within our hub. Each member brings unique expertise and perspective to our community."
          />
        </div>
      </header>

      <main className="py-8 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <MemberGrid members={members} />
          
          <div className="flex justify-center mt-16">
            <button 
              className="text-2xl py-3 px-12 border-2 border-[#002b56] text-[#002b56] rounded-[33px] shadow-md hover:bg-[#e6f0ff] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              onClick={handleViewAllMembers}
            >
              View All Members
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HubMembersSection;
