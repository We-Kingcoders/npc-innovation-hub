import { useState } from "react";
import { categories } from "../../data/admin-data/categories";

export default function AddResourceForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0].label);
  const [subcategory, setSubcategory] = useState(
    categories[0].subcategories[0],
  );
  const [, setIcon] = useState<File | null>(null);

  const selectedCategory = categories.find((c) => c.label === category);

  return (
    <form className="bg-white shadow rounded-xl p-10 w-[700px] mx-auto mt-8 flex flex-col gap-6">
      <input
        type="text"
        className="border rounded-lg px-4 py-3 text-lg"
        placeholder="resource title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block">
        <input
          type="file"
          className="hidden"
          onChange={(e) => setIcon(e.target.files?.[0] ?? null)}
        />
        <div className="w-full bg-[#2d3155] text-white py-4 rounded-lg text-center cursor-pointer">
          Upload resource icon
        </div>
      </label>
      <div className="flex gap-6">
        <div className="flex flex-col w-1/2">
          <label className="mb-2 text-gray-700">Select category</label>
          <select
            className="border rounded-lg px-4 py-3"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory(
                categories.find((c) => c.label === e.target.value)
                  ?.subcategories[0] ?? "",
              );
            }}
          >
            {categories.map((cat) => (
              <option key={cat.label} value={cat.label}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-1/2">
          <label className="mb-2 text-gray-700">Select subcategory</label>
          <select
            className="border rounded-lg px-4 py-3"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >
            {(selectedCategory?.subcategories ?? []).map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-32 bg-[#2d3155] text-white py-3 rounded-lg mt-2 self-start"
      >
        Save
      </button>
    </form>
  );
}
