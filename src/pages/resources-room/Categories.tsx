import React from "react";
import ResourceList from "../../components/resources/ResourceList";
import CategorySection from "../../components/resources/CategorySection";
import NavMenu from "../../components/resources/NavMenu"; // Import the shared NavMenu

const Categories: React.FC = () => {
  return (
    <div>
      <div className="bg-[#05274C] w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="CATEGORIES" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-extrabold text-center mb-8">CATEGORIES</h2>
        <CategorySection />
      </div>
      <div className="max-w-5xl mx-auto py-16">
        <ResourceList title="Most liked resources by vistors" />
      </div>
    </div>
  );
};

export default Categories;
