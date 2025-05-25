import "./index.css";
import { useEffect, useRef } from "react";

function HireUsHero() {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const shadowsRef = useRef<HTMLSpanElement[]>([]);

  // Initialize ref arrays
  useEffect(() => {
    imagesRef.current = [];
    shadowsRef.current = [];
  }, []);

  // Generate custom border radii
  const generateBorderRadius = () => {
    const values = [];
    for (let i = 0; i < 11; i++) {
      const val1 = 50 + Math.random() * 50;
      const val2 = 50 + Math.random() * 50;
      const val3 = 50 + Math.random() * 50;
      const val4 = 50 + Math.random() * 50;
      values.push(`${val1}% ${val2}% ${val3}% ${val4}%`);
    }
    return values;
  };

  const borderRadiusValues = generateBorderRadius();

  // Animation definitions
  const getRandomAnimation = (index: number) => {
    const animations = [
      {
        keyframes: `
          @keyframes float${index} {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(${Math.random() * 10 - 5}deg); }
          }
        `,
        animation: `float${index} ${3 + Math.random() * 4}s ease-in-out infinite`,
      },
      {
        keyframes: `
          @keyframes pulse${index} {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `,
        animation: `pulse${index} ${4 + Math.random() * 3}s ease-in-out infinite`,
      },
      {
        keyframes: `
          @keyframes wobble${index} {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-5px) rotate(-2deg); }
            75% { transform: translateX(5px) rotate(2deg); }
          }
        `,
        animation: `wobble${index} ${5 + Math.random() * 2}s ease-in-out infinite`,
      },
      {
        keyframes: `
          @keyframes drift${index} {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); }
            50% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); }
            75% { transform: translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px); }
          }
        `,
        animation: `drift${index} ${6 + Math.random() * 4}s ease-in-out infinite`,
      },
    ];
    return animations[index % animations.length];
  };

  // Inject animations on mount
  useEffect(() => {
    const styleElement = document.createElement("style");
    let styleContent = "";

    imagesRef.current.forEach((_, index) => {
      const anim = getRandomAnimation(index);
      styleContent += anim.keyframes;
    });

    styleElement.innerHTML = styleContent;
    document.head.appendChild(styleElement);

    imagesRef.current.forEach((img, index) => {
      const anim = getRandomAnimation(index);
      if (img) img.style.animation = anim.animation;
      if (shadowsRef.current[index]) {
        shadowsRef.current[index].style.animation = anim.animation;
      }
    });

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Assign refs
  const setImageRef = (el: HTMLImageElement | null, index: number) => {
    if (el) imagesRef.current[index] = el;
  };

  const setShadowRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) shadowsRef.current[index] = el;
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-[80vh] bg-white-800 p-10 md:p-20 w-full text-white overflow-hidden">
      {/* Left Text Content */}
      <div className="md:w-1/3 mb-10 md:mb-0">
        <h2 className="text-4xl  text-black font-bold mb-4 capitalize tracking-wide leading-tight">
          Our Hire Us Process:
          <br />
          <span className="text-indigo-400">From Planning to</span>
          <br />
          Deployment.
        </h2>
        <p className="mb-8 text-gray-600 leading-relaxed">
          We handle your project from planning to deployment
          <br />
          with professional, end-to-end solutions tailored
          <br />
          to your needs.
        </p>
        <button
          className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-semibold px-6 py-3 rounded shadow-lg"
          style={{ borderRadius: "35px" }}
        >
          <a href="https://ughe.org/innovation-center-ughe">More Info</a>
        </button>
      </div>

      {/* Right Floating Images */}
      <div className="relative md:w-2/3 h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {[...Array(11)].map((_, index) => {
            const top = Math.random() * 80; // % from top
            const left = Math.random() * 80; // % from left
            const size = 60 + Math.random() * 40; // 60-100px
            return (
              <div
                key={index}
                className="absolute"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              >
                <img
                  ref={(el) => setImageRef(el, index)}
                  src="/hireus/hum.jpg"
                  alt={`Hire Us Process Step ${index + 1}`}
                  className="relative z-10 w-full h-full object-cover"
                  style={{
                    borderRadius: borderRadiusValues[index],
                    filter: "brightness(1.05)",
                    willChange: "transform",
                  }}
                />
                <span
                  ref={(el) => setShadowRef(el, index)}
                  className="absolute inset-0 bg-indigo-900 opacity-30 blur-md"
                  style={{
                    borderRadius: borderRadiusValues[index],
                    transform: "translate(5px, 5px)",
                    animationDelay: `${index * 0.1}s`,
                    willChange: "transform",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HireUsHero;
