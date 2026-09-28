"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function GridOverlay() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 1000], [0.3, 0.3]); // Keep it consistent for the raw look

  return (
    <motion.div
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        opacity
      }}
    />
  );
}
