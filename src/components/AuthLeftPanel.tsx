// src/components/AuthLeftPanel.tsx
//
// The shared left-side panel for every auth page (Login, Sign Up, OTP
// Verification). Previously each page had its own hand-rolled copy of this
// panel - Login/SignUp used the real hubimage.jpg with no text, while OTP
// still used an old Unsplash stock photo, cyan-colored "Innovate. Create.
// Lead." text, and emoji "icons" in mismatched blue/green/purple circles.
// Genuinely different pages, not just visually out of sync. One shared
// component now means the three auth pages can't drift apart again.
//
// The feature highlights only render at md+, where there's actually room
// to read them - below that the panel is just the plain photo (shown on
// every device, not hidden on mobile), matching the earlier "image visible
// on every device, no forced scrolling" direction.
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Rocket, Lightbulb, Users } from "lucide-react";

// Shared background for the form column on every auth page - was a flat
// backgroundColor: "#002B56" (solid navy block), visually two disconnected
// halves next to this panel's photo. A navy-tinted layer of the same photo
// instead, so the photo reads as covering the whole page and the form
// column stays branded navy without being a flat, separate color block.
export const AUTH_RIGHT_PANEL_BACKGROUND: CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(0,43,86,0.55), rgba(0,43,86,0.55)), url('/assets/images/hubimage.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

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

export default function AuthLeftPanel() {
  return (
    <div className="h-40 sm:h-56 md:h-auto md:w-1/2 flex-shrink-0 relative">
      {/* Decorative photo + contrast overlay - aria-hidden, the tagline and
          feature text below are the panel's real accessible content. The
          gradient stays dark only on the left, where the text sits, so the
          photo itself is still clearly visible across the rest of the
          panel. */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/hubimage.jpg')" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent"
        aria-hidden="true"
      />

      <div className="hidden md:flex relative z-10 h-full items-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="space-y-4">
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
      </div>
    </div>
  );
}
