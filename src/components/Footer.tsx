"use client";

import { motion } from "framer-motion";
import { RevealWrapper } from "./RevealWrapper";
import { Rocket } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-24 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-shipit-blue)_0%,_transparent_70%)]" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <RevealWrapper>
          <Rocket className="w-16 h-16 mx-auto mb-8 text-[var(--color-shipit-yellow)]" />
          
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Stop waiting.<br/>Start building.
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of ambitious teens who are shipping real products every single day. The world needs what you're building.
          </p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="interactive px-10 py-5 bg-[var(--color-shipit-blue)] text-white font-bold rounded-full shadow-2xl shadow-[var(--color-shipit-blue)]/30 text-xl"
          >
            Ship Your First Project
          </motion.button>
        </RevealWrapper>

        <RevealWrapper delay={0.3} className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold tracking-tight">
            ShipIt<span className="text-[var(--color-shipit-blue)]">Teens</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <span className="cursor-pointer hover:text-white transition-colors">Discord</span>
            <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
            <span className="cursor-pointer hover:text-white transition-colors">GitHub</span>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-semibold text-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-shipit-green)] animate-pulse" />
            Teens Make Cool Things
          </div>
        </RevealWrapper>
      </div>
    </footer>
  );
}
