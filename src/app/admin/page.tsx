"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Calendar, Image as ImageIcon, Link as LinkIcon, Settings, Briefcase, Sparkles } from "lucide-react";
import { useState } from "react";
import { EventsManager } from "@/components/admin/EventsManager";
import { JobsManager } from "@/components/admin/JobsManager";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { Overview } from "@/components/admin/Overview";
import { SiteConfigManager } from "@/components/admin/SiteConfigManager";
import { ExperiencesManager } from "@/components/admin/ExperiencesManager";
import { LinksManager } from "@/components/admin/LinksManager";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "site-config", label: "Site Configuration", icon: Settings },
    { id: "experiences", label: "Experiences", icon: Sparkles },
    { id: "events", label: "Events & Calendar", icon: Calendar },
    { id: "jobs", label: "Hiring & Jobs", icon: Briefcase },
    { id: "projects", label: "Projects Showcase", icon: ImageIcon },
    { id: "links", label: "Navigation & Links", icon: LinkIcon },
  ];

  return (
    <div className="min-h-screen bg-white flex relative text-black">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] z-0"></div>

      {/* Sidebar */}
      <div className="w-72 bg-white border-r-4 border-black flex flex-col z-10 relative">
        <div className="p-6 border-b-4 border-black bg-[var(--color-shipit-yellow)]">
          <h1 className="text-3xl font-sora font-black uppercase tracking-tighter">ShipIt Admin</h1>
          <p className="text-sm font-bold uppercase mt-1 font-poppins">System Control // 01</p>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-poppins font-bold uppercase text-sm border-2 transition-all ${
                activeTab === tab.id 
                  ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1 -translate-y-1" 
                  : "bg-white text-black border-transparent hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:translate-x-1"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t-4 border-black bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[var(--color-shipit-red)] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 text-black font-sora font-black uppercase transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto z-10 relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10 border-b-4 border-black pb-4">
            <h2 className="text-5xl font-sora font-black uppercase tracking-tighter">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
            <div className="text-xl font-bold font-poppins">/ {activeTab.toUpperCase()}</div>
          </div>
          
          {activeTab === "overview" ? (
            <Overview />
          ) : activeTab === "site-config" ? (
            <SiteConfigManager />
          ) : activeTab === "experiences" ? (
            <ExperiencesManager />
          ) : activeTab === "events" ? (
            <EventsManager />
          ) : activeTab === "jobs" ? (
            <JobsManager />
          ) : activeTab === "projects" ? (
            <ProjectsManager />
          ) : activeTab === "links" ? (
            <LinksManager />
          ) : (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
              <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
                Info
              </div>
              <p className="font-poppins font-bold text-xl mb-4 uppercase">
                Module Under Construction
              </p>
              <div className="p-8 border-4 border-dashed border-black bg-neutral-100 flex items-center justify-center text-black font-poppins font-bold uppercase tracking-widest text-center">
                Check back later. Keep building.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
