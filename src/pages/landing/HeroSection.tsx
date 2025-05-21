

const HeroSection = () => {
  return (
    <div className="w-full min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Diagonal Blue Background */}
      <div
        className="absolute top-0 right-0 h-full w-[58vw] bg-[#002B56] z-0"
        style={{
          clipPath: 'polygon(22vw 0,100% 0,100% 100%,0% 100%)'
        }}
      ></div>

{/* Navigation */}
<header className="relative z-10 flex items-center justify-between px-24 pt-8 pb-2">
  <div className="font-bold text-[2rem] text-[#002B56]">NpcInnovationHub</div>
  <nav className="flex items-center space-x-4 ml-64">
    <a href="#" className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3] border-b-2 border-[#00A0E3]">Home</a>
    <a href="#" className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]">AboutHub</a>
    <a href="#" className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]">Members</a>
    <a href="#" className="text-[#002B56] font-medium px-3 py-1 text-[1.25rem] hover:text-[#00A0E3] focus:text-[#00A0E3]">Projects</a>
  </nav>
  <button className="ml-auto bg-white text-[#002B56] font-semibold px-6 py-2 rounded-full shadow text-[1.125rem] border border-[#E5EAF2] hover:bg-[#f2f7fb] transition">
    Sign In
  </button>
</header>


      {/* Main Layout */}
      <main className="flex-1 flex relative z-10">
        {/* Left Section */}
        <section className="flex flex-col justify-center w-[44vw] pl-[5vw] pt-[3vw] pb-[3vw] ">
          <h1 className="text-[#29476E] font-bold text-[2.4rem] md:text-[2.7rem] leading-tight mb-3 tracking-tight">
            Empowering<br />Developers,<br />Driving<br />Innovation.
          </h1>
          <p className="mt-2 text-[#283D4B] text-[1.15rem] font-normal mb-7 max-w-[400px]">
            A student-led space for creating<br />innovative, real-world tech<br />solutions.
          </p>
          <p>
          <button className="rounded-full border border-[#00A0E3] text-[#00A0E3] px-8 py-2 font-semibold text-[1.1rem] hover:bg-[#ECF7FC] transition shadow-sm">
            Join Us
          </button>
          </p>
        </section>

            {/* Center Image */}
            <div className="absolute left-[42vw] top-[5vw] z-20">
            <div className="rounded-[18px] overflow-hidden shadow-lg w-[798px] h-[650px]">
                <img
                src="/public/assets/images/hero.png"
                alt="Developer working on laptop"
                className="w-full h-full object-cover"
                draggable={false}
                />
            </div>
            </div>







        {/* Bottom Right Text */}
        <div className="absolute right-[5vw] bottom-[5vw] z-30 text-right">
          <p className="text-[2.2rem] md:text-[2.7rem] font-bold select-none">
            <span className="text-[#002B56] pr-24">Innovate.</span>{''}
            <span className="text-[#00A0E3]">Create.</span><br />
            <span className="text-[#00A0E3]">Lead.</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;