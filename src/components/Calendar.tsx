"use client";

import { motion } from "framer-motion";

const UPCOMING_EVENTS = [
  {
    date: "OCT 14",
    title: "SATURDAY BUILD JAM",
    location: "IRL // GARAGE HQ",
    status: "OPEN",
    link: "#",
  },
  {
    date: "OCT 21",
    title: "HARDWARE TEARDOWN",
    location: "IRL // MAKERSPACE",
    status: "WAITLIST",
    link: "#",
  },
  {
    date: "NOV 05",
    title: "DAYDREAM HACKATHON",
    location: "IRL + ONLINE",
    status: "REGISTER NOW",
    link: "#",
  }
];

export function Calendar() {
  return (
    <section id="calendar" className="relative py-32 border-b-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 flex justify-between items-end">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            04 // UPCOMING EVENTS
          </span>
          <span className="hidden sm:block text-sm font-bold tracking-widest uppercase bg-black text-white px-3 py-1">
            SYNC TO CALENDAR
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {UPCOMING_EVENTS.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ x: 10 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between border-4 border-black p-6 md:p-8 hover:bg-black hover:text-white transition-colors group"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 mb-6 md:mb-0">
                <div className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-blue-600 group-hover:text-yellow-400 transition-colors w-40">
                  {event.date}
                </div>
                <div>
                  <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2">
                    {event.title}
                  </h4>
                  <div className="text-lg font-bold uppercase tracking-widest opacity-70">
                    {event.location}
                  </div>
                </div>
              </div>
              
              <a 
                href={event.link}
                className={`inline-block px-8 py-4 font-black uppercase tracking-widest border-4 transition-all ${
                  event.status === 'WAITLIST' 
                    ? 'border-gray-500 text-gray-500 bg-transparent cursor-not-allowed group-hover:border-gray-400 group-hover:text-gray-400' 
                    : 'border-black bg-yellow-400 text-black group-hover:bg-white group-hover:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1'
                }`}
              >
                {event.status}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
