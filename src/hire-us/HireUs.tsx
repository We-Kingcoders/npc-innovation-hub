import HireUsHero from "../components/hireus/hero";
import Partners from "../components/hireus/partners";
import LatestPro from "../components/hireus/latestpro";
import LetTalk from "../components/hireus/form";
import Services from "../components/hireus/services";

function HireUs() {
  return (
    <>
      <HireUsHero />
      <Services />
      <Partners />
      <LatestPro />
      <LetTalk />
    </>
  );
}

export default HireUs;
