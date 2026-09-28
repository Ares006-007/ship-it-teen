import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Programs } from "@/components/Programs";
import { Projects } from "@/components/Projects";
import { Community } from "@/components/Community";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Programs />
      <Projects />
      <Community />
    </main>
  );
}
