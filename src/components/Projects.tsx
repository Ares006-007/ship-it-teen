"use client";

import { motion } from "framer-motion";
import { RevealWrapper, RevealItem } from "./RevealWrapper";

const projects = [
  {
    title: "EcoTrack",
    builders: "Sarah J. & Mike T.",
    stack: ["Next.js", "Firebase", "Tailwind"],
    description: "An AI-powered carbon footprint tracker for high school students.",
    color: "var(--color-shipit-green)"
  },
  {
    title: "StudyBuddy AI",
    builders: "Alex C.",
    stack: ["React", "Python", "OpenAI"],
    description: "Generates custom quizzes from lecture notes instantly.",
    color: "var(--color-shipit-blue)"
  },
  {
    title: "RocketSim",
    builders: "David W. & Team",
    stack: ["Three.js", "WebGL", "TypeScript"],
    description: "A physics-accurate orbital mechanics simulator running in the browser.",
    color: "var(--color-shipit-red)"
  }
];

export function Projects() {
  return (
    <section className="py-24 px-4 bg-gray-50 border-y border-gray-100">
      <div className="max-w-6xl mx-auto">
        <RevealWrapper className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Built by teens.</h2>
          <p className="text-xl text-gray-600">Explore some of the incredible projects shipped by our community.</p>
        </RevealWrapper>

        <RevealWrapper staggerChildren delay={0.1} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <RevealItem key={i}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="interactive group bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col h-full cursor-none"
              >
                {/* Image Placeholder */}
                <div 
                  className="h-48 w-full bg-gray-100 relative overflow-hidden"
                  style={{ backgroundColor: `${project.color}15` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl opacity-20" style={{ color: project.color }}>
                    {project.title} Demo
                  </div>
                  {/* Hover reveal overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-6 py-2 bg-white text-black font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View Project
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">By {project.builders}</p>
                  <p className="text-gray-700 mb-6 flex-grow">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.stack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealWrapper>
      </div>
    </section>
  );
}
