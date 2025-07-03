import { useState } from "react";

interface ContentItem {
  image: string;
  title?: string;
  description: string;
}

interface ContentData {
  "Cyber security": ContentItem[];
  "Front-end": ContentItem[];
  "Back End": ContentItem[];
}

const BlogDesign = () => {
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>("Front-end");

  const contentData: ContentData = {
    "Cyber security": [
      {
        image: "/assets/images/cyber.png",
        description:
          "Empowering businesses with cutting-edge cybersecurity solutions to protect, detect, and defend against digital threats.",
      },
      {
        image: "/assets/images/cyber.png",
        description:
          "Comprehensive vulnerability assessments and penetration testing to identify and mitigate security risks.",
      },
      {
        image: "/assets/images/cyber.png",
        description:
          "Proficient in building secure web applications with React.js and implementing security best practices.",
      },
    ],
    "Front-end": [
      {
        image: "/assets/images/frontend.png",
        title: "HTML&CSS",
        description:
          "Proficient in creating responsive and accessible web interfaces with HTML and CSS.",
      },
      {
        image: "/assets/images/frontend.png",
        title: "Javascript",
        description:
          "Skilled in using JavaScript to build dynamic, interactive, and user-friendly web experiences",
      },
      {
        image: "/assets/images/frontend.png",
        title: "React JS",
        description:
          "Proficient in building dynamic web apps using React.js and reusable components",
      },
      {
        image: "/assets/images/frontend.png",
        title: "Figma",
        description:
          "Proficient in building dynamic web apps using React.js and reusable components",
      },
    ],
    "Back End": [
      {
        image: "/assets/images/backend.png",
        title: "Node JS",
        description:
          "Skilled in developing fast, scalable server-side applications using Node.js",
      },
      {
        image: "/assets/images/backend.png",
        title: "Django",
        description:
          "Experienced in building robust, secure web applications using Django framework.",
      },
      {
        image: "/assets/images/backend.png",
        title: "Spring Boot",
        description:
          "Proficient in developing scalable, production-ready applications using Spring Boot.",
      },
    ],
  };

  const displayContent = showAllTopics
    ? contentData
    : { [activeTopic]: contentData[activeTopic as keyof ContentData] };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Yellow Header Bar */}
      <div className="bg-yellow-400 h-20 w-full flex items-center px-6"></div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Search */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-semibold text-gray-800">Blog</h1>
            <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <span className="text-lg font-semibold text-blue-600">
                Topics
              </span>
              <span className="text-lg font-semibold text-blue-600">▼</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for articles"
              className="w-80 px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Topic Filter Buttons */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => {
              setActiveTopic("Cyber security");
              setShowAllTopics(false);
            }}
            className={`px-6 py-2.5 text-lg rounded-lg min-w-[120px] ${
              activeTopic === "Cyber security" && !showAllTopics
                ? "bg-blue-800 text-white"
                : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Cyber security
          </button>

          <button
            onClick={() => {
              setActiveTopic("Front-end");
              setShowAllTopics(false);
            }}
            className={`px-6 py-2.5 text-lg rounded-lg min-w-[120px] ${
              activeTopic === "Front-end" && !showAllTopics
                ? "bg-blue-800 text-white"
                : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Front-end
          </button>

          <button
            onClick={() => {
              setActiveTopic("Back End");
              setShowAllTopics(false);
            }}
            className={`px-6 py-2.5 text-lg rounded-lg min-w-[120px] ${
              activeTopic === "Back End" && !showAllTopics
                ? "bg-blue-800 text-white"
                : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Back End
          </button>

          <button
            onClick={() => {
              setShowAllTopics(!showAllTopics);
              if (!showAllTopics) setActiveTopic("");
            }}
            className={`px-6 py-2.5 text-lg rounded-lg min-w-[120px] ${
              showAllTopics
                ? "bg-blue-800 text-white"
                : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"
            }`}
          >
            View All
          </button>
        </div>

        {/* Content Sections */}
        {Object.entries(displayContent).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(items as ContentItem[]).map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  {item.image && (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title || "Blog post image"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {item.title && (
                      <h3 className="text-lg font-medium text-gray-800 mb-3">
                        {item.title}
                      </h3>
                    )}
                    <p className="text-sm text-gray-600 mb-4">
                      {item.description}
                    </p>
                    <button
                      style={{ backgroundColor: "#5745B2" }}
                      className="text-lg text-white px-4 py-2 hover:text-gray rounded-md font-medium"
                    >
                      view more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDesign;
