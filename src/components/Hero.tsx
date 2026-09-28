"use client";

import { motion } from "framer-motion";

const MARQUEE_TEXT = "BUILD IN PUBLIC · SHIP EARLY · SPEED OVER PERFECTION · CURIOSITY OVER CREDENTIALS · ";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-transparent border-b-4 border-black pt-20">
      
      {/* Background Section Number */}
      <div className="absolute top-24 left-6 text-xl md:text-2xl font-bold tracking-widest text-black/20 select-none">
        00 // START
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col z-10 pt-16 pb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black"
        >
          Stop Reading.<br />
          Join The <span className="text-blue-600 block sm:inline">Movement.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-12 text-black/80"
        >
          No fluff. Just building.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a 
            href="#apply"
            className="inline-block bg-black text-white px-10 py-5 text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black"
          >
            Apply to Join
          </a>
        </motion.div>
      </div>

      {/* Marquee Ticker */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-black text-white py-4 border-t-4 border-black">
        <motion.div 
          className="whitespace-nowrap flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        >
          <span className="text-xl md:text-3xl font-black tracking-widest uppercase px-4">
            {MARQUEE_TEXT.repeat(10)}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
