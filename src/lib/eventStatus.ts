/**
 * eventStatus.ts
 *
 * Shared isPast() logic for the ShipIt Teens event lifecycle.
 *
 * Rules:
 * - Always compute in Asia/Kolkata (UTC+5:30 = +19800 seconds). Never use
 *   the browser's local timezone or Date.getTimezoneOffset().
 * - An event is PAST only after its end moment has passed.
 * - If endDate is missing, use startDate.
 * - If neither is set, treat the event as UPCOMING (log a warning).
 * - If a date string contains a time component (the letter "T"), use that
 *   exact time in IST. Otherwise, treat end-of-day (23:59:59.999 IST).
 * - IST = UTC+5:30, so IST midnight = UTC 18:30 previous day.
 *
 * This module is safe to import from both Server Components and Client
 * Components — it has no browser-only APIs and no Next.js-specific imports.
 */

import type { FirestoreEvent } from "./eventTypes";

/** IST offset in milliseconds (UTC+5:30). */
const IST_OFFSET_MS = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 19 800 000

/**
 * Convert an ISO date string to a UTC timestamp in milliseconds, treating
 * the string as IST when it has no explicit timezone designator.
 *
 * "2026-11-16"            → 2026-11-16T23:59:59.999 IST  (end-of-day)
 * "2026-11-16T18:00:00"   → 2026-11-16T18:00:00.000 IST  (exact time)
 *
 * Returns null and logs a warning if the string cannot be parsed.
 */
export function istTimestampMs(
  dateStr: string,
  endOfDay = false
): number | null {
  if (!dateStr || typeof dateStr !== "string") return null;

  const hasTime = dateStr.includes("T");

  // Normalise: strip any existing Z / +HH:MM suffix so we treat it as local IST
  const bare = dateStr.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");

  let utcMs: number;

  if (hasTime) {
    // e.g. "2026-11-16T18:00:00" — treat as IST
    // Parse as if UTC then subtract the IST offset to get real UTC
    const asUtc = Date.parse(bare + "Z");
    if (isNaN(asUtc)) {
      console.warn(`[eventStatus] Cannot parse date string: "${dateStr}"`);
      return null;
    }
    utcMs = asUtc - IST_OFFSET_MS;
  } else {
    // e.g. "2026-11-16" — use end-of-day 23:59:59.999 IST if endOfDay, else 00:00:00 IST
    const parts = bare.split("-").map(Number);
    if (parts.length < 3 || parts.some(isNaN)) {
      console.warn(`[eventStatus] Cannot parse date string: "${dateStr}"`);
      return null;
    }
    const [y, m, d] = parts;
    if (endOfDay) {
      // 23:59:59.999 IST = UTC: 23:59:59.999 − 5:30 = 18:29:59.999
      utcMs = Date.UTC(y, m - 1, d, 23, 59, 59, 999) - IST_OFFSET_MS;
    } else {
      // 00:00:00.000 IST = UTC: − 5:30 = previous day 18:30:00.000
      utcMs = Date.UTC(y, m - 1, d, 0, 0, 0, 0) - IST_OFFSET_MS;
    }
  }

  return utcMs;
}

/**
 * Returns the UTC ms timestamp after which an event is considered PAST.
 * Uses endDate if available; falls back to startDate.
 * Returns null if neither is parseable (logs a warning).
 */
export function getEndTimestampMs(
  event: Pick<FirestoreEvent, "startDate" | "endDate">
): number | null {
  const raw = event.endDate || event.startDate;
  if (!raw) return null;

  const hasTime = raw.includes("T");
  return istTimestampMs(raw, !hasTime);
}

/**
 * isPast(event) → true if the event's end moment has already passed in IST.
 *
 * "Past" means: Date.now() > end timestamp (ms).
 * An event whose endDate is today (without a time component) stays UPCOMING
 * until 23:59:59.999 IST on that day.
 *
 * If the event has no startDate / endDate at all, it is treated as UPCOMING
 * (we cannot exclude what we don't know) and a warning is logged.
 */
export function isPast(
  event: Pick<FirestoreEvent, "startDate" | "endDate">
): boolean {
  const endMs = getEndTimestampMs(event);
  if (endMs === null) return false; // no parseable date → keep as upcoming
  return Date.now() > endMs;
}
