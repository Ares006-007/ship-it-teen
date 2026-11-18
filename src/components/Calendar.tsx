"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useEvents } from "@/lib/useEvents";
import type { FirestoreEvent } from "@/lib/eventTypes";
import { getEndTimestampMs } from "@/lib/eventStatus";

/* ─── helpers ───────────────────────────────────────────────── */

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function sortEvents(
  events: FirestoreEvent[],
  sortKey: string
): FirestoreEvent[] {
  return [...events].sort((a, b) => {
    switch (sortKey) {
      case "date-asc": {
        const ta = getEndTimestampMs(a) ?? 0;
        const tb = getEndTimestampMs(b) ?? 0;
        return ta - tb;
      }
      case "date-desc": {
        const ta = getEndTimestampMs(a) ?? 0;
        const tb = getEndTimestampMs(b) ?? 0;
        return tb - ta;
      }
      case "title-asc":
        return (a.title ?? "").localeCompare(b.title ?? "");
      case "title-desc":
        return (b.title ?? "").localeCompare(a.title ?? "");
      default:
        return 0;
    }
  });
}

/* ─── skeleton row ───────────────────────────────────────────── */

function SkeletonRow() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-4 border-black/20 p-6 md:p-8 animate-pulse gap-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 w-full md:w-auto">
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

/* ─── Calendar ───────────────────────────────────────────────── */

export function Calendar() {
  const { upcoming, loading } = useEvents();
  const [sortKey, setSortKey] = useState("date-asc");

  const sorted = sortEvents(upcoming, sortKey);

  return (
    <section
      id="calendar"
      className="relative py-32 border-b-4 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <span className="text-xl md:text-2xl font-bold tracking-widest text-black/40">
            04 // UPCOMING EVENTS
          </span>
          <div className="flex items-center gap-4">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="bg-white border-4 border-black text-black font-bold font-poppins uppercase text-sm py-2 px-2 focus:outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <option value="date-asc">Sort by Date (Asc)</option>
              <option value="date-desc">Sort by Date (Desc)</option>
              <option value="title-asc">Sort by Title (A-Z)</option>
              <option value="title-desc">Sort by Title (Z-A)</option>
            </select>

            {/* Sync to Calendar — only exports upcoming */}
            <button
              onClick={() => exportToICS(sorted)}
              className="hidden sm:block text-sm font-bold tracking-widest uppercase bg-black text-white px-3 py-2 hover:bg-[#F5F474] hover:text-black border-4 border-black transition-colors"
            >
              SYNC TO CALENDAR
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : sorted.length === 0 ? (
            <div className="text-center py-16 border-4 border-dashed border-black/20">
              <p className="text-xl font-black uppercase tracking-widest text-black/50 mb-4">
                Nothing scheduled right now.
              </p>
              <a
                href="/work-with-us"
                className="inline-block px-6 py-3 bg-[#F5F474] border-4 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform text-black"
              >
                Propose an event →
              </a>
            </div>
          ) : (
            sorted.map((event, idx) => (
              <EventRow key={event.id} event={event} idx={idx} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── single event row ───────────────────────────────────────── */

function EventRow({ event, idx }: { event: FirestoreEvent; idx: number }) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImgError = () => {
    if (!imgRef.current) return;
    imgRef.current.style.display = "none";
    const parent = imgRef.current.parentElement;
    if (!parent) return;
    const tile = document.createElement("div");
    tile.className =
      "hidden md:flex w-16 h-16 items-center justify-center bg-black/10 border-2 border-black font-black text-black text-xl";
    tile.textContent = getInitials(event.title);
    parent.appendChild(tile);
  };

  const isDisabled =
    ["WAITLIST", "CLOSED", "RSVP YET TO OPEN"].includes(
      event.status?.toUpperCase() ?? ""
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      whileHover={{ x: 10 }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between border-4 border-black p-6 md:p-8 hover:bg-black hover:text-white transition-colors group"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-12 mb-6 md:mb-0 w-full md:w-auto">
        {/* Cover image — explicit dimensions prevent layout shift */}
        {event.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={event.coverImage}
            alt={event.title}
            width={256}
            height={144}
            onError={handleImgError}
            className="hidden md:block w-64 h-auto shrink-0 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          />
        )}

        {/* Date label */}
        <div className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#F54D28] group-hover:text-[#2DDFFF] transition-colors w-40 shrink-0">
          {event.date}
        </div>

        <div>
          <h4 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-2">
            {event.title}
          </h4>
          <div className="text-lg font-bold uppercase tracking-widest opacity-70">
            {event.location}
          </div>
        </div>
      </div>

      {/* CTA button */}
      <a
        href={event.link || "#"}
        target={event.link ? "_blank" : "_self"}
        rel="noopener noreferrer"
        aria-disabled={isDisabled}
        className={`inline-block px-8 py-4 font-black uppercase tracking-widest border-4 transition-all ${
          isDisabled
            ? "border-gray-500 text-gray-500 bg-transparent cursor-not-allowed group-hover:border-gray-400 group-hover:text-gray-400"
            : "border-black bg-[#F5F474] text-black group-hover:bg-[#2DDFFF] group-hover:border-black group-hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
        }`}
      >
        {event.status}
      </a>
    </motion.div>
  );
}

/* ─── ICS export (upcoming only) ────────────────────────────── */

function exportToICS(events: FirestoreEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ShipIt Teens//Events//EN",
  ];
  for (const ev of events) {
    if (!ev.startDate) continue;
    const dtStart = ev.startDate.replace(/[-:]/g, "").slice(0, 15);
    const dtEnd = ev.endDate
      ? ev.endDate.replace(/[-:]/g, "").slice(0, 15)
      : dtStart;
    lines.push(
      "BEGIN:VEVENT",
      `SUMMARY:${ev.title}`,
      `LOCATION:${ev.location}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      ev.link ? `URL:${ev.link}` : "",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.filter(Boolean).join("\r\n")], {
    type: "text/calendar",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shipit-events.ics";
  a.click();
  URL.revokeObjectURL(url);
}
