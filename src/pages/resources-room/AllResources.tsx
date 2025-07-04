// src/pages/resources-room/AllResources.tsx
import React from "react";
import NavMenu from "../../components/resources/NavMenu";
//import SubcategoryResourceGrid from "../../components/resources/SubcategoryResourceGrid";
import { resources } from "../../components/resources/ResourceList";

const AllResources: React.FC = () => {
  return (
    <div>
      <div className="bg-[#05274C] w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="ALL RESOURCES" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl font-bold text-center mb-10">ALL RESOURCES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {resources.map((res) => (
            <div
              key={res.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img src={res.icon} alt={res.title} className="w-24 h-24 mb-4" />
              <div className="font-medium text-center mb-2">{res.title}</div>
              <div className="flex gap-4 text-gray-500 text-sm items-center">
                <span className="flex items-center gap-1">❤️ {res.likes}</span>
                <span className="flex items-center gap-1">👁️ {res.views}</span>
                <span className="ml-2 font-semibold text-[#1876C6]">
                  {res.subcategory}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllResources;
