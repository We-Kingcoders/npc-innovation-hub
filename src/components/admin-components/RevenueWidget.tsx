export default function RevenueWidget() {
  return (
    <div className="flex bg-white shadow rounded-xl p-8 mt-6 gap-6">
      <div className="flex-1">
        <span className="block text-gray-600 font-semibold mb-2">
          Total Revenue
        </span>
        {/* Replace with a chart component */}
        <div className="w-full h-32 bg-blue-100 rounded-lg flex items-center justify-center text-blue-400 font-bold text-2xl">
          Chart
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-56">
        {/* Replace with a circular progress bar */}
        <div className="w-28 h-28 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
          78%
        </div>
        <span className="text-gray-600 mt-2 text-center">
          62% Company Growth
        </span>
        <div className="flex justify-between gap-6 mt-2 text-gray-500 text-sm">
          <span>2023 $32.5k</span>
          <span>2022 $41.2k</span>
        </div>
      </div>
    </div>
  );
}
