"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Navbar() {
  const [applyUrl, setApplyUrl] = useState("https://2ydjdh3asn.zite.so");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const docRef = doc(db, "config", "links");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().applyFormUrl) {
          setApplyUrl(docSnap.data().applyFormUrl);
        }
      } catch (err) {
        console.error("Failed to load apply form url", err);
      }
    };
    fetchLink();
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-black"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-black uppercase tracking-tighter hover:text-[var(--color-shipit-blue)] transition-colors">
          ShipIt
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-bold text-sm tracking-widest uppercase">
          <Link href="/#manifesto" className="hover:text-[var(--color-shipit-blue)] transition-colors">Manifesto</Link>
          <Link href="/#work" className="hover:text-[var(--color-shipit-blue)] transition-colors">The Work</Link>
          <Link href="/#experiences" className="hover:text-[var(--color-shipit-blue)] transition-colors">Experiences</Link>
        </div>

        <a 
          href={applyUrl} 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-6 py-2 font-bold uppercase tracking-widest text-sm hover:bg-[var(--color-shipit-blue)] hover:text-white transition-colors border-2 border-black hover:border-[var(--color-shipit-blue)]"
        >
          Apply to Join
        </a>
      </div>
    </motion.nav>
  );
}
