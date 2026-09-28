"use client";

import { motion } from "framer-motion";
import { RevealWrapper } from "./RevealWrapper";
import { Rocket } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden pt-20">
      
      {/* Decorative Star/Sparkle Elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 text-[var(--color-shipit-yellow)] opacity-50 pointer-events-none"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        ✨
      </motion.div>
      <motion.div 
        className="absolute bottom-1/3 right-1/4 text-[var(--color-shipit-blue)] opacity-40 pointer-events-none text-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {"</>"}
      </motion.div>

      {/* Main Content */}
      <RevealWrapper delay={0.2} className="text-center z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated Rocket Launch on Load */}
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.1
          }}
          className="bg-white shadow-xl shadow-[var(--color-shipit-blue)]/10 rounded-full p-6 mb-8 relative"
        >
          <Rocket className="w-16 h-16 text-[var(--color-shipit-blue)]" />
          {/* Subtle rainbow trail under rocket */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4 h-16 bg-gradient-to-b from-[var(--color-shipit-blue)] via-[var(--color-shipit-red)] to-[var(--color-shipit-yellow)] blur-md opacity-60 rounded-full" />
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-balance">
          Ideas <span className="text-[var(--color-shipit-blue)]">→</span> People <span className="text-[var(--color-shipit-red)]">→</span> Projects
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl text-balance">
          We are <span className="font-semibold text-black">ShipIt Teens</span>. A STEM community where you don't need permission to start building.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="interactive px-8 py-4 bg-[var(--color-shipit-blue)] text-white font-semibold rounded-full shadow-lg shadow-[var(--color-shipit-blue)]/25 hover:shadow-xl transition-shadow text-lg"
          >
            Join the Community
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="interactive px-8 py-4 bg-white text-[var(--color-shipit-black)] font-semibold rounded-full border-2 border-gray-100 shadow-sm hover:border-gray-200 hover:bg-gray-50 transition-colors text-lg"
          >
            See What We've Built
          </motion.button>
        </div>
      </RevealWrapper>

      {/* Badge line */}
      <RevealWrapper delay={0.6} className="mt-16 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[var(--color-shipit-yellow)]/30 text-sm font-semibold text-gray-700 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--color-shipit-yellow)] animate-pulse" />
          Teens Make Cool Things
        </div>
      </RevealWrapper>
    </section>
  );
}
