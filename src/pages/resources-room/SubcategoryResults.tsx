import React from "react";
import { useParams } from "react-router-dom";
import SubcategoryResourceGrid from "../../components/resources/SubcategoryResourceGrid";
import NavMenu from "../../components/resources/NavMenu"; // Import shared NavMenu

const SubcategoryResults: React.FC = () => {
  const { subcategory } = useParams<{ subcategory: string }>();

  // Fallback for direct URL access (optional)
  const subcategoryText = subcategory
    ? decodeURIComponent(subcategory)
    : "UI/UX Design";

  return (
    <div>
      <div className="bg-[#05274C] w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="CATEGORIES" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl font-bold text-center mb-10">
          RESULTS FOR ‘{subcategoryText}’
        </h2>
        <SubcategoryResourceGrid subcategory={subcategoryText} />
      </div>
    </div>
  );
};

export default SubcategoryResults;
