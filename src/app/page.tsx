import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { WhatWeDo } from "@/components/WhatWeDo";
import { Experiences } from "@/components/Experiences";
import { Calendar } from "@/components/Calendar";
import { FinalBoss } from "@/components/FinalBoss";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <Manifesto />
      <WhatWeDo />
      <Experiences />
      <Calendar />
      <FinalBoss />
      <Footer />
    </main>
  );
}
