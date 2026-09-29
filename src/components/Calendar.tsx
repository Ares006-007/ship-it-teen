"use client";

import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Event = {
  id: string;
  date: string;
  title: string;
  location: string;
  status: string;
  link: string;
};

export function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch without orderBy to avoid Firestore index requirement errors
        const querySnapshot = await getDocs(collection(db, "events"));
        const fetchedEvents: Event[] = [];
        querySnapshot.forEach((doc) => {
          fetchedEvents.push({ id: doc.id, ...doc.data() } as Event);
        });

        // Sort events manually based on createdAt timestamp
        fetchedEvents.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return a.createdAt.seconds - b.createdAt.seconds;
        });

        setEvents(fetchedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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
          {loading ? (
            <div className="text-center py-12 text-black/50 font-bold tracking-widest uppercase">
              Loading calendar...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-black/50 font-bold tracking-widest uppercase border-4 border-dashed border-black/20">
              NO UPCOMING EVENTS
            </div>
          ) : (
            events.map((event, idx) => (
              <motion.div
                key={event.id}
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
                  href={event.link || "#"}
                  target={event.link ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className={`inline-block px-8 py-4 font-black uppercase tracking-widest border-4 transition-all ${
                    event.status.toUpperCase() === 'WAITLIST' || event.status.toUpperCase() === 'CLOSED'
                      ? 'border-gray-500 text-gray-500 bg-transparent cursor-not-allowed group-hover:border-gray-400 group-hover:text-gray-400' 
                      : 'border-black bg-yellow-400 text-black group-hover:bg-white group-hover:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-1'
                  }`}
                >
                  {event.status}
                </a>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
