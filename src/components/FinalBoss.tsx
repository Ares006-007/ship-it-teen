"use client";

import { motion } from "framer-motion";

export function FinalBoss() {
  return (
    <section id="apply" className="relative py-40 border-b-4 border-black bg-blue-600 text-white overflow-hidden">
      
      {/* Decorative grid lines */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 2px, transparent 2px),
            linear-gradient(to bottom, white 2px, transparent 2px)
          `,
          backgroundSize: "64px 64px"
        }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="mb-12">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-white/60">
            05 // FINAL BOSS
          </span>
        </div>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none text-white"
        >
          We Review Every Application.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-16 text-white/90"
        >
          Show us you care. Show us what you've built.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a 
            href="mailto:join@shipitteens.com"
            className="inline-block bg-white text-black px-12 py-6 text-2xl md:text-4xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all border-4 border-black"
          >
            Apply To Join
          </a>
        </motion.div>
      </div>
    </section>
  );
}
