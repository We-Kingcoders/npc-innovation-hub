import React, { useRef } from "react";

export const AddProject: React.FC = () => {
  const ownerImageRef = useRef<HTMLInputElement>(null);
  const projectImageRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add new project</h2>
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-6xl">
        <form className="grid grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Project title"
            className="border rounded-lg px-4 py-3 mb-3 outline-none"
          />
          <input
            type="text"
            placeholder="Project description"
            className="border rounded-lg px-4 py-3 mb-3 outline-none"
          />
          <input
            type="text"
            placeholder="Project owner"
            className="border rounded-lg px-4 py-3 mb-3 outline-none"
          />
          <input
            type="text"
            placeholder="Project owner role"
            className="border rounded-lg px-4 py-3 mb-3 outline-none"
          />
          <input
            type="text"
            placeholder="Project link"
            className="border rounded-lg px-4 py-3 mb-3 outline-none col-span-2"
          />
          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <button
              type="button"
              className="bg-[#28335A] text-white px-6 py-3 rounded-lg"
              onClick={() => ownerImageRef.current?.click()}
            >
              Upload owner image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={ownerImageRef}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
            <button
              type="button"
              className="bg-[#28335A] text-white px-6 py-3 rounded-lg"
              onClick={() => projectImageRef.current?.click()}
            >
              Upload project image
            </button>
            <input
              type="file"
              accept="image/*"
              ref={projectImageRef}
              className="hidden"
            />
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="bg-[#28335A] text-white px-8 py-3 rounded-lg font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
