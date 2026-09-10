// src/components/AuthPageMain.tsx
//
// The shared page frame for every auth page (Login, Sign Up, OTP
// Verification, Forgot Password). Previously each page had its own
// hand-rolled copy of a two-column layout - a plain, strongly-gradiented
// photo on the left and a separately-tinted copy of the same photo behind
// the form on the right, visually two different backgrounds stitched
// together rather than one. Now it's a single hubimage.jpg + navy-tint
// backdrop behind the whole row, with the feature highlights and the form
// (passed as children) both floating on top of it as one consistent
// surface - the two-sided look is gone, by construction, everywhere this
// is used.
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Rocket, Lightbulb, Users } from "lucide-react";

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Rocket,
    title: "Innovate Together",
    text: "Collaborate with like-minded creators",
  },
  {
    icon: Lightbulb,
    title: "Create Solutions",
    text: "Build projects that make a difference",
  },
  {
    icon: Users,
    title: "Lead Communities",
    text: "Inspire and guide fellow innovators",
  },
];

export default function AuthPageMain({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="relative flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden"
    >
      {/* One shared background for the entire row - photo + navy tint,
          decorative (aria-hidden), behind both the feature highlights and
          the form. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hubimage.jpg')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[#002B56]/55" aria-hidden="true" />

      {/* Feature highlights - only at md+, where there's room to read them;
          below that it's just the shared backdrop behind the form. */}
      <div className="hidden md:flex relative z-10 md:w-1/2 items-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex items-center gap-4 backdrop-blur-sm bg-white/10 p-4 rounded-lg"
            >
              <div className="w-11 h-11 flex-shrink-0 bg-[#00A0E3] rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{title}</h3>
                <p className="text-gray-200 text-sm">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form column - content passed in per page. overflow-y-auto is a
          fallback that lets this column scroll on its own on an unusually
          short viewport. */}
      <div className="relative z-10 flex-1 md:w-1/2 min-h-0 overflow-y-auto flex items-center justify-center p-4 sm:p-8">
        {children}
      </div>
    </main>
  );
}
