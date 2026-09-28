"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function GridOverlay() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300, 600], [0.2, 0.5, 0.2]);

  return (
    <motion.div
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: "32px 32px",
        opacity
      }}
    />
  );
}
