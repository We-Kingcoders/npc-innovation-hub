import "./index.css";
import HeroSection from "./pages/landing/HeroSection";
import HubMembersSection from "./pages/landing/HubMembersSection";
import Expertise from "./pages/landing/Expertise";
import Skills from "./pages/landing/Skills";
import Mission from "./pages/landing/Mission";
import TeamCaptain from "./pages/landing/TeamCaptain";
import Footer from "./components/button/Footer";
export default function App() {
  return (
    <>
    < HeroSection />
    < HubMembersSection />
    < Expertise />
    < Skills />
    < Mission />
    < TeamCaptain />
    < Footer />
    </>
  );
}
