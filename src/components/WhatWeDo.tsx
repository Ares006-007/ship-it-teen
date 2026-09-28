"use client";

import { motion } from "framer-motion";

const CARDS = [
  {
    title: "OPEN PROJECTS",
    subtitle: "SHIP SOFTWARE. OPEN SOURCE. PUBLIC REPOS.",
    color: "bg-blue-600",
  },
  {
    title: "HARDWARE HACKS",
    subtitle: "CIRCUITS. RASPBERRY PIS. ROBOTICS. BREAK IT.",
    color: "bg-red-600",
  },
  {
    title: "DEMO DAYS",
    subtitle: "PITCH IT. SHOW IT. NO SLIDES, JUST LIVE CODE.",
    color: "bg-yellow-400 text-black",
  }
];

export function WhatWeDo() {
  return (
    <section id="work" className="relative py-32 border-b-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            02 // WHAT WE DO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`border-4 border-black p-8 flex flex-col justify-between min-h-[300px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${card.color} ${card.color.includes('text-black') ? '' : 'text-white'}`}
            >
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                {card.title}
              </h3>
              <p className="text-xl font-bold uppercase tracking-widest opacity-90">
                {card.subtitle}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
