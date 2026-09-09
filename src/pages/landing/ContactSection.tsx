// src/pages/landing/ContactSection.tsx
//
// The actual "how to reach us" content - a navy info card on the left
// (location/phone/email, matching the /hire-us form's existing contact
// card layout) and, on the right, a real working message form plus a
// chat option. Used both inline on Home (as part of the single-page
// scroll story) and wrapped with a hero banner on the standalone
// /contact-us page (see ContactUs.tsx) - same reuse pattern as
// AboutIntro/MissionSection.
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";

const HUB_LOCATION = "Musanze, North, Rwanda";
const HUB_PHONE = "+250 783 330 443";
const HUB_PHONE_HREF = "tel:+250783330443";
const HUB_EMAIL = "npcinnovationhub2024@gmail.com";
const HUB_EMAIL_HREF = `mailto:${HUB_EMAIL}?subject=${encodeURIComponent("Message from the NPC Innovation Hub website")}`;

const ContactSection = () => {
  return (
    <div className="container mx-auto max-w-5xl px-4 md:px-8">
      <div className="flex flex-col md:flex-row rounded-xl shadow-lg overflow-hidden">
        {/* Left - Info card */}
        <div className="bg-[#002B56] text-white p-8 md:w-2/5 flex flex-col">
          <h3 className="text-2xl font-bold mb-3">Get in Touch</h3>
          <p className="text-white/70 mb-8">
            Have a question about NPC Innovation Hub, a project, or joining us?
            Reach out directly, or send a message and we&apos;ll get back to
            you.
          </p>

          <div className="space-y-6 mt-auto">
            <div className="flex items-start gap-3">
              <MapPin
                className="w-5 h-5 text-[#00A0E3] mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Our Location</p>
                <p className="text-white/70 text-sm">{HUB_LOCATION}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone
                className="w-5 h-5 text-[#00A0E3] mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Telephone</p>
                <a
                  href={HUB_PHONE_HREF}
                  className="text-white/70 text-sm hover:text-white hover:underline"
                >
                  {HUB_PHONE}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail
                className="w-5 h-5 text-[#00A0E3] mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="font-semibold text-sm">Email Address</p>
                <a
                  href={HUB_EMAIL_HREF}
                  className="text-white/70 text-sm hover:text-white hover:underline"
                >
                  {HUB_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Message form + chat option */}
        <div className="bg-white p-8 md:w-3/5 flex flex-col gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#002B56] mb-4">
              Send a Message
            </h3>
            {/* Opens the visitor's email client with these fields pre-filled -
                works without a backend endpoint. The direct email above is
                the fallback for anyone whose device has no mail client set
                up. */}
            <form
              action={HUB_EMAIL_HREF}
              method="post"
              encType="text/plain"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="Name"
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#00A0E3] focus:ring-2 focus:ring-[#00A0E3]/10"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="Email"
                    type="email"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#00A0E3] focus:ring-2 focus:ring-[#00A0E3]/10"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="Message"
                  required
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm outline-none resize-y focus:border-[#00A0E3] focus:ring-2 focus:ring-[#00A0E3]/10"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-[#002B56] text-white font-semibold py-3 rounded-lg hover:bg-[#003366] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A0E3] focus:ring-offset-2"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Send Message
              </button>
            </form>
          </div>

          <div className="border-t border-gray-100 pt-6 flex items-start gap-3">
            <MessageCircle
              className="w-5 h-5 text-[#00A0E3] mt-0.5 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-[#002B56] text-sm">
                Prefer to chat?
              </p>
              <p className="text-gray-600 text-sm mb-1">
                Get an instant answer from our assistant.
              </p>
              <Link
                to="/chat-with-us"
                className="text-[#00A0E3] font-semibold text-sm hover:underline"
              >
                Start a chat →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
