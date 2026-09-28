"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Rocket } from "lucide-react";

export function CursorFollower() {
  const [isMounted, setIsMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);

    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isMounted) return null;
  // Hide on mobile/touch devices entirely via CSS classes
  
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden sm:flex items-center justify-center mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
      }}
      animate={{
        scale: isHovering ? 2 : 1,
        opacity: 1,
      }}
      transition={{ duration: 0.15 }}
    >
      <div className="relative flex items-center justify-center">
        <Rocket className="text-white w-6 h-6 rotate-45 opacity-80" />
      </div>
    </motion.div>
  );
}
