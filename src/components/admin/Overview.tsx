"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Calendar, Briefcase, Image as ImageIcon } from "lucide-react";

export function Overview() {
  const [stats, setStats] = useState({ events: 0, jobs: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const eventsSnap = await getDocs(collection(db, "events"));
        const jobsSnap = await getDocs(collection(db, "jobs"));
        const projectsSnap = await getDocs(collection(db, "projects"));

        setStats({
          events: eventsSnap.size,
          jobs: jobsSnap.size,
          projects: projectsSnap.size,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex items-center gap-2 font-bold"><Loader2 className="animate-spin" /> Loading System Stats...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat Card 1 */}
        <div className="bg-[var(--color-shipit-blue)] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-start mb-4 text-black">
            <h3 className="text-xl font-bold uppercase tracking-widest">Events</h3>
            <Calendar className="w-8 h-8" />
          </div>
          <p className="text-6xl font-sora font-black text-black">{stats.events}</p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-[var(--color-shipit-green)] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-start mb-4 text-black">
            <h3 className="text-xl font-bold uppercase tracking-widest">Open Roles</h3>
            <Briefcase className="w-8 h-8" />
          </div>
          <p className="text-6xl font-sora font-black text-black">{stats.jobs}</p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-[var(--color-shipit-yellow)] border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex justify-between items-start mb-4 text-black">
            <h3 className="text-xl font-bold uppercase tracking-widest">Projects</h3>
            <ImageIcon className="w-8 h-8" />
          </div>
          <p className="text-6xl font-sora font-black text-black">{stats.projects}</p>
        </div>

      </div>

      {/* System Status */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6">System Status</h3>
        <div className="space-y-4 font-poppins font-bold uppercase">
          <div className="flex justify-between items-center border-b-2 border-black/10 pb-4">
            <span className="text-black/60">Database Connection</span>
            <span className="text-[var(--color-shipit-green)] flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--color-shipit-green)] rounded-full animate-pulse"></div>
              Online
            </span>
          </div>
          <div className="flex justify-between items-center border-b-2 border-black/10 pb-4">
            <span className="text-black/60">Authentication</span>
            <span className="text-[var(--color-shipit-green)] flex items-center gap-2">
              <div className="w-3 h-3 bg-[var(--color-shipit-green)] rounded-full animate-pulse"></div>
              Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
