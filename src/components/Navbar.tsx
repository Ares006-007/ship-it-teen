"use client";

import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-black"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-2xl font-black uppercase tracking-tighter hover:text-blue-600 transition-colors">
          ShipIt
        </a>
        
        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest uppercase">
          <a href="#manifesto" className="hover:text-blue-600 transition-colors">Manifesto</a>
          <a href="#work" className="hover:text-blue-600 transition-colors">The Work</a>
          <a href="#experiences" className="hover:text-blue-600 transition-colors">Experiences</a>
        </div>

        <a 
          href="#apply" 
          className="bg-black text-white px-6 py-2 font-bold uppercase tracking-widest text-sm hover:bg-blue-600 hover:text-white transition-colors"
        >
          Apply to Join
        </a>
      </div>
    </motion.nav>
  );
}
