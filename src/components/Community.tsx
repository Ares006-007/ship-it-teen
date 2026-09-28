"use client";

import { motion } from "framer-motion";
import { RevealWrapper, RevealItem } from "./RevealWrapper";
import { MessageSquareQuote } from "lucide-react";

const testimonials = [
  {
    quote: "I used to just watch coding tutorials. ShipIt pushed me to actually build something real. Last month, our team won a hackathon!",
    author: "Jessica, 16",
    role: "Built EcoTrack",
    color: "var(--color-shipit-blue)"
  },
  {
    quote: "The mentorship here is insane. I got paired with a senior dev who helped me debug my AI model for three hours.",
    author: "Marcus, 17",
    role: "Built StudyBuddy",
    color: "var(--color-shipit-red)"
  },
  {
    quote: "It's not just about code, it's about the people. I've found my co-founders and my best friends here.",
    author: "Leo, 15",
    role: "Hardware Hacker",
    color: "var(--color-shipit-yellow)"
  }
];

export function Community() {
  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <RevealWrapper className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Wall of Love.</h2>
            <p className="text-xl text-gray-600 max-w-lg">Don't just take our word for it. Here's what our community members have to say.</p>
          </div>
          <div className="interactive px-6 py-3 bg-black text-white font-semibold rounded-full cursor-pointer hover:scale-105 transition-transform inline-flex">
            Read all stories →
          </div>
        </RevealWrapper>

        <RevealWrapper staggerChildren delay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <RevealItem key={i}>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 relative">
                <MessageSquareQuote 
                  className="absolute top-6 right-6 w-12 h-12 opacity-10" 
                  style={{ color: t.color }}
                />
                <p className="text-lg text-gray-700 italic mb-8 relative z-10 font-medium">"{t.quote}"</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-lg" style={{ color: t.color, backgroundColor: `${t.color}20` }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.author}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealWrapper>
      </div>
    </section>
  );
}
