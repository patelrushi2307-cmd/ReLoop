import { FeatureCards } from "@/components/sections/FeatureCards";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Nav } from "@/components/sections/Nav";
import { Preloader } from "@/components/sections/Preloader";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { StageReachStacker } from "@/components/sections/StageReachStacker";
import { StageTruck } from "@/components/sections/StageTruck";
import { StatsBand } from "@/components/sections/StatsBand";
import { UtilityBar } from "@/components/sections/UtilityBar";

export default function Page() {
  return (
    <>
      <Preloader />
      <UtilityBar />
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <StatsBand />
        <StageReachStacker />
        <ServicesGrid />
        <StageTruck />
        <FeatureCards />
      </main>
    </>
  );
}
