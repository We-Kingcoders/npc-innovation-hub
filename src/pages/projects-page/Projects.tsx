// import React, { useState } from "react";
import { ProjectTable } from "../../components/resources/ProjectTable";
import { useNavigate } from "react-router-dom";

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Projects</h2>
      <ProjectTable />
      <div className="flex justify-end mt-8">
        <button
          className="bg-[#28335A] text-white px-8 py-3 rounded-lg font-semibold text-lg"
          onClick={() => navigate("/dashboard/projects/new")}
        >
          Add New project
        </button>
      </div>
    </div>
  );
};
