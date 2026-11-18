/**
 * eventStatus.ts
 *
 * Shared isPast() and event classification logic for the ShipIt Teens event lifecycle.
 *
 * Rules:
 * - Always compute in Asia/Kolkata (UTC+5:30 = +19,800,000 ms). Never use
 *   the browser's local timezone or Date.getTimezoneOffset().
 * - An event is PAST only after its end moment has passed.
 * - If endDate is missing, use startDate. If startDate is missing, fallback to parsing date.
 * - If date cannot be parsed, log a warning and return null (excluded from both sections).
 * - If a date string contains a time component, use that exact time in IST.
 *   Otherwise, treat as end-of-day (23:59:59.999 IST).
 * - IST = UTC+5:30.
 *
 * This module is safe to import from both Server and Client Components.
 */

import type { FirestoreEvent } from "./eventTypes";

/** IST offset in milliseconds (UTC+5:30). */
export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000; // 19,800,000 ms

const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

export interface ParsedDateComponents {
  y: number;
  m: number;
  d: number;
  hh: number;
  mm: number;
  ss: number;
  hasTime: boolean;
}

/**
 * Parses either an ISO string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss) or
 * human string (e.g. "15th NOV 2026", "31 Oct 2026", "Nov 16, 2026").
 */
export function parseDateComponents(str?: string): ParsedDateComponents | null {
  if (!str || typeof str !== "string") return null;
  const clean = str.trim();

  // 1. Try ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm(:ss)
  const isoMatch = clean.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/
  );
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    const hasTime = isoMatch[4] !== undefined;
    const hh = hasTime ? parseInt(isoMatch[4], 10) : 0;
    const mm = hasTime ? parseInt(isoMatch[5], 10) : 0;
    const ss = isoMatch[6] !== undefined ? parseInt(isoMatch[6], 10) : 0;
    if (m < 1 || m > 12 || d < 1 || d > 31) return null;
    return { y, m, d, hh, mm, ss, hasTime };
  }

  // 2. Try human format: "15th NOV 2026", "31 Oct 2026", "Nov 16, 2026"
  const humanMatch = clean.match(
    /^(?:(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)|([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?),?\s+(\d{4})/i
  );
  if (humanMatch) {
    const dStr = humanMatch[1] || humanMatch[4];
    const mStr = humanMatch[2] || humanMatch[3];
    const yStr = humanMatch[5];
    const d = parseInt(dStr, 10);
    const m = MONTH_MAP[mStr.toLowerCase()];
    const y = parseInt(yStr, 10);
    if (!m || d < 1 || d > 31) return null;
    return { y, m, d, hh: 0, mm: 0, ss: 0, hasTime: false };
  }

  return null;
}

/**
 * Returns the UTC timestamp (ms) after which the event is PAST in Asia/Kolkata.
 * Returns null if the event's dates cannot be parsed.
 */
export function getEndTimestampMs(
  event: Pick<FirestoreEvent, "startDate" | "endDate"> & { date?: string; title?: string }
): number | null {
  const raw = event.endDate || event.startDate || event.date;
  if (!raw) {
    console.warn(`[eventStatus] Event "${event.title || 'Untitled'}" is missing dates — excluded from both sections.`);
    return null;
  }

  const parsed = parseDateComponents(raw);
  if (!parsed) {
    console.warn(`[eventStatus] Event "${event.title || 'Untitled'}" has unparseable date "${raw}" — excluded from both sections.`);
    return null;
  }

  const { y, m, d, hh, mm, ss, hasTime } = parsed;

  if (hasTime) {
    // Exact time in IST -> UTC ms
    return Date.UTC(y, m - 1, d, hh, mm, ss, 0) - IST_OFFSET_MS;
  } else {
    // End of day in IST (23:59:59.999 IST) -> UTC ms
    return Date.UTC(y, m - 1, d, 23, 59, 59, 999) - IST_OFFSET_MS;
  }
}

/**
 * Classifies an event into 'upcoming', 'past', or 'invalid'.
 * Invalid events must be excluded from both sections.
 */
export function classifyEvent(
  event: FirestoreEvent,
  nowMs: number = Date.now()
): "upcoming" | "past" | "invalid" {
  const endMs = getEndTimestampMs(event);
  if (endMs === null) {
    return "invalid";
  }
  return nowMs > endMs ? "past" : "upcoming";
}

/**
 * Returns true if the event has ended in Asia/Kolkata.
 * Returns false if still upcoming or if dates are invalid.
 */
export function isPast(
  event: FirestoreEvent,
  nowMs: number = Date.now()
): boolean {
  return classifyEvent(event, nowMs) === "past";
}
