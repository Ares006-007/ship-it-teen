"use client";

import { motion } from "framer-motion";
import { RevealWrapper } from "./RevealWrapper";

export function Sponsors() {
  const sponsors = ["Vercel", "Firebase", "OpenAI", "Stripe", "Figma", "GitHub"];

  return (
    <section className="py-16 px-4 bg-gray-50 border-y border-gray-100 overflow-hidden">
      <RevealWrapper className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">
          Supported by the best
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {sponsors.map((sponsor, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.1 }}
              className="text-2xl font-bold text-gray-800"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {sponsor}
            </motion.div>
          ))}
        </div>
      </RevealWrapper>
    </section>
  );
}
