import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Programs } from "@/components/Programs";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Programs />
    </main>
  );
}
