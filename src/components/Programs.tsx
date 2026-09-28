"use client";

import { motion } from "framer-motion";
import { RevealWrapper, RevealItem } from "./RevealWrapper";
import { useState } from "react";

const programs = [
  {
    title: "Global Hackathons",
    description: "48 hours to build something awesome. Compete, collaborate, and win prizes.",
    tag: "Monthly",
    color: "var(--color-shipit-purple)"
  },
  {
    title: "1:1 Mentorship",
    description: "Get paired with experienced builders who can guide your project.",
    tag: "Ongoing",
    color: "var(--color-shipit-blue)"
  },
  {
    title: "Game Jams",
    description: "Build a game from scratch over the weekend based on a secret theme.",
    tag: "Quarterly",
    color: "var(--color-shipit-red)"
  },
  {
    title: "STEM Workshops",
    description: "Deep dives into AI, Web Dev, hardware, and everything in between.",
    tag: "Weekly",
    color: "var(--color-shipit-yellow)"
  }
];

export function Programs() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <RevealWrapper className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How we build.</h2>
          <p className="text-xl text-gray-600">Everything you need to accelerate your journey.</p>
        </RevealWrapper>

        <RevealWrapper staggerChildren delay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programs.map((program, i) => (
            <RevealItem key={i}>
              <motion.div
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="interactive relative overflow-hidden bg-white p-8 rounded-3xl border-2 border-gray-100 group transition-colors"
                style={{
                  borderColor: hoveredIndex === i ? program.color : "#f3f4f6"
                }}
              >
                {/* 3D tilt effect could go here, for now using simple scale/color transitions */}
                <div className="relative z-10">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4"
                    style={{ backgroundColor: `${program.color}20`, color: program.color }}
                  >
                    {program.tag}
                  </span>
                  <h3 className="text-3xl font-bold mb-4">{program.title}</h3>
                  <p className="text-gray-600 text-lg mb-8">{program.description}</p>
                  
                  <div className="flex items-center text-sm font-bold uppercase tracking-wider" style={{ color: program.color }}>
                    Learn More <motion.span className="ml-2" animate={{ x: hoveredIndex === i ? 5 : 0 }}>→</motion.span>
                  </div>
                </div>
                
                {/* Background wash on hover */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300"
                  style={{ backgroundColor: program.color }}
                />
              </motion.div>
            </RevealItem>
          ))}
        </RevealWrapper>
      </div>
    </section>
  );
}
