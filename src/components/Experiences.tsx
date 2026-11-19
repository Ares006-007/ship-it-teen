"use client";

import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import { useEvents } from "@/lib/useEvents";
import { getEndTimestampMs } from "@/lib/eventStatus";
import type { FirestoreEvent } from "@/lib/eventTypes";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import { ProjectsDrawer } from "@/components/ui/ProjectsDrawer";
import { ChevronDown } from "lucide-react";

/* ─── helpers ───────────────────────────────────────────────── */

function getInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function sortPast(events: FirestoreEvent[]): FirestoreEvent[] {
  // Most recent first by endDate desc
  return [...events].sort((a, b) => {
    const ta = getEndTimestampMs(a) ?? (a.createdAt?.seconds ?? 0) * 1000;
    const tb = getEndTimestampMs(b) ?? (b.createdAt?.seconds ?? 0) * 1000;
    return tb - ta;
  });
}

/* ─── skeleton ───────────────────────────────────────────────── */

function SkeletonRow() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-4 border-black/20 p-6 md:p-8 animate-pulse gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 w-full md:w-auto">
        <div className="hidden md:block w-64 h-36 bg-black/10 rounded" />
        <div className="h-10 w-32 bg-black/10 rounded" />
        <div className="space-y-2">
          <div className="h-8 w-56 bg-black/10 rounded" />
          <div className="h-4 w-40 bg-black/10 rounded" />
        </div>
      </div>
      <div className="h-12 w-28 bg-black/10 rounded" />
    </div>
  );
}

/* ─── single past event card ─────────────────────────────────── */

function PastEventCard({
  event,
  idx,
  openDescId,
  setOpenDescId,
}: {
  event: FirestoreEvent;
  idx: number;
  openDescId: string | null;
  setOpenDescId: (id: string | null) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const hasImages = (event.images?.length ?? 0) > 0;
  const hasProjects = (event.projects?.length ?? 0) > 0;
  const hasDescription = !!event.description?.trim();
  const hasAny = hasImages || hasProjects || hasDescription;

  const imgTriggerRef = useRef<HTMLButtonElement>(null);
  const projTriggerRef = useRef<HTMLButtonElement>(null);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const descOpen = openDescId === event.id;
  const toggleDesc = useCallback(() => {
    setOpenDescId(descOpen ? null : event.id);
  }, [descOpen, event.id, setOpenDescId]);

  const btnClass =
    "px-5 py-2 font-black uppercase tracking-widest text-sm border-4 border-black bg-[#F5F474] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#2DDFFF] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-0 active:shadow-none";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.4, delay: idx * 0.08 }}
        className="border-4 border-black group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
      >
        {/* Main row — matches Calendar.tsx layout */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 gap-4 hover:bg-black hover:text-white transition-colors">
          {/* Left: image + meta */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 w-full md:w-auto">
            {/* Cover image with explicit dimensions and neutral initials fallback */}
            <div className="hidden md:block w-64 h-36 shrink-0 overflow-hidden border-2 border-black bg-black/5">
              {event.coverImage && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.coverImage}
                  alt={event.title}
                  width={256}
                  height={144}
                  onError={() => setImgError(true)}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black/10 font-black text-black group-hover:text-white text-2xl uppercase tracking-widest transition-colors">
                  {getInitials(event.title)}
                </div>
              )}
            </div>

            {/* Date */}
            <div className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#F54D28] group-hover:text-[#2DDFFF] transition-colors w-40 shrink-0">
              {event.date}
            </div>

            {/* Title + location */}
            <div>
              <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2 group-hover:text-[#2DDFFF] transition-colors">
                {event.title}
              </h4>
              <div className="text-lg font-bold uppercase tracking-widest opacity-70">
                {event.location}
              </div>
            </div>
          </div>

          {/* Right: VIEW EVENT action button */}
          {event.link ? (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 font-black uppercase tracking-widest border-4 border-black bg-[#F5F474] text-black group-hover:bg-[#2DDFFF] group-hover:border-black group-hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all shrink-0"
            >
              VIEW EVENT →
            </a>
          ) : (
            <button
              type="button"
              onClick={hasDescription ? toggleDesc : (hasImages ? () => setGalleryOpen(true) : undefined)}
              className="inline-block px-8 py-4 font-black uppercase tracking-widest border-4 border-black bg-[#F5F474] text-black group-hover:bg-[#2DDFFF] group-hover:border-black group-hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all shrink-0 cursor-pointer"
            >
              VIEW RECAP →
            </button>
          )}
        </div>

        {/* Button bar: IMAGES, PROJECTS, DESCRIPTION */}
        {hasAny ? (
          <div className="flex flex-wrap gap-3 px-6 md:px-8 pb-6 border-t-4 border-black pt-4 bg-white group-hover:bg-white">
            {hasImages && (
              <button
                ref={imgTriggerRef}
                onClick={() => setGalleryOpen(true)}
                className={btnClass}
              >
                IMAGES
              </button>
            )}
            {hasProjects && (
              <button
                ref={projTriggerRef}
                onClick={() => setDrawerOpen(true)}
                className={btnClass}
              >
                PROJECTS
              </button>
            )}
            {hasDescription && (
              <button
                onClick={toggleDesc}
                aria-expanded={descOpen}
                className={`${btnClass} flex items-center gap-2`}
              >
                DESCRIPTION
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    descOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
          </div>
        ) : (
          <div className="px-6 md:px-8 pb-6 pt-4 border-t-4 border-black bg-white text-sm font-bold uppercase tracking-widest text-black/40">
            Recap coming soon
          </div>
        )}

        {/* Description accordion — CSS grid trick, no layout shift */}
        {hasDescription && (
          <div
            className={`grid transition-all duration-300 ease-in-out bg-white border-t-4 border-black ${
              descOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="px-6 md:px-8 py-6 font-poppins text-black/80 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Image gallery modal */}
      {hasImages && (
        <ImageGalleryModal
          images={event.images!}
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          triggerRef={imgTriggerRef}
        />
      )}

      {/* Projects drawer */}
      {hasProjects && (
        <ProjectsDrawer
          projects={event.projects!}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          triggerRef={projTriggerRef}
          eventTitle={event.title}
        />
      )}
    </>
  );
}

/* ─── Experiences section ────────────────────────────────────── */

export function Experiences() {
  const { past, loading } = useEvents();
  const [openDescId, setOpenDescId] = useState<string | null>(null);

  const sorted = sortPast(past);

  return (
    <section
      id="experiences"
      className="relative py-32 border-b-4 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            03 // PAST EDITIONS &amp; RECAPS
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : sorted.length === 0 ? (
            <div className="text-center py-16 border-4 border-dashed border-black/20">
              <p className="text-xl font-black uppercase tracking-widest text-black/50">
                Our first recap lands after the next event.
              </p>
            </div>
          ) : (
            sorted.map((event, idx) => (
              <PastEventCard
                key={event.id}
                event={event}
                idx={idx}
                openDescId={openDescId}
                setOpenDescId={setOpenDescId}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
