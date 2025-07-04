import React from "react";

const logos = [
  { src: "https://cdn.worldvectorlogo.com/logos/kpmg-1.svg", alt: "KPMG" },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSc6-_25ZUi4O2VVXDLq9ggcbom4ipXK-_f2Q&s",
    alt: "accenture",
  },
  {
    src: "https://bs-uploads.toptal.io/blackfish-uploads/public-files/toptal-logo-f2f871d16892f5b8859b0822fa740cc3.png",
    alt: "Toptal",
  },
  {
    src: "https://logowik.com/content/uploads/images/cognizant-new-20223302.jpg",
    alt: "cognizant",
  },
  {
    src: "https://cdn.iconscout.com/icon/free/png-256/free-deloitte-logo-icon-download-in-svg-png-gif-file-formats--company-brand-world-logos-vol-5-pack-icons-282445.png",
    alt: "Deloitte",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDH3D_sFxInIWvLdh8-BK-xaKw7YpUcwhDaA&s",
    alt: "Capgemini",
  },
];

const TrustedBy: React.FC = () => (
  <div className="max-w-6xl mx-auto my-12 text-center">
    <h3 className="text-xl font-bold mb-4">TRUSTED BY</h3>
    <div className="flex flex-wrap justify-center gap-6 ">
      {logos.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          className="h-20 mt-4 object-contain bg-white px-4 py-2 rounded"
        />
      ))}
    </div>
  </div>
);

export default TrustedBy;
