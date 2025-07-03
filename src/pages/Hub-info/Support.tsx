const SupportCard = () => {
  return (
    <section className="min-h-[50vh] flex items-center justify-center p-4 bg-white">
      <div className="max-w-4xl w-full mx-auto p-10  text-center font-sans shadow-md border">
        <h2
          style={{ color: "#002B56" }}
          className="text-3xl font-semibold mb-6"
        >
          Still have questions?
        </h2>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Can't find the answer you're looking for? Please chat with our
          friendly team.
        </p>

        <button className="bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 rounded-3xl transition-colors duration-200 ease-in-out text-lg">
          Chat with us →
        </button>
      </div>
    </section>
  );
};

export default SupportCard;
