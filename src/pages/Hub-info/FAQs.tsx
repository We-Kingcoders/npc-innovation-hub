import { useState } from "react";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What does the Innovation Hub specialize in?",
      answer:
        "We specialize in full-stack development—creating complete web and mobile applications from front-end to back-end. Additionally, we integrate cybersecurity practices into our development process to ensure secure and reliable digital solutions.",
      level: 2, // h2
    },
    {
      question: "How does the Innovation Hub ensure security in its projects?",
      answer: "",
      level: 2, // h2
    },
    {
      question: "What technologies do you use in full-stack development?",
      answer: "",
      level: 3, // h3
    },
    {
      question: "Can the Innovation Hub handle both design and deployment?",
      answer: "",
      level: 2, // h2
    },
  ];

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-[#F3F9FB] p-14 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center py-16">
          Frequently Asked Questions (FAQs)
        </h1>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden" // White background for entire card
            >
              <button
                onClick={() => toggleAnswer(index)}
                className="w-full text-left flex justify-between items-center focus:outline-none p-6" // Added padding here
              >
                <div className="flex items-center">
                  {/* White label background for the question */}
                  <div className="bg-white px-4 py-2 rounded-md">
                    {faq.level === 2 ? (
                      <h2 className="text-xl font-semibold text-gray-800">
                        {faq.question}
                      </h2>
                    ) : (
                      <h3 className="text-lg font-semibold text-gray-800 pl-4">
                        {faq.question}
                      </h3>
                    )}
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${activeIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeIndex === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer || (
                    <p className="italic text-gray-500">Answer coming soon</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
