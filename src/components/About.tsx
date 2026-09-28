"use client";

import { motion } from "framer-motion";
import { RevealWrapper, RevealItem } from "./RevealWrapper";
import { Hammer, BookOpen, Rocket, Users } from "lucide-react";

export function About() {
  const pillars = [
    {
      title: "Build",
      description: "Stop watching tutorials. Start writing code. We focus on building real projects from day one.",
      icon: <Hammer className="w-8 h-8 text-[var(--color-shipit-blue)]" />,
      color: "var(--color-shipit-blue)"
    },
    {
      title: "Learn",
      description: "Learn by doing. Get stuck, ask questions, and learn from other teens who've been there.",
      icon: <BookOpen className="w-8 h-8 text-[var(--color-shipit-yellow)]" />,
      color: "var(--color-shipit-yellow)"
    },
    {
      title: "Ship",
      description: "Launch your projects to the world. We celebrate shipped products, not just perfect code.",
      icon: <Rocket className="w-8 h-8 text-[var(--color-shipit-red)]" />,
      color: "var(--color-shipit-red)"
    },
    {
      title: "Together",
      description: "You're not alone. Find co-founders, join teams, and build alongside ambitious teens.",
      icon: <Users className="w-8 h-8 text-[var(--color-shipit-green)]" />,
      color: "var(--color-shipit-green)"
    }
  ];

  return (
    <section className="py-24 px-4 bg-white/50 relative">
      <div className="max-w-6xl mx-auto">
        <RevealWrapper className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">What is ShipIt?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
            We believe the best way to learn is to build. No gatekeeping, no fluff. Just a community of ambitious teens turning ideas into reality.
          </p>
        </RevealWrapper>

        <RevealWrapper staggerChildren delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => (
            <RevealItem key={i}>
              <motion.div 
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 h-full flex flex-col"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${pillar.color}20` }}
                >
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-grow">
                  {pillar.description}
                </p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealWrapper>
      </div>
    </section>
  );
}
