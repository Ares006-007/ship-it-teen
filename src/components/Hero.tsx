"use client";

import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ───────────────────────── constants ───────────────────────── */

const MARQUEE_TEXT =
  "BUILD IN PUBLIC · SHIP EARLY · SPEED OVER PERFECTION · CURIOSITY OVER CREDENTIALS · ";

const HEADLINE_WORDS = ["Stop", "Reading.", "Join", "The", "Movement."];
const SUBLINE = "No fluff. Just building.";
const SECTION_LABEL = "00 // START";

const WORD_STAGGER_MS = 60;
const WORD_DURATION_MS = 500;
const HEADLINE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SUBLINE_DELAY_MS = 300; // after headline completes
const SCRAMBLE_DURATION_MS = 600;

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&/";

/* ───────────────────── sub-components ──────────────────────── */

/** 1. Word-stagger headline */
function StaggerHeadline({ reducedMotion }: { reducedMotion: boolean }) {
  // Words that go on line 1 vs line 2
  const line1 = HEADLINE_WORDS.slice(0, 2); // "Stop Reading."
  const line2 = HEADLINE_WORDS.slice(2);     // "Join The Movement."

  if (reducedMotion) {
    return (
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black">
        {line1.join(" ")}
        <br />
        {line2.slice(0, 2).join(" ")}{" "}
        <span className="text-blue-600 inline sm:inline">{line2[2]}</span>
      </h1>
    );
  }

  return (
    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-black">
      {line1.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: WORD_DURATION_MS / 1000,
            delay: (i * WORD_STAGGER_MS) / 1000,
            ease: HEADLINE_EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
      <br />
      {line2.map((word, i) => {
        const globalIdx = line1.length + i;
        const isMovement = word === "Movement.";
        return (
          <motion.span
            key={globalIdx}
            className={`inline-block mr-[0.25em] ${isMovement ? "text-blue-600" : ""}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: WORD_DURATION_MS / 1000,
              delay: (globalIdx * WORD_STAGGER_MS) / 1000,
              ease: HEADLINE_EASE,
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </h1>
  );
}

/** 2. Terminal typewriter subline with blinking cursor */
function TypewriterSubline({
  reducedMotion,
  startDelayMs,
}: {
  reducedMotion: boolean;
  startDelayMs: number;
}) {
  const [charCount, setCharCount] = useState(reducedMotion ? SUBLINE.length : 0);
  const [started, setStarted] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;
    const startTimeout = setTimeout(() => setStarted(true), startDelayMs);
    return () => clearTimeout(startTimeout);
  }, [startDelayMs, reducedMotion]);

  useEffect(() => {
    if (!started || reducedMotion) return;
    if (charCount >= SUBLINE.length) return;
    const id = setTimeout(() => setCharCount((c) => c + 1), 40);
    return () => clearTimeout(id);
  }, [charCount, started, reducedMotion]);

  return (
    <p className="text-2xl md:text-4xl font-bold uppercase tracking-wide mb-12 text-black/80 min-h-[2.5rem] md:min-h-[3.5rem]">
      <span>{SUBLINE.slice(0, charCount)}</span>
      <span
        className="inline-block w-[3px] h-[1em] bg-black/80 align-middle ml-0.5 animate-[cursor-blink_0.7s_steps(1)_infinite]"
        aria-hidden="true"
      />
    </p>
  );
}

/** 3. Magnetic CTA button */
function MagneticCTA({
  applyUrl,
  reducedMotion,
}: {
  applyUrl: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [pressed, setPressed] = useState(false);

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 100;
      const factor = Math.min(dist / maxDist, 1) * 6;
      x.set((dx / (dist || 1)) * factor);
      y.set((dy / (dist || 1)) * factor);
    },
    [reducedMotion, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: WORD_DURATION_MS / 1000,
        delay: reducedMotion
          ? 0
          : (HEADLINE_WORDS.length * WORD_STAGGER_MS) / 1000 + 0.15,
        ease: HEADLINE_EASE,
      }}
    >
      <motion.a
        ref={ref}
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={reducedMotion ? {} : { x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        className="inline-block bg-black text-white px-10 py-5 text-xl md:text-2xl font-black uppercase tracking-widest border-4 border-black cursor-pointer select-none"
        animate={{
          boxShadow: pressed
            ? "0px 0px 0px 0px rgba(0,0,0,1)"
            : "4px 4px 0px 0px rgba(0,0,0,1)",
        }}
        transition={{ duration: 0.12 }}
        whileHover={reducedMotion ? {} : { backgroundColor: "#2563FF" }}
      >
        Apply to Join
      </motion.a>
    </motion.div>
  );
}

/** 6. Scramble label */
function ScrambleLabel({ reducedMotion }: { reducedMotion: boolean }) {
  const [display, setDisplay] = useState(reducedMotion ? SECTION_LABEL : "");

  useEffect(() => {
    if (reducedMotion) return;

    const steps = 12;
    const interval = SCRAMBLE_DURATION_MS / steps;
    let step = 0;

    const id = setInterval(() => {
      step++;
      const progress = step / steps;
      const resolved = Math.floor(progress * SECTION_LABEL.length);
      let result = SECTION_LABEL.slice(0, resolved);
      for (let i = resolved; i < SECTION_LABEL.length; i++) {
        if (SECTION_LABEL[i] === " " || SECTION_LABEL[i] === "/") {
          result += SECTION_LABEL[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }
      setDisplay(result);
      if (step >= steps) {
        clearInterval(id);
        setDisplay(SECTION_LABEL);
      }
    }, interval);

    // Start with scrambled immediately
    let initial = "";
    for (let i = 0; i < SECTION_LABEL.length; i++) {
      if (SECTION_LABEL[i] === " " || SECTION_LABEL[i] === "/") {
        initial += SECTION_LABEL[i];
      } else {
        initial += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
    }
    setDisplay(initial);

    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="absolute top-24 left-6 text-xl md:text-2xl font-bold tracking-widest text-black/20 select-none z-0 font-mono">
      {display}
    </div>
  );
}

/** 8. Scroll cue arrow */
function ScrollCue({ reducedMotion }: { reducedMotion: boolean }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      initial={{ opacity: 1 }}
      animate={
        reducedMotion
          ? { opacity: 1 }
          : { y: [0, 8, 0] }
      }
      transition={
        reducedMotion
          ? {}
          : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        className="text-black/40"
      >
        <path d="M12 5v14M5 12l7 7 7-7" />
      </svg>
    </motion.div>
  );
}

/* ────────────────────── main component ─────────────────────── */

export function Hero() {
  const prefersReduced = useReducedMotion();
  const reducedMotion = !!prefersReduced;

  /* ── state ── */
  const [ytLinks, setYtLinks] = useState({
    ytLink1: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    ytLink2: "https://www.youtube.com/embed/jNQXAC9IVRw",
  });
  const [applyUrl, setApplyUrl] = useState("https://2ydjdh3asn.zite.so");
  const [isTouch, setIsTouch] = useState(false);
  const [marqueeHover, setMarqueeHover] = useState(false);

  /* ── parallax grid (mouse) ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, (v) => -v * 0.015); // 8-12px max at edges
  const gridY = useTransform(mouseY, (v) => -v * 0.015);

  /* ── helpers ── */
  const formatYoutubeUrl = useCallback((url: string) => {
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
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      return url;
    } catch {
      return url;
    }
  }, []);

  /* ── fetch config ── */
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const heroRef = doc(db, "config", "hero");
        const linksRef = doc(db, "config", "links");
        const [heroSnap, linksSnap] = await Promise.all([
          getDoc(heroRef),
          getDoc(linksRef),
        ]);
        if (heroSnap.exists() && heroSnap.data().ytLink1) {
          setYtLinks({
            ytLink1: formatYoutubeUrl(heroSnap.data().ytLink1),
            ytLink2:
              formatYoutubeUrl(heroSnap.data().ytLink2) ||
              "https://www.youtube.com/embed/jNQXAC9IVRw",
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
  }, [formatYoutubeUrl]);

  /* ── touch detection ── */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* ── mouse handler for parallax ── */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isTouch || reducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    },
    [isTouch, reducedMotion, mouseX, mouseY]
  );

  /* ── computed ── */
  const headlineTotalMs =
    (HEADLINE_WORDS.length - 1) * WORD_STAGGER_MS + WORD_DURATION_MS;
  const sublineStartMs = headlineTotalMs + SUBLINE_DELAY_MS;

  /* ── duplicated marquee text (one DOM copy) ── */
  const marqueeContent = useMemo(() => MARQUEE_TEXT.repeat(6), []);

  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden bg-white border-b-4 border-black pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* 5. Background: parallax dot-grid, desktop only, opacity < 0.15 */}
      {!isTouch && !reducedMotion ? (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 hidden md:block"
          style={{ x: gridX, y: gridY }}
        >
          <div
            className="w-full h-full opacity-[0.12]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "2rem 2rem",
            }}
          />
        </motion.div>
      ) : (
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1px, transparent 1px)",
            backgroundSize: "2rem 2rem",
          }}
        />
      )}

      {/* 6. Section label with scramble */}
      <ScrambleLabel reducedMotion={reducedMotion} />

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 z-10 pt-16 pb-32">
        {/* Left Side: Headline & CTA */}
        <div className="flex-1 w-full lg:pt-12">
          {/* 1. Stagger headline */}
          <StaggerHeadline reducedMotion={reducedMotion} />

          {/* 2. Typewriter subline */}
          <TypewriterSubline
            reducedMotion={reducedMotion}
            startDelayMs={sublineStartMs}
          />

          {/* 3. Magnetic CTA */}
          <MagneticCTA applyUrl={applyUrl} reducedMotion={reducedMotion} />
        </div>

        {/* Right Side: Videos */}
        <div className="flex-1 w-full max-w-lg ml-auto relative flex flex-col gap-12 lg:pt-8">
          {/* 7. Video 1 — fade-and-rise, whileInView, once */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={
              reducedMotion
                ? {}
                : {
                    duration: 0.5,
                    delay: 0,
                    ease: HEADLINE_EASE,
                  }
            }
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            className="w-full relative z-20 hover:z-30"
            style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
          >
            <div className="relative aspect-video w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 overflow-hidden group">
              <div className="h-5 bg-black w-full flex items-center px-2 gap-1.5 absolute top-0 left-0 z-20">
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-red)] border border-black" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-yellow)] border border-black" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-green)] border border-black" />
              </div>
              <iframe
                src={`${ytLinks.ytLink1}?autoplay=0&controls=1&showinfo=0`}
                title="YouTube video player 1"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 pt-5 w-full h-full"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-[var(--color-shipit-yellow)] border-4 border-black -z-10" />
          </motion.div>

          {/* 7. Video 2 — 80ms apart */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={
              reducedMotion
                ? {}
                : {
                    duration: 0.5,
                    delay: 0.08,
                    ease: HEADLINE_EASE,
                  }
            }
            whileHover={reducedMotion ? {} : { scale: 1.02 }}
            className="w-full relative ml-4 lg:ml-8 z-10 hover:z-30"
            style={{ willChange: reducedMotion ? "auto" : "transform, opacity" }}
          >
            <div className="relative aspect-video w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 overflow-hidden group">
              <div className="h-5 bg-black w-full flex items-center px-2 gap-1.5 absolute top-0 left-0 z-20">
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-red)] border border-black" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-yellow)] border border-black" />
                <div className="w-2 h-2 rounded-full bg-[var(--color-shipit-green)] border border-black" />
              </div>
              <iframe
                src={`${ytLinks.ytLink2}?autoplay=0&controls=1&showinfo=0`}
                title="YouTube video player 2"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 pt-5 w-full h-full"
              />
            </div>
            <div className="absolute -top-3 -left-3 w-16 h-16 bg-[var(--color-shipit-blue)] border-4 border-black -z-10" />
          </motion.div>
        </div>
      </div>

      {/* 8. Scroll cue */}
      <ScrollCue reducedMotion={reducedMotion} />

      {/* 4. Marquee ticker — CSS animation, speed doubles on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden bg-black text-white py-4 border-t-4 border-black z-10"
        onMouseEnter={() => setMarqueeHover(true)}
        onMouseLeave={() => setMarqueeHover(false)}
      >
        <div
          className={`hero-marquee-track whitespace-nowrap flex ${marqueeHover ? "hero-marquee-fast" : ""}`}
        >
          <span className="text-xl md:text-3xl font-black tracking-widest uppercase px-4 shrink-0">
            {marqueeContent}
          </span>
          <span
            className="text-xl md:text-3xl font-black tracking-widest uppercase px-4 shrink-0"
            aria-hidden="true"
          >
            {marqueeContent}
          </span>
        </div>
      </div>
    </section>
  );
}
