// src/pages/landing/ContactUs.tsx
//
// A dedicated, Navbar-linked "how to reach us" page. Location and phone
// are confirmed real (the same values already shown on the /hire-us
// form's contact card) - email is intentionally left unset rather than
// reusing that page's "kingcoders@programmers.com", which reads like a
// leftover dev-team placeholder (it matches the GitHub org name
// "We-Kingcoders"), not a real Hub address. Fill HUB_EMAIL in once
// confirmed and the row below appears automatically.
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HUB_LOCATION = "Musanze, North, Rwanda";
const HUB_PHONE = "+250 783 330 443";
const HUB_PHONE_HREF = "tel:+250783330443";
const HUB_EMAIL = ""; // TODO(content): set once the real Hub email is confirmed.

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

      <div className="container mx-auto max-w-3xl px-4 md:px-8 py-16">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          <div className="flex items-start gap-4 p-6">
            <MapPin
              className="w-6 h-6 text-[#00A0E3] mt-1 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-[#002B56] mb-1">
                Our Location
              </h2>
              <p className="text-gray-600">{HUB_LOCATION}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6">
            <Phone
              className="w-6 h-6 text-[#00A0E3] mt-1 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-[#002B56] mb-1">Telephone</h2>
              <a
                href={HUB_PHONE_HREF}
                className="text-gray-600 hover:text-[#00A0E3] hover:underline"
              >
                {HUB_PHONE}
              </a>
            </div>
          </div>

          {HUB_EMAIL && (
            <div className="flex items-start gap-4 p-6">
              <Mail
                className="w-6 h-6 text-[#00A0E3] mt-1 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-semibold text-[#002B56] mb-1">
                  Email Address
                </h2>
                <a
                  href={`mailto:${HUB_EMAIL}`}
                  className="text-gray-600 hover:text-[#00A0E3] hover:underline"
                >
                  {HUB_EMAIL}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-start gap-4 p-6">
            <MessageCircle
              className="w-6 h-6 text-[#00A0E3] mt-1 flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-semibold text-[#002B56] mb-1">
                Chat with Us
              </h2>
              <p className="text-gray-600 mb-2">
                Get an instant answer from our assistant.
              </p>
              <Link
                to="/chat-with-us"
                className="text-[#00A0E3] font-semibold hover:underline"
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

export default ContactUs;
