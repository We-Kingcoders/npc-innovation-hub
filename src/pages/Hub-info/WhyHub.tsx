const WhyHub = () => {
  return (
    <div className="bg-[#E8FDF5] p-14 h-100">
      <div className="max-w-6xl mx-auto py-12 ">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center py-6">
          Why NpclnnovationHub?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cybersecurity Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[350px] flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Innovation Hub Cyber security
            </h3>
            <p className="italic mb-3 text-gray-600">
              Innovators in Digital Security.
            </p>
            <div className="flex-grow">
              <p className="text-gray-700 mb-3">
                As a team focused on cybersecurity, we've learned to tackle
                threats with creative approaches and bring innovative solutions
                to protect data and systems.
              </p>
              <p className="text-purple-700">
                We're truly excited for the chance to develop new technologies
                and help build a safer digital world for everyone.
              </p>
            </div>
          </div>

          {/* Front-End Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[350px] flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Innovation Hub Front-End
            </h3>
            <p className="italic mb-3 text-gray-600">
              Creators of Engaging Digital Experiences
            </p>
            <div className="flex-grow">
              <p className="text-gray-700 mb-3">
                We specialize in designing and developing user-friendly,
                responsive interfaces that connect users with technology
                seamlessly. With a focus on usability, accessibility.
              </p>
              <p className="text-purple-700">
                Performance, we turn ideas into interactive, visually compelling
                digital experiences. Using modern frameworks and design
                principles, we bring innovation to life on every screen.
              </p>
            </div>
          </div>

          {/* Back-End Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[350px] flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Innovation Hub Back-End
            </h3>
            <p className="italic mb-3 text-gray-600">
              Architects of Scalable and Secure Systems
            </p>
            <div className="flex-grow">
              <p className="text-gray-700 mb-3">
                We focus on building the core logic, databases, and server-side
                systems that power reliable and high-performing applications.
                Our team ensures data security.
              </p>
              <p className="text-purple-700">
                And seamless integration across platforms. With expertise in
                APIs, cloud infrastructure, and system architecture, we deliver
                robust back-end solutions that support innovation from behind
                the scenes.
              </p>
            </div>
          </div>
        </div>
        <section className="mb-8 text-center p-14">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">TRUSTED BY</h2>
          <div className="flex flex-wrap justify-center items-center gap-16">
            <img
              src="../public/assets/images/image 61.png"
              alt="Company Logo 1"
              className="h-12 opacity-75 hover:opacity-100 transition-opacity"
            />
            <img
              src="../public/assets/images/image 66.jpg"
              alt="Company Logo 2"
              className="h-14 opacity-75 hover:opacity-100 transition-opacity"
            />
            <img
              src="../public/assets/images/image 67.jpg"
              alt="Company Logo 3"
              className="h-12 opacity-75 hover:opacity-100 transition-opacity"
            />
            <img
              src="../public/assets/images/image 68.png"
              alt="Company Logo 4"
              className="h-26 opacity-75 hover:opacity-100 transition-opacity"
            />
            <img
              src="../public/assets/images/image 69.png"
              alt="Company Logo 5"
              className="h-26 opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default WhyHub;
