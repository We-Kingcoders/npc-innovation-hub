export default function Services() {
  const services = [
    {
      title: "System Development",
      description:
        "Our developers build high-quality, scalable systems leveraging latest technologies and best practices.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 18l6-6-6-6M8 6l-6 6 6 6"
          ></path>
        </svg>
      ),
    },
    {
      title: "Project Management",
      description:
        "Our skilled project managers coordinate tasks, schedules, and resources to keep the project on track and within budget.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-1.5l-.71-1.42A2 2 0 0012.18 3h-.36a2 2 0 00-1.79 1.58L9.32 5H7.5A2 2 0 005.5 7v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      title: "System Analyst",
      description:
        "Our system analysts work closely with you to refine requirements, design workflows, and ensure technical feasibility.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Cybersecurity",
      description:
        "We deliver expert cybersecurity solutions to protect your systems and data with confidence.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354l6.364 2.122A2 2 0 0120 8.236V12c0 5.25-7 8-8 8s-8-2.75-8-8V8.236a2 2 0 011.636-1.76L12 4.354zm0 0v7m0 0l3 3m-3-3l-3 3"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <section className="m-12 p-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 text-center border border-blue-200"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mt-5 mb-6">
              {service.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-blue-800">
              {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
