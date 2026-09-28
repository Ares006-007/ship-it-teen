"use client";

import { motion } from "framer-motion";
import { RevealWrapper, RevealItem } from "./RevealWrapper";

const events = [
  {
    date: "Oct 15, 2026",
    title: "Global AI Hackathon",
    location: "Online / Discord",
    color: "var(--color-shipit-blue)"
  },
  {
    date: "Nov 02, 2026",
    title: "Startup Pitch Day",
    location: "San Francisco, CA",
    color: "var(--color-shipit-red)"
  },
  {
    date: "Nov 20, 2026",
    title: "Game Jam Weekend",
    location: "Online",
    color: "var(--color-shipit-yellow)"
  }
];

export function Timeline() {
  return (
    <section className="py-24 px-4 bg-white relative">
      <div className="max-w-4xl mx-auto">
        <RevealWrapper className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">What's coming up.</h2>
          <p className="text-xl text-gray-600">Mark your calendars. We ship constantly.</p>
        </RevealWrapper>

        <div className="relative">
          {/* Connecting Line (Rainbow Trail) */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--color-shipit-blue)] via-[var(--color-shipit-red)] to-[var(--color-shipit-yellow)] md:-translate-x-1/2 rounded-full opacity-30" />

          <RevealWrapper staggerChildren delay={0.2} className="relative z-10 space-y-12">
            {events.map((event, i) => (
              <RevealItem key={i} className={`flex flex-col md:flex-row gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                
                {/* Timeline Dot */}
                <div className="absolute left-[21px] md:left-1/2 w-4 h-4 rounded-full bg-white border-4 md:-translate-x-1/2 mt-6 md:mt-0 shadow-sm" style={{ borderColor: event.color }} />

                <div className={`pl-16 md:pl-0 md:w-1/2 ${i % 2 === 0 ? "md:text-left" : "md:text-right md:pr-12"}`}>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50"
                  >
                    <span className="text-sm font-bold uppercase tracking-wide" style={{ color: event.color }}>
                      {event.date}
                    </span>
                    <h3 className="text-2xl font-bold mt-2 mb-2">{event.title}</h3>
                    <p className="text-gray-500 font-medium">{event.location}</p>
                  </motion.div>
                </div>
              </RevealItem>
            ))}
          </RevealWrapper>
        </div>
      </div>
    </section>
  );
}
