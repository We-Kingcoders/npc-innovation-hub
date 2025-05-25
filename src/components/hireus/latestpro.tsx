function latestPro() {
  return (
    <section className="m-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Our Latest Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src="../hireus/dev.webp"
          alt="Work Image 1"
          className="w-full h-400 rounded-xl shadow-lg object-cover border border-blue-400"
        />
        <img
          src="../hireus/anal.webp"
          alt="Work Image 2"
          className="w-full h-400 rounded-xl shadow-lg object-cover border border-blue-400"
        />
        <img
          src="../hireus/cyber.webp"
          alt="Work Image 3"
          className="w-full h-400 rounded-xl shadow-lg object-cover border border-blue-400"
        />
        <img
          src="../hireus/mang.webp"
          alt="Work Image 4"
          className="w-full h-400 rounded-xl shadow-lg object-cover border border-blue-400"
        />
      </div>
    </section>
  );
}

export default latestPro;
