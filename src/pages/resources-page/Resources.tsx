import React from "react";
import { useNavigate } from "react-router-dom";
import ResourceTable from "../../components/resources/ResourceTable";

export const Resources: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Resources</h2>
        <button
          onClick={() => navigate("/resources-room")}
          className="text-2xl text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 cursor-pointer"
        >
          Resources Room →
        </button>
      </div>
      <ResourceTable />
    </div>
  );
};
