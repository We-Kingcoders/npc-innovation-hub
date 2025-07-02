function LetTalk() {
  return (
    <div className="bg-white-100 min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center min-h-screen bg-white-100 p-4 sm:p-6 md:p-8 ">
        <div className="bg-blue-900 text-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 lg:p-12 max-w-md w-fullborder border-blue-300 rounded-lg shadow-lg">
          {/* Header: Let's talk */}
          <div className="flex items-center mb-8">
            {/* Chat icon */}
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            <h2 className="text-3xl sm:text-4xl font-bold">Let's talk</h2>
          </div>

          {/* Contact details */}
          <div className="space-y-8">
            {/* Location */}
            <div className="flex items-start">
              <a
                href="https://www.google.com/maps/place/Musanze,+Rwanda"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start hover:bg-blue-800 rounded-lg p-2 transition"
              >
                {/* Location icon */}

                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 mr-4 text-blue-300 flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657m10.614-10.614L13.414 2.9a1.998 1.998 0 00-2.828 0L6.343 6.043m10.614 10.614A8.967 8.967 0 0012 21.5c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
                  ></path>
                </svg>
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                    Our location
                  </h3>
                  <p className="text-lg text-blue-200">
                    Musanze, North, Rwanda{" "}
                  </p>
                </div>
              </a>
            </div>

            {/* Email address */}
            <div className="flex items-start">
              {/* Email icon */}
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 mr-4 text-blue-300 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 4v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7"
                ></path>
              </svg>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                  Email address
                </h3>
                <a href="https://www.npc.ie/news-events/npc-innovation-award-2024">
                  {" "}
                  kingcoders@programmers.com
                </a>
              </div>
            </div>

            {/* Telephone */}
            <div className="flex items-start">
              {/* Phone icon */}
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 mr-4 text-blue-300 flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.135a11.042 11.042 0 005.516 5.516l1.135-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                ></path>
              </svg>
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                  Telephone
                </h3>
                <p className="text-lg text-blue-200">+250 783 330 443</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 lg:p-12 my-16 border border-gray-200 ml-0 md:ml-8 lg:ml-16">
        {/* Centered heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Let's talk
        </h2>

        {/* Left-aligned form with max-width */}
        <form className="max-w-xl space-y-6">
          {/* Work Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              WORK EMAIL*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              FIRST NAME*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Your first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              LAST NAME*
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Your last name"
            />
          </div>

          {/* Company Name */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              COMPANY NAME*
            </label>
            <input
              type="text"
              id="company"
              name="company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder=""
            />
          </div>

          {/* Job Title */}
          <div>
            <label
              htmlFor="job"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              JOB TITLE*
            </label>
            <input
              type="text"
              id="job"
              name="job"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder=""
            />
          </div>

          {/* Country Select */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              COUNTRY*
            </label>
            <select
              id="country"
              name="country"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="" disabled selected>
                Select your country
              </option>
              {/* Keep all your country options here */}
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              MESSAGE*
            </label>
            <textarea
              id="message"
              name="message"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Your message..."
            ></textarea>
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start bg-white rounded-lg shadow-md p-4 border border-gray-300">
            <input
              type="checkbox"
              id="consent"
              name="consent"
              className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3 mt-1 cursor-pointer"
            />
            <label
              htmlFor="consent"
              className="text-gray-700 text-sm leading-relaxed"
            >
              I understand that Hub will process my information in accordance
              with their{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms and Conditions
              </a>
              . I may withdraw my consent through unsubscribe links at any time.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          >
            Submit
          </button>
        </form>
      </section>
    </div>
  );
}
export default LetTalk;
