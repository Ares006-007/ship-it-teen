"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const MARQUEE_TEXT = "BUILD IN PUBLIC · SHIP EARLY · SPEED OVER PERFECTION · CURIOSITY OVER CREDENTIALS · ";

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [ytLinks, setYtLinks] = useState({
    ytLink1: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ytLink2: "https://www.youtube.com/embed/jNQXAC9IVRw"
  });

  const formatYoutubeUrl = (url: string) => {
    if (!url) return "";
    try {
      let videoId = "";
      if (url.includes("youtube.com/watch")) {
        videoId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      } else if (url.includes("youtube.com/shorts/")) {
        videoId = url.split("shorts/")[1]?.split("?")[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  const [applyUrl, setApplyUrl] = useState("https://2ydjdh3asn.zite.so");

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const heroRef = doc(db, "config", "hero");
        const linksRef = doc(db, "config", "links");
        
        const [heroSnap, linksSnap] = await Promise.all([
          getDoc(heroRef),
          getDoc(linksRef)
        ]);

        if (heroSnap.exists() && heroSnap.data().ytLink1) {
          setYtLinks({
            ytLink1: formatYoutubeUrl(heroSnap.data().ytLink1),
            ytLink2: formatYoutubeUrl(heroSnap.data().ytLink2) || "https://www.youtube.com/embed/jNQXAC9IVRw"
          });
        }
        
        if (linksSnap.exists() && linksSnap.data().applyFormUrl) {
          setApplyUrl(linksSnap.data().applyFormUrl);
        }
      } catch (err) {
        console.error("Failed to load configs", err);
      }
    };
    fetchConfig();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section 
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-white border-b-4 border-black pt-20"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      
      {/* Base Grid Texture Background (darker) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] z-0"></div>

      {/* Colorful Interactive Grid Mask that follows cursor */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-150"
        style={{
          opacity: isHovering ? 1 : 0,
          maskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, black 99%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, black 99%, transparent 100%)`,
        }}
      >
        {/* Multiple Solid Colors (Grid) */}
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-3 grid-rows-2 h-full w-full opacity-40">
          <div className="bg-[var(--color-shipit-blue)]"></div>
          <div className="bg-[var(--color-shipit-yellow)]"></div>
          <div className="bg-[var(--color-shipit-red)] hidden md:block"></div>
          <div className="bg-[var(--color-shipit-green)]"></div>
          <div className="bg-black"></div>
          <div className="bg-[var(--color-shipit-purple)] hidden md:block"></div>
        </div>
        
        {/* Thicker Dark Grid Over the Solid Colors */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      {/* Background Section Number */}
      <div className="absolute top-24 left-6 text-xl md:text-2xl font-bold tracking-widest text-black/20 select-none z-0">
        00 // START
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 z-10 pt-16 pb-32">
        
        {/* Left Side: Headline & CTA */}
        <div className="flex-1 w-full lg:pt-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black"
          >
            Stop Reading.<br />
            Join The <span className="text-blue-600 block sm:inline">Movement.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-12 text-black/80"
          >
            No fluff. Just building.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a 
              href={applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-black text-white px-10 py-5 text-xl md:text-2xl font-black uppercase tracking-widest hover:bg-blue-600 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all border-4 border-black"
            >
              Apply to Join
            </a>
          </motion.div>
        </div>

        {/* Right Side: Floating YouTube Videos */}
        <div className="flex-1 w-full max-w-lg ml-auto relative flex flex-col gap-12 lg:pt-8">
          {/* Video 1 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.4 }}
            className="w-full relative z-20 hover:z-30"
          >
            {/* Brutalist Video Frame */}
            <div className="relative aspect-video w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden group">
              {/* Top Bar to make it look like a window */}
              <div className="h-5 bg-black w-full flex items-center px-2 gap-1.5 absolute top-0 left-0 z-20">
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-red)] border border-black"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-yellow)] border border-black"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-green)] border border-black"></div>
              </div>
              
              <iframe 
                src={`${ytLinks.ytLink1}?autoplay=0&controls=1&showinfo=0`} 
                title="YouTube video player 1" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 pt-5 w-full h-full"
              ></iframe>
            </div>
            
            {/* Decorative background element behind Video 1 */}
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-[var(--color-shipit-yellow)] border-4 border-black -z-10"></div>
          </motion.div>

          {/* Video 2 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.5, type: "spring", bounce: 0.4 }}
            className="w-full relative ml-4 lg:ml-8 z-10 hover:z-30"
          >
            {/* Brutalist Video Frame */}
            <div className="relative aspect-video w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden group">
              {/* Top Bar */}
              <div className="h-5 bg-black w-full flex items-center px-2 gap-1.5 absolute top-0 left-0 z-20">
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-red)] border border-black"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-yellow)] border border-black"></div>
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-green)] border border-black"></div>
              </div>
              
              <iframe 
                src={`${ytLinks.ytLink2}?autoplay=0&controls=1&showinfo=0`} 
                title="YouTube video player 2" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 pt-5 w-full h-full"
              ></iframe>
            </div>
            
            {/* Decorative background element behind Video 2 */}
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-[var(--color-shipit-blue)] border-4 border-black -z-10"></div>
          </motion.div>
        </div>

      </div>

      {/* Marquee Ticker */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-black text-white py-4 border-t-4 border-black z-10">
        <motion.div 
          className="whitespace-nowrap flex"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        >
          <span className="text-xl md:text-3xl font-black tracking-widest uppercase px-4">
            {MARQUEE_TEXT.repeat(10)}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
