// src/pages/Hub-info/CoreValues.tsx
//
// Only shown on the full /Hub-information page - Home's "about" preview
// stays short and links here for the rest.
const VALUES = [
  {
    title: "Innovation First",
    description:
      "We champion creative thinking and hands-on problem-solving to tackle real challenges.",
  },
  {
    title: "Community Driven",
    description:
      "Our strength is our community of student developers, designers, and innovators.",
  },
  {
    title: "Continuous Learning",
    description:
      "We nurture curiosity and help members grow their technical and professional skills.",
  },
  {
    title: "Collaboration",
    description:
      "We believe in teamwork and knowledge-sharing to build better solutions together.",
  },
];

const CoreValues = () => {
  return (
    <div className="bg-[#F5F9FC] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002b56] mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-[#283D4B]/80 max-w-2xl mx-auto">
            These principles guide everything we do and define who we are as a
            Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-xl font-semibold text-[#002b56] mb-2">
                {value.title}
              </h3>
              <p className="text-[#283D4B]/80">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreValues;
