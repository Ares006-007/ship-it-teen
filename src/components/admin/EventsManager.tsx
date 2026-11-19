"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Trash2,
  Plus,
  Edit2,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import type { FirestoreEvent, EventImage, EventProject } from "@/lib/eventTypes";
import { isPast } from "@/lib/eventStatus";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

/* ─── blank form state ───────────────────────────────────────── */

const blankForm = (): Omit<FirestoreEvent, "id" | "createdAt"> => ({
  date: "",
  title: "",
  location: "",
  status: "OPEN",
  link: "",
  coverImage: "",
  startDate: "",
  endDate: "",
  timezone: "Asia/Kolkata",
  description: "",
  images: [],
  projects: [],
  recapVideoUrl: "",
});

/* ─── small input helpers ────────────────────────────────────── */

const inputClass =
  "w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins";

const labelClass = "block text-sm font-poppins font-bold uppercase text-black mb-2";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className="text-xs text-black/50 font-poppins mb-1">{hint}</p>}
      {children}
    </div>
  );
}

/* ─── repeating image rows ───────────────────────────────────── */

function ImageRows({
  images,
  onChange,
}: {
  images: EventImage[];
  onChange: (imgs: EventImage[]) => void;
}) {
  const add = () => onChange([...images, { url: "", alt: "", caption: "" }]);
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<EventImage>) => {
    const next = [...images];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {images.map((img, i) => (
        <div key={i} className="border-2 border-black p-3 space-y-2 relative">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-2 right-2 text-black hover:text-red-600"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <input
            type="url"
            placeholder="Image URL"
            value={img.url}
            onChange={(e) => update(i, { url: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Alt text (required)"
            value={img.alt}
            onChange={(e) => update(i, { alt: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Caption (optional)"
            value={img.caption ?? ""}
            onChange={(e) => update(i, { caption: e.target.value })}
            className={inputClass}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm font-bold uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
      >
        + Add Image
      </button>
    </div>
  );
}

/* ─── repeating project rows ─────────────────────────────────── */

function ProjectRows({
  projects,
  onChange,
}: {
  projects: EventProject[];
  onChange: (ps: EventProject[]) => void;
}) {
  const add = () =>
    onChange([...projects, { name: "", url: "", builder: "", description: "" }]);
  const remove = (i: number) =>
    onChange(projects.filter((_, idx) => idx !== i));
  const update = (i: number, patch: Partial<EventProject>) => {
    const next = [...projects];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {projects.map((proj, i) => (
        <div key={i} className="border-2 border-black p-3 space-y-2 relative">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-2 right-2 text-black hover:text-red-600"
            aria-label="Remove project"
          >
            <X className="w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder="Project name (required)"
            value={proj.name}
            onChange={(e) => update(i, { name: e.target.value })}
            className={inputClass}
          />
          <input
            type="url"
            placeholder="Project URL (required)"
            value={proj.url}
            onChange={(e) => update(i, { url: e.target.value })}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Builder / team (optional)"
            value={proj.builder ?? ""}
            onChange={(e) => update(i, { builder: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Short description (optional)"
            value={proj.description ?? ""}
            onChange={(e) => update(i, { description: e.target.value })}
            rows={2}
            className={inputClass}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="text-sm font-bold uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
      >
        + Add Project
      </button>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────── */

export function EventsManager() {
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [form, setForm] = useState(blankForm());

  const patch = (key: keyof ReturnType<typeof blankForm>, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  /* fetch */
  const fetchEvents = async () => {
    try {
      const snap = await getDocs(collection(db, "events"));
      const rows: FirestoreEvent[] = [];
      snap.forEach((d) => rows.push({ id: d.id, ...d.data() } as FirestoreEvent));
      setEvents(rows);
    } catch (err: any) {
      console.error(err);
      setError("Could not fetch events. Check Firestore rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError("");

    // Warn if startDate missing
    if (!form.startDate) {
      console.warn(
        "[EventsManager] Event saved without startDate — it will be excluded from both Upcoming and Experiences until a startDate is set."
      );
    }

    // Sanitise empty arrays / strings
    const payload: Partial<FirestoreEvent> = {
      ...form,
      images: (form.images ?? []).filter((i) => i.url.trim()),
      projects: (form.projects ?? []).filter((p) => p.name.trim() && p.url.trim()),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "events", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "events"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      setForm(blankForm());
      setShowAdvanced(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editingId ? "update" : "add"} event.`);
    } finally {
      setAdding(false);
    }
  };

  /* delete */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event? No going back.")) return;
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch {
      setError("Failed to delete event.");
    }
  };

  /* start editing */
  const startEdit = (event: FirestoreEvent) => {
    setForm({
      date: event.date ?? "",
      title: event.title ?? "",
      location: event.location ?? "",
      status: event.status ?? "OPEN",
      link: event.link ?? "",
      coverImage: event.coverImage ?? "",
      startDate: event.startDate ?? "",
      endDate: event.endDate ?? "",
      timezone: event.timezone ?? "Asia/Kolkata",
      description: event.description ?? "",
      images: event.images ?? [],
      projects: event.projects ?? [],
      recapVideoUrl: event.recapVideoUrl ?? "",
    });
    setEditingId(event.id);
    setShowAdvanced(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* sorted list: upcoming first, then past */
  const upcoming = events.filter((e) => !isPast(e));
  const past = events.filter((e) => isPast(e));

  return (
    <div className="space-y-12">
      {error && (
        <div className="bg-[var(--color-shipit-red)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ERROR: {error}
        </div>
      )}

      {/* ── Form ── */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-[var(--color-shipit-blue)] text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Action Area
        </div>

        <h3 className="text-2xl font-sora font-black uppercase text-black mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2 border-2 border-black">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            {editingId ? "Edit Event" : "Add New Event"}
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(blankForm());
                setShowAdvanced(false);
              }}
              className="text-sm font-poppins underline hover:text-black/70"
            >
              Cancel Edit
            </button>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Core fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Display Date (e.g. NOV 16TH)" hint="Shown on the card exactly as typed.">
              <input
                type="text"
                required
                value={form.date}
                onChange={(e) => patch("date", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Title (e.g. BOBA BASH)">
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => patch("title", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Location">
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => patch("location", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Status (OPEN, WAITLIST, RSVP YET TO OPEN)">
              <input
                type="text"
                required
                value={form.status}
                onChange={(e) => patch("status", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="RSVP Link (URL)">
              <input
                type="url"
                value={form.link ?? ""}
                onChange={(e) => patch("link", e.target.value)}
                className={inputClass}
              />
            </Field>
            <ImageUploadField
              label="Cover Image"
              value={form.coverImage ?? ""}
              onChange={(url) => patch("coverImage", url)}
              storageFolder="events/covers"
              hint="Upload an image file directly or paste an external image URL."
            />
            <Field
              label="Start Date (ISO 8601)"
              hint="e.g. 2026-11-16 or 2026-11-16T10:00:00 — REQUIRED for lifecycle logic."
            >
              <input
                type="text"
                placeholder="2026-11-16"
                value={form.startDate ?? ""}
                onChange={(e) => patch("startDate", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              label="End Date (ISO 8601)"
              hint="Leave blank to use Start Date. e.g. 2026-11-16T18:00:00"
            >
              <input
                type="text"
                placeholder="2026-11-16"
                value={form.endDate ?? ""}
                onChange={(e) => patch("endDate", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
          >
            {showAdvanced ? (
              <>
                <ChevronUp className="w-4 h-4" /> Hide past-event fields
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" /> Add description / images / projects
              </>
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-6 border-t-4 border-black pt-6">
              <Field
                label="Description (shown in accordion)"
                hint="Plain text or Markdown."
              >
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => patch("description", e.target.value)}
                  rows={5}
                  className={inputClass}
                />
              </Field>

              <Field label="Recap Video URL (optional)">
                <input
                  type="url"
                  value={form.recapVideoUrl ?? ""}
                  onChange={(e) => patch("recapVideoUrl", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div>
                <p className={labelClass}>Images (shown in gallery modal)</p>
                <ImageRows
                  images={form.images ?? []}
                  onChange={(imgs) => patch("images", imgs)}
                />
              </div>

              <div>
                <p className={labelClass}>Projects (shown in drawer)</p>
                <ProjectRows
                  projects={form.projects ?? []}
                  onChange={(ps) => patch("projects", ps)}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={adding}
            className="flex items-center gap-3 bg-black text-white font-black uppercase tracking-widest px-8 py-4 border-4 border-black hover:bg-[#F5F474] hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
          >
            {adding && <Loader2 className="w-5 h-5 animate-spin" />}
            {editingId ? "Save Changes" : "Add Event"}
          </button>
        </form>
      </div>

      {/* ── Event list ── */}
      <div className="space-y-4">
        <h3 className="text-xl font-sora font-black uppercase text-black/40 tracking-widest">
          All Events ({upcoming.length} upcoming · {past.length} past)
        </h3>

        {loading ? (
          <div className="flex items-center gap-2 py-8 text-black/50 font-bold uppercase tracking-widest">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
          </div>
        ) : events.length === 0 ? (
          <div className="border-4 border-dashed border-black/20 py-12 text-center font-bold uppercase tracking-widest text-black/40">
            No events yet. Add one above.
          </div>
        ) : (
          <>
            {[
              { label: "Upcoming", items: upcoming },
              { label: "Past", items: past },
            ].map(({ label, items }) =>
              items.length === 0 ? null : (
                <div key={label} className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-black/40 border-b-2 border-black/10 pb-1">
                    {label}
                  </div>
                  {items.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white border-4 border-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between group hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all gap-4"
                    >
                      <div className="flex gap-6 items-center w-full">
                        {event.coverImage && (
                          <div className="hidden sm:block shrink-0 w-24 h-16 border-2 border-black overflow-hidden bg-neutral-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={event.coverImage}
                              alt={event.title}
                              width={96}
                              height={64}
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="bg-[var(--color-shipit-yellow)] px-2 py-1 border-2 border-black font-bold uppercase text-xs">
                              {event.date}
                            </span>
                            {event.startDate && (
                              <span className="bg-black/5 px-2 py-1 border-2 border-black/20 font-bold uppercase text-xs font-poppins">
                                {event.startDate}
                              </span>
                            )}
                            <span
                              className={`px-2 py-1 border-2 border-black font-bold uppercase text-xs ${
                                ["WAITLIST", "CLOSED"].includes(
                                  event.status?.toUpperCase() ?? ""
                                )
                                  ? "bg-[var(--color-shipit-red)]"
                                  : event.status?.toUpperCase() ===
                                    "RSVP YET TO OPEN"
                                  ? "bg-gray-300"
                                  : "bg-[var(--color-shipit-green)]"
                              }`}
                            >
                              {event.status}
                            </span>
                            {isPast(event) && (
                              <span className="bg-black text-white px-2 py-1 border-2 border-black font-bold uppercase text-xs">
                                PAST
                              </span>
                            )}
                          </div>
                          <h4 className="text-2xl font-sora font-black uppercase">
                            {event.title}
                          </h4>
                          <div className="text-base text-black/70 font-poppins font-bold uppercase mt-1">
                            {event.location}
                          </div>
                          {/* quick recap summary */}
                          <div className="flex gap-3 mt-2 text-xs font-bold uppercase tracking-widest text-black/40">
                            {(event.images?.length ?? 0) > 0 && (
                              <span>{event.images!.length} img</span>
                            )}
                            {(event.projects?.length ?? 0) > 0 && (
                              <span>{event.projects!.length} projects</span>
                            )}
                            {event.description && <span>desc ✓</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        <button
                          onClick={() => startEdit(event)}
                          className="bg-white hover:bg-black hover:text-white border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                          title="Edit Event"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="bg-white hover:bg-[var(--color-shipit-red)] border-4 border-black p-3 text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                          title="Delete Event"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
