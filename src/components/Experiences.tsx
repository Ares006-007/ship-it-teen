"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

type Experience = {
  id: string;
  name: string;
  desc: string;
  coverImage: string;
  bgColor: string;
};

export function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "experiences"));
        const fetched: Experience[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Experience);
        });
        
        fetched.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return a.createdAt.seconds - b.createdAt.seconds;
        });

        setExperiences(fetched);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experiences" className="relative py-32 border-b-4 border-black bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            03 // EXPERIENCES
          </span>
        </div>

        <div className="space-y-12">
          {loading ? (
            <div className="flex justify-center items-center py-12 text-black/50 font-bold tracking-widest uppercase gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading experiences...
            </div>
          ) : experiences.length === 0 ? (
            <div className="text-center py-12 text-black/50 font-bold tracking-widest uppercase border-4 border-dashed border-black/20">
              NO EXPERIENCES FOUND
            </div>
          ) : (
            experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col md:flex-row items-stretch border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden group`}
              >
                <div className={`w-full md:w-1/3 min-h-[200px] border-b-4 md:border-b-0 md:border-r-4 border-black p-8 flex items-center justify-center ${exp.bgColor} transition-colors duration-500 overflow-hidden relative`}>
                  {exp.coverImage ? (
                    <img src={exp.coverImage} alt={exp.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 grayscale group-hover:grayscale-0 transition-all duration-300" />
                  ) : (
                    <span className="text-4xl opacity-50 font-black tracking-tighter mix-blend-multiply relative z-10">PHOTO_REF_{idx+1}</span>
                  )}
                </div>
                <div className="w-full md:w-2/3 p-8 flex flex-col justify-center">
                  <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 group-hover:text-[#2DDFFF] transition-colors">
                    {exp.name}
                  </h3>
                  <p className="text-2xl font-bold uppercase tracking-widest text-black/70">
                    {exp.desc}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
