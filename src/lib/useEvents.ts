"use client";

/**
 * useEvents.ts
 *
 * Shared hook that fetches the `events` Firestore collection once and
 * splits it into `upcoming` and `past` arrays using the shared isPast()
 * function.
 *
 * Re-checks on tab focus (visibilitychange) so an event that crosses its
 * end time while the user has the tab open moves sections without a redeploy.
 */

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isPast } from "@/lib/eventStatus";
import type { FirestoreEvent } from "@/lib/eventTypes";

export interface UseEventsResult {
  upcoming: FirestoreEvent[];
  past: FirestoreEvent[];
  loading: boolean;
  error: string | null;
}

export function useEvents(): UseEventsResult {
  const [upcoming, setUpcoming] = useState<FirestoreEvent[]>([]);
  const [past, setPast] = useState<FirestoreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSplit = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const all: FirestoreEvent[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<FirestoreEvent, "id">;
        // Validate: if startDate present but unparseable, log and skip
        if (
          data.startDate &&
          isNaN(Date.parse(data.startDate.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "") + (data.startDate.includes("T") ? "Z" : "T00:00:00Z")))
        ) {
          console.warn(
            `[useEvents] Event "${data.title}" has unparseable startDate "${data.startDate}" — excluded from both sections.`
          );
          return;
        }
        all.push({ id: docSnap.id, ...data });
      });

      const nextUpcoming: FirestoreEvent[] = [];
      const nextPast: FirestoreEvent[] = [];

      for (const event of all) {
        if (isPast(event)) {
          nextPast.push(event);
        } else {
          nextUpcoming.push(event);
        }
      }

      setUpcoming(nextUpcoming);
      setPast(nextPast);
      setError(null);
    } catch (err: any) {
      console.error("[useEvents] Firestore fetch error:", err);
      setError("Could not load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSplit();

    // Re-split on tab focus (handles day boundaries without a redeploy).
    // We re-fetch to also pick up any newly added events.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchAndSplit();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchAndSplit]);

  return { upcoming, past, loading, error };
}
