// Shared event type used across Calendar, Experiences, and admin EventsManager

export interface EventImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface EventProject {
  name: string;
  url: string;
  builder?: string;
  description?: string;
}

export interface FirestoreEvent {
  id: string;
  date: string;          // display string kept for backwards compat (e.g. "Nov 16th 2026")
  title: string;
  location: string;
  status: string;
  link?: string;
  coverImage?: string;
  createdAt?: { seconds: number };
  // ISO 8601 dates for lifecycle logic
  startDate?: string;    // e.g. "2026-11-16" or "2026-11-16T10:00:00"
  endDate?: string;      // e.g. "2026-11-16" or "2026-11-16T18:00:00" (defaults to startDate)
  timezone?: string;     // defaults to "Asia/Kolkata"
  description?: string;  // markdown string
  images?: EventImage[];
  projects?: EventProject[];
  recapVideoUrl?: string;
}
