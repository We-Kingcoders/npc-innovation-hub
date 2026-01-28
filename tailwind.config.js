// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./index.html",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom NpcInnovationHub brand colors
        npc: {
          navy: {
            DEFAULT: "#002B56",
            light: "#003366",
            dark: "#001f3f",
          },
          blue: {
            DEFAULT: "#00A0E3",
            light: "#00B8FF",
            dark: "#0090D0",
          },
          text: {
            primary: "#29476E",
            secondary: "#283D4B",
          },
        },
        // Additional semantic colors
        background: {
          primary: "#FFFFFF",
          secondary: "#F8FAFC",
          accent: "#ECF7FC",
        },
        border: {
          light: "#E5EAF2",
          DEFAULT: "#CBD5E1",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // Custom font sizes matching design
        hero: ["3.25rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "hero-mobile": [
          "2.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em" },
        ],
        tagline: ["2.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "tagline-mobile": ["2rem", { lineHeight: "1.3" }],
      },
      spacing: {
        // Custom spacing values
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 43, 86, 0.08)",
        medium: "0 4px 16px rgba(0, 43, 86, 0.12)",
        strong: "0 8px 32px rgba(0, 43, 86, 0.16)",
        hero: "0 20px 60px rgba(0, 43, 86, 0.2)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      transitionDuration: {
        400: "400ms",
      },
      backdropBlur: {
        xs: "2px",
      },
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
