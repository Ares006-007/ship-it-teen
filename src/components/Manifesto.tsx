"use client";

import { motion } from "framer-motion";

export function Manifesto() {
  return (
    <section id="manifesto" className="relative py-32 border-b-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            01 // THE MANIFESTO
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-8">
              Stop Watching Tutorials.<br />
              <span className="text-red-600">Start Writing Code.</span>
            </h2>
          </div>
          
          <div className="flex flex-col justify-center space-y-8 text-2xl md:text-3xl font-bold uppercase tracking-wide text-black/80">
            <p>
              We are sick of tutorial hell. We are tired of asking for permission.
            </p>
            <p>
              ShipIt is a collective of teen builders who actually <span className="text-black bg-yellow-300 px-2">make things</span>. Hardware, software, weird side projects, things that might break.
            </p>
            <p>
              Sweat, code, and caffeine. That's the stack.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
