"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

type Job = {
  id: string;
  title: string;
  tags: string;
  description: string;
  link?: string;
  createdAt: any;
};

export default function WorkWithUsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const fetchedJobs: Job[] = [];
        querySnapshot.forEach((doc) => {
          fetchedJobs.push({ id: doc.id, ...doc.data() } as Job);
        });
        
        // Sort manually
        fetchedJobs.sort((a: any, b: any) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return a.createdAt.seconds - b.createdAt.seconds;
        });

        setJobs(fetchedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 border-x-4 border-black max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b-4 border-black py-24 px-6 md:px-12 lg:px-24">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] z-0"></div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Work <br />
              <span className="text-[var(--color-shipit-blue)]">With Us.</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-black/80 max-w-2xl">
              Partner with the next generation of builders, hackers, and creators.
            </p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">
              Why Partner With ShipIt Teens?
            </h2>
            <div className="space-y-6 text-lg md:text-xl font-medium leading-relaxed">
              <p>
                We are a collective of driven, deeply curious teenagers who care about shipping real products, not just talking about them.
              </p>
              <p>
                When you work with us, you get unfiltered access to Gen-Z builders who understand modern technology, design trends, and the internet culture better than anyone else.
              </p>
              <p>
                Whether you're looking to sponsor an upcoming hackathon, collaborate on an open-source tool, or hire hungry talent, we want to hear from you.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-black text-white p-8 md:p-12 border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
          >
            {/* Decorative background shape */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--color-shipit-red)] rounded-full mix-blend-overlay opacity-50 group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8 text-[var(--color-shipit-yellow)]">
                Get In Touch
              </h3>
              
              <form className="space-y-6 flex flex-col">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2 text-white/80">Name / Company</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/10 border-2 border-white/20 p-4 font-mono text-white focus:outline-none focus:border-[var(--color-shipit-yellow)] transition-colors"
                    placeholder="Jane Doe @ Acme Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2 text-white/80">Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-white/10 border-2 border-white/20 p-4 font-mono text-white focus:outline-none focus:border-[var(--color-shipit-yellow)] transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2 text-white/80">How can we work together?</label>
                  <textarea 
                    className="w-full bg-white/10 border-2 border-white/20 p-4 font-mono text-white focus:outline-none focus:border-[var(--color-shipit-yellow)] transition-colors h-32 resize-none"
                    placeholder="Tell us about your proposal..."
                  ></textarea>
                </div>

                <button 
                  type="button"
                  className="bg-[var(--color-shipit-yellow)] text-black px-8 py-4 font-black uppercase tracking-widest text-xl hover:bg-white hover:-translate-y-1 transition-all mt-4 border-4 border-black"
                >
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </section>

        {/* Hiring Section */}
        <section className="py-24 px-6 md:px-12 lg:px-24 border-t-4 border-black bg-[var(--color-shipit-blue)] text-black">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
              We Are Hiring
            </h2>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-wide opacity-80">
              Join the core team. Help us build the future.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-12 h-12 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white border-4 border-black border-dashed p-12 text-center mb-16">
              <h3 className="text-2xl font-black uppercase">No Open Roles Right Now</h3>
              <p className="font-bold mt-2 text-black/70">Check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.tags.split(',').map((tag, i) => (
                        <span key={i} className="bg-black text-white px-2 py-1 text-xs font-bold uppercase tracking-widest">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <p className="font-medium text-lg leading-relaxed whitespace-pre-wrap mb-6">
                      {job.description}
                    </p>
                  </div>
                  {job.link && (
                    <div className="mt-4 pt-4 border-t-2 border-black/10">
                      <a 
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black hover:border-black border-4 border-transparent transition-all"
                      >
                        Apply for this role →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <a 
              href="https://2ydjdh3asn.zite.so" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-black text-white px-12 py-6 text-2xl font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              Apply Now →
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
