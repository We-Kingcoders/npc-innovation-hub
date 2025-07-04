import React from "react";
import TrustedBy from "../../components/resources/TrustedBy";
import ResourceList from "../../components/resources/ResourceList";
import { Link } from "react-router-dom";
import NavMenu from "../../components/resources/NavMenu"; // import the shared NavMenu

const Home: React.FC = () => {
  return (
    <div>
      <div className="bg-[#05274C] w-full">
        <div className="max-w-6xl mx-auto flex space-x-8 py-2">
          <NavMenu active="HOME" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-2">Access resources</h2>
        <p className="mb-6 text-gray-700">
          Qorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
          vulputate libero et velit interdum, ac aliquet odio mattis. Class
          aptent taciti sociosqu ad litora torquent per conubia nostra, per
          inceptos himenaeos. Curabitur tempus urna at turpis condimentum
          lobortis.
        </p>
        <div className="flex justify-center gap-6 mb-12">
          <Link to="/resources-room/all-resources">
            <button className="px-10 py-4 bg-gray-200 rounded-lg font-semibold text-xl hover:bg-gray-300 transition">
              ALL RESOURCES
            </button>
          </Link>
          <Link to="/resources-room/categories">
            <button className="px-10 py-4 bg-gray-200 rounded-lg font-semibold text-xl hover:bg-gray-300 transition">
              CATEGORIES
            </button>
          </Link>
        </div>
      </div>
      <TrustedBy />
      <div className="max-w-5xl mx-auto py-12">
        <ResourceList title="Most liked resources by vistors" />
      </div>
    </div>
  );
};

export default Home;
