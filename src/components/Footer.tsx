"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Footer() {
  const [links, setLinks] = useState({
    twitterUrl: "#",
    githubUrl: "#",
    discordUrl: "#",
  });

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const docRef = doc(db, "config", "links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setLinks({
            twitterUrl: data.twitterUrl || "#",
            githubUrl: data.githubUrl || "#",
            discordUrl: data.discordUrl || "#",
          });
        }
      } catch (err) {
        console.error("Failed to load footer links", err);
      }
    };
    fetchLinks();
  }, []);

  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-3xl font-black uppercase tracking-tighter">
          SHIPIT TEENS
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 font-bold uppercase tracking-widest text-sm text-white/60">
          <Link href="/work-with-us" className="hover:text-[#2DDFFF] transition-colors">Work With Us</Link>
          <a href={links.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#2DDFFF] transition-colors">Twitter</a>
          <a href={links.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#2DDFFF] transition-colors">GitHub</a>
          <a href={links.discordUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#2DDFFF] transition-colors">Discord</a>
          <Link href="/admin/login" className="hover:text-[#F5F474] transition-colors">Admin</Link>
        </div>

        <div className="font-bold uppercase tracking-widest text-sm text-white/40">
          © {new Date().getFullYear()} NO FLUFF. JUST BUILDING.
        </div>
      </div>
    </footer>
  );
}
