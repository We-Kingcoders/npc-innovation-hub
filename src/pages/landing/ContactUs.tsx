// src/pages/landing/ContactUs.tsx
//
// The standalone /contact-us page: a hero banner wrapping the same
// ContactSection shown inline on Home's scrollable story (see
// AllRoutes.tsx's "/" route), so a direct link or bookmark to this page
// shows identical content to what's reachable by scrolling.
import ContactSection from "./ContactSection";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-[#f4f7fc]">
      {/* Hero banner - navy, matching the site's brand color everywhere else. */}
      <div className="bg-[#002B56] py-16 px-4 md:px-8 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Contact Us
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto text-lg">
          Have a question, or want to reach NPC Innovation Hub directly? Here is
          how to find us.
        </p>
      </div>

      <div className="py-16">
        <ContactSection />
      </div>
    </div>
  );
};

export default ContactUs;
