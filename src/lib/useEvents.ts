"use client";

/**
 * useEvents.ts
 *
 * Shared hook that fetches the single `events` Firestore collection and
 * splits it into `upcoming` and `past` arrays using the shared classifyEvent()
 * function.
 *
 * Rules:
 * - One events data source feeds both sections.
 * - An event is UPCOMING until its end moment passes, then PAST (03 // EXPERIENCES).
 * - Never in both sections at once.
 * - Invalid or missing dates: logged via console.warn and excluded from both sections.
 * - Re-checks on tab focus (visibilitychange) so an event moves sections without a redeploy.
 */

import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { classifyEvent } from "@/lib/eventStatus";
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
      const nextUpcoming: FirestoreEvent[] = [];
      const nextPast: FirestoreEvent[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<FirestoreEvent, "id">;
        const event: FirestoreEvent = { id: docSnap.id, ...data };

        const status = classifyEvent(event);
        if (status === "upcoming") {
          nextUpcoming.push(event);
        } else if (status === "past") {
          nextPast.push(event);
        }
        // If status === 'invalid', classifyEvent logs console.warn and we exclude it!
      });

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

    // Re-split on tab focus (handles day boundaries without a redeploy)
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
