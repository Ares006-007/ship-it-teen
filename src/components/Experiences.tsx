"use client";

import { motion } from "framer-motion";

const EVENTS = [
  {
    name: "SUNBEAM",
    desc: "SUMMER BUILDER ACCELERATOR. 4 WEEKS. 100% SHIPPING.",
    bgColor: "bg-blue-100",
  },
  {
    name: "DAYDREAM",
    desc: "24-HOUR HACKATHON. SLEEP IS OPTIONAL. PIZZA MANDATORY.",
    bgColor: "bg-red-100",
  },
  {
    name: "CODEDAY",
    desc: "WEEKEND JAMS. FIRST TIMERS TO VETERANS.",
    bgColor: "bg-yellow-100",
  }
];

export function Experiences() {
  return (
    <section id="experiences" className="relative py-32 border-b-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            03 // EXPERIENCES
          </span>
        </div>

        <div className="space-y-12">
          {EVENTS.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col md:flex-row items-stretch border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden group`}
            >
              <div className={`w-full md:w-1/3 min-h-[200px] border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex items-center justify-center ${event.bgColor} transition-colors duration-500`}>
                <span className="text-4xl opacity-50 font-black tracking-tighter mix-blend-multiply">PHOTO_REF_{idx+1}</span>
              </div>
              <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
                <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 group-hover:text-blue-600 transition-colors">
                  {event.name}
                </h3>
                <p className="text-2xl font-bold uppercase tracking-widest text-black/70">
                  {event.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
