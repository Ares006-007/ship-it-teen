"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Sparkles,
  Loader2,
  Image as ImageIcon,
  FolderGit2,
  FileText,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Edit3,
} from "lucide-react";
import type { FirestoreEvent, EventImage, EventProject } from "@/lib/eventTypes";
import { isPast } from "@/lib/eventStatus";

export function ExperiencesManager() {
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // Filter mode: "past" (default) or "all"
  const [filterMode, setFilterMode] = useState<"past" | "all">("past");

  // Selected event for editing recap
  const [editingEvent, setEditingEvent] = useState<FirestoreEvent | null>(null);

  // New Experience / Event modal state
  const [isCreating, setIsCreating] = useState(false);

  // Recap Form State
  const [recapDesc, setRecapDesc] = useState("");
  const [recapVideo, setRecapVideo] = useState("");
  const [recapImages, setRecapImages] = useState<EventImage[]>([]);
  const [recapProjects, setRecapProjects] = useState<EventProject[]>([]);

  // Temp fields for adding a single image
  const [newImgUrl, setNewImgUrl] = useState("");
  const [newImgAlt, setNewImgAlt] = useState("");
  const [newImgCaption, setNewImgCaption] = useState("");

  // Temp fields for adding a single project
  const [newProjName, setNewProjName] = useState("");
  const [newProjUrl, setNewProjUrl] = useState("");
  const [newProjBuilder, setNewProjBuilder] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");

  // New Event form fields
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCoverImage, setNewCoverImage] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const fetchEvents = async () => {
    try {
      const snap = await getDocs(collection(db, "events"));
      const list: FirestoreEvent[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as FirestoreEvent);
      });
      setEvents(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch events from Firestore.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // When an event is picked to edit its recap
  const handleSelectEvent = (ev: FirestoreEvent) => {
    setEditingEvent(ev);
    setRecapDesc(ev.description || "");
    setRecapVideo(ev.recapVideoUrl || "");
    setRecapImages(ev.images || []);
    setRecapProjects(ev.projects || []);
    setError("");
    setSuccess("");
    // Scroll smoothly to recap editor
    setTimeout(() => {
      document.getElementById("recap-editor")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Add Image to list
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgUrl.trim()) return;
    setRecapImages([
      ...recapImages,
      {
        url: newImgUrl.trim(),
        alt: newImgAlt.trim() || editingEvent?.title || "Event photo",
        caption: newImgCaption.trim() || undefined,
      },
    ]);
    setNewImgUrl("");
    setNewImgAlt("");
    setNewImgCaption("");
  };

  const handleRemoveImage = (index: number) => {
    setRecapImages(recapImages.filter((_, idx) => idx !== index));
  };

  // Add Project to list
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjUrl.trim()) return;
    setRecapProjects([
      ...recapProjects,
      {
        name: newProjName.trim(),
        url: newProjUrl.trim(),
        builder: newProjBuilder.trim() || undefined,
        description: newProjDesc.trim() || undefined,
      },
    ]);
    setNewProjName("");
    setNewProjUrl("");
    setNewProjBuilder("");
    setNewProjDesc("");
  };

  const handleRemoveProject = (index: number) => {
    setRecapProjects(recapProjects.filter((_, idx) => idx !== index));
  };

  // Save updated recap back to Firestore
  const handleSaveRecap = async () => {
    if (!editingEvent) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateDoc(doc(db, "events", editingEvent.id), {
        description: recapDesc.trim(),
        recapVideoUrl: recapVideo.trim(),
        images: recapImages,
        projects: recapProjects,
      });

      setSuccess(`Recap saved successfully for "${editingEvent.title}"!`);
      // Update local state
      setEditingEvent({
        ...editingEvent,
        description: recapDesc.trim(),
        recapVideoUrl: recapVideo.trim(),
        images: recapImages,
        projects: recapProjects,
      });
      fetchEvents();
    } catch (err: any) {
      console.error(err);
      setError("Failed to save recap: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  // Create brand new past event / experience
  const handleCreateNewExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: Partial<FirestoreEvent> = {
        title: newTitle.trim(),
        date: newDate.trim(),
        location: newLocation.trim(),
        coverImage: newCoverImage.trim() || undefined,
        status: "DONE",
        startDate: newStartDate.trim() || undefined,
        endDate: newEndDate.trim() || newStartDate.trim() || undefined,
        timezone: "Asia/Kolkata",
        description: recapDesc.trim() || undefined,
        recapVideoUrl: recapVideo.trim() || undefined,
        images: recapImages,
        projects: recapProjects,
        createdAt: serverTimestamp() as any,
      };

      const docRef = await addDoc(collection(db, "events"), payload);
      setSuccess(`Experience created with ID: ${docRef.id}`);
      setIsCreating(false);
      // Reset
      setNewTitle("");
      setNewDate("");
      setNewLocation("");
      setNewCoverImage("");
      setNewStartDate("");
      setNewEndDate("");
      setRecapDesc("");
      setRecapVideo("");
      setRecapImages([]);
      setRecapProjects([]);
      fetchEvents();
    } catch (err: any) {
      console.error(err);
      setError("Failed to create experience: " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  };

  // Filtered list
  const pastEvents = events.filter((e) => isPast(e));
  const displayedEvents = filterMode === "past" ? pastEvents : events;

  return (
    <div className="space-y-12">
      {/* Notifications */}
      {error && (
        <div className="bg-[var(--color-shipit-red)] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          ERROR: {error}
        </div>
      )}
      {success && (
        <div className="bg-[#2DDFFF] border-4 border-black text-black font-bold p-4 text-sm font-poppins shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          {success}
        </div>
      )}

      {/* Top Banner / Explainer */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
        <div className="absolute top-0 right-0 bg-[#F54D28] text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
          Past Editions Manager
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-sora font-black uppercase text-black flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-[#2DDFFF]" />
              Past Editions &amp; Recaps
            </h2>
            <p className="font-poppins text-black/70 text-sm mt-1 max-w-2xl">
              Manage recaps for past events shown on the homepage under{" "}
              <strong>03 // PAST EDITIONS &amp; RECAPS</strong>. Add photo galleries, student project
              showcases, and event recap stories.
            </p>
          </div>
          <button
            onClick={() => {
              setIsCreating(true);
              setEditingEvent(null);
              setRecapDesc("");
              setRecapVideo("");
              setRecapImages([]);
              setRecapProjects([]);
            }}
            className="bg-[#F5F474] text-black font-sora font-black uppercase tracking-wider px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#2DDFFF] transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" /> Add Past Edition
          </button>
        </div>
      </div>

      {/* Create New Experience Modal / Panel */}
      {isCreating && (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative">
          <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
            <h3 className="text-2xl font-sora font-black uppercase">
              Add New Past Event / Experience
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1 border-2 border-black hover:bg-black hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleCreateNewExperience} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-poppins font-bold uppercase mb-1">
                  Title (e.g. BOBA BASH BENGALURU)
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-bold uppercase mb-1">
                  Display Date (e.g. 24TH OCT 2026)
                </label>
                <input
                  type="text"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-bold uppercase mb-1">
                  Location (e.g. INDIRANAGAR, BENGALURU)
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-bold uppercase mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={newCoverImage}
                  onChange={(e) => setNewCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-bold uppercase mb-1">
                  Start Date (ISO: YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  placeholder="2026-10-24"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-poppins font-bold uppercase mb-1">
                  End Date (ISO: YYYY-MM-DD)
                </label>
                <input
                  type="text"
                  placeholder="2026-10-24"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
                />
              </div>
            </div>

            {/* Recap fields section */}
            <div className="border-t-4 border-black pt-6">
              <label className="block text-sm font-poppins font-bold uppercase mb-1">
                Event Story / Description (Markdown supported)
              </label>
              <textarea
                value={recapDesc}
                onChange={(e) => setRecapDesc(e.target.value)}
                rows={4}
                placeholder="What happened at the event? How many teens showed up, and what did they build?"
                className="w-full bg-white border-4 border-black p-3 font-poppins text-black"
              />
            </div>

            <div className="flex justify-end gap-4 border-t-4 border-black pt-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-6 py-3 border-4 border-black font-bold uppercase hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-black text-white font-sora font-black uppercase tracking-wider border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F5F474] hover:text-black transition-all flex items-center gap-2"
              >
                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                Save Experience
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List & Recap Status Overview */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-sora font-black uppercase">
              Events Ready for Recaps
            </h3>
            <p className="text-sm font-poppins text-black/60">
              Select an event below to edit its recap story, photo gallery, or student projects.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex border-4 border-black">
            <button
              onClick={() => setFilterMode("past")}
              className={`px-4 py-2 font-poppins font-bold text-xs uppercase transition-colors ${
                filterMode === "past"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-neutral-100"
              }`}
            >
              Past Events ({pastEvents.length})
            </button>
            <button
              onClick={() => setFilterMode("all")}
              className={`px-4 py-2 font-poppins font-bold text-xs uppercase border-l-2 border-black transition-colors ${
                filterMode === "all"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-neutral-100"
              }`}
            >
              All Events ({events.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-12 text-black/50 font-bold uppercase tracking-widest justify-center">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading events...
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="border-4 border-dashed border-black/20 py-12 text-center font-bold uppercase tracking-widest text-black/40">
            No past events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayedEvents.map((ev) => {
              const hasImgs = (ev.images?.length ?? 0) > 0;
              const hasProjs = (ev.projects?.length ?? 0) > 0;
              const hasDesc = !!ev.description?.trim();
              const isSelected = editingEvent?.id === ev.id;
              const isRecapComplete = hasImgs || hasProjs || hasDesc;

              return (
                <div
                  key={ev.id}
                  className={`border-4 border-black p-6 transition-all ${
                    isSelected
                      ? "bg-[#F5F474]/30 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                      : "bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      {ev.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ev.coverImage}
                          alt={ev.title}
                          className="w-16 h-12 object-cover border-2 border-black hidden sm:block shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-black/10 border-2 border-black hidden sm:flex items-center justify-center font-bold text-xs">
                          {ev.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-[#2DDFFF] border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">
                            {ev.date}
                          </span>
                          {isPast(ev) ? (
                            <span className="bg-black text-white px-2 py-0.5 text-xs font-bold uppercase">
                              Past / In Experiences
                            </span>
                          ) : (
                            <span className="bg-[#FFAA47] border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">
                              Upcoming
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-sora font-black uppercase">
                          {ev.title}
                        </h4>
                        <p className="text-xs font-poppins text-black/60 uppercase">
                          {ev.location}
                        </p>
                      </div>
                    </div>

                    {/* Recap Status Badges */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono">
                        <span
                          className={`px-2 py-1 border-2 border-black flex items-center gap-1 ${
                            hasImgs ? "bg-[#2DDFFF]" : "bg-neutral-100 text-black/40"
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          {ev.images?.length ?? 0} photos
                        </span>
                        <span
                          className={`px-2 py-1 border-2 border-black flex items-center gap-1 ${
                            hasProjs ? "bg-[#F5F474]" : "bg-neutral-100 text-black/40"
                          }`}
                        >
                          <FolderGit2 className="w-3.5 h-3.5" />
                          {ev.projects?.length ?? 0} projects
                        </span>
                        <span
                          className={`px-2 py-1 border-2 border-black flex items-center gap-1 ${
                            hasDesc ? "bg-[#FFAA47]" : "bg-neutral-100 text-black/40"
                          }`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {hasDesc ? "Story ✓" : "No story"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleSelectEvent(ev)}
                        className={`px-5 py-2 font-sora font-black uppercase text-xs border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-black text-white hover:bg-neutral-800"
                            : "bg-[#F5F474] text-black hover:bg-[#2DDFFF]"
                        }`}
                      >
                        <Edit3 className="w-4 h-4" />
                        {isSelected ? "Editing Recap..." : "Edit Recap"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DEDICATED RECAP EDITOR SECTION ── */}
      {editingEvent && (
        <div
          id="recap-editor"
          className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 relative space-y-8"
        >
          <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
            Recap Editor
          </div>

          {/* Header */}
          <div className="border-b-4 border-black pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F54D28]">
                Editing Event Recap
              </span>
              <h3 className="text-3xl font-sora font-black uppercase text-black">
                {editingEvent.title}
              </h3>
              <p className="text-xs font-poppins text-black/60 uppercase">
                {editingEvent.date} · {editingEvent.location}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 border-2 border-black font-bold uppercase text-xs hover:bg-neutral-100"
              >
                Close Editor
              </button>
              <button
                type="button"
                onClick={handleSaveRecap}
                disabled={saving}
                className="px-6 py-2 bg-black text-white font-sora font-black uppercase text-xs border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F5F474] hover:text-black transition-all flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save All Changes
              </button>
            </div>
          </div>

          {/* Section 1: Event Story / Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F54D28]" />
              <h4 className="text-lg font-sora font-black uppercase">
                1. Recap Story / Description
              </h4>
              <span className="text-xs text-black/50 font-poppins">
                (Shown when users click "DESCRIPTION" accordion on Experiences card)
              </span>
            </div>
            <textarea
              value={recapDesc}
              onChange={(e) => setRecapDesc(e.target.value)}
              rows={5}
              placeholder="Write the event story, turnout, highlights, speakers, or memorable moments... (Markdown supported)"
              className="w-full bg-white border-4 border-black p-4 font-poppins text-black text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all leading-relaxed"
            />
          </div>

          {/* Section 2: Photo Gallery (Images) */}
          <div className="space-y-4 border-t-4 border-black pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#2DDFFF]" />
                <h4 className="text-lg font-sora font-black uppercase">
                  2. Photo Gallery ({recapImages.length} Photos)
                </h4>
                <span className="text-xs text-black/50 font-poppins">
                  (Shown in the "IMAGES" full-screen modal)
                </span>
              </div>
            </div>

            {/* Current images grid */}
            {recapImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recapImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="border-4 border-black bg-neutral-50 p-3 space-y-2 relative group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 bg-black text-white p-1 hover:bg-[#F54D28] transition-colors border-2 border-black z-10"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-full h-36 border-2 border-black overflow-hidden bg-black/5 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs font-poppins font-bold truncate">
                      Alt: {img.alt}
                    </div>
                    {img.caption && (
                      <div className="text-xs font-poppins text-black/60 truncate">
                        Caption: {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add New Image Form */}
            <form
              onSubmit={handleAddImage}
              className="border-4 border-dashed border-black/40 p-4 bg-neutral-50 space-y-3"
            >
              <span className="text-xs font-bold uppercase tracking-wider block text-black/70">
                + Add Photo to Gallery
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="url"
                  required
                  placeholder="Image URL (https://...)"
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                  className="bg-white border-2 border-black p-2 font-poppins text-xs text-black"
                />
                <input
                  type="text"
                  placeholder="Alt text (e.g. Teens building robots)"
                  value={newImgAlt}
                  onChange={(e) => setNewImgAlt(e.target.value)}
                  className="bg-white border-2 border-black p-2 font-poppins text-xs text-black"
                />
                <input
                  type="text"
                  placeholder="Caption (optional)"
                  value={newImgCaption}
                  onChange={(e) => setNewImgCaption(e.target.value)}
                  className="bg-white border-2 border-black p-2 font-poppins text-xs text-black"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white font-sora font-black uppercase text-xs border-2 border-black hover:bg-[#2DDFFF] hover:text-black transition-colors"
              >
                + Add to Photo Gallery
              </button>
            </form>
          </div>

          {/* Section 3: Student Projects Showcase */}
          <div className="space-y-4 border-t-4 border-black pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-[#F5F474]" />
                <h4 className="text-lg font-sora font-black uppercase">
                  3. Student Projects Showcase ({recapProjects.length} Projects)
                </h4>
                <span className="text-xs text-black/50 font-poppins">
                  (Shown in the "PROJECTS" right drawer)
                </span>
              </div>
            </div>

            {/* Current projects list */}
            {recapProjects.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recapProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="border-4 border-black bg-white p-4 space-y-2 relative group hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    <button
                      onClick={() => handleRemoveProject(idx)}
                      className="absolute top-3 right-3 bg-black text-white p-1 hover:bg-[#F54D28] transition-colors border-2 border-black"
                      title="Remove project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <h5 className="font-sora font-black uppercase text-lg">
                        {proj.name}
                      </h5>
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-[#2DDFFF]"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    {proj.builder && (
                      <p className="text-xs font-bold uppercase tracking-wider text-black/60">
                        Built by {proj.builder}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-xs font-poppins text-black/80">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add New Project Form */}
            <form
              onSubmit={handleAddProject}
              className="border-4 border-dashed border-black/40 p-4 bg-neutral-50 space-y-3"
            >
              <span className="text-xs font-bold uppercase tracking-wider block text-black/70">
                + Add Project to Showcase
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Project Name"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="bg-white border-2 border-black p-2 font-poppins text-xs text-black"
                />
                <input
                  type="url"
                  required
                  placeholder="Project URL (https://github.com/...)"
                  value={newProjUrl}
                  onChange={(e) => setNewProjUrl(e.target.value)}
                  className="bg-white border-2 border-black p-2 font-poppins text-xs text-black"
                />
                <input
                  type="text"
                  placeholder="Builder / Team Name"
                  value={newProjBuilder}
                  onChange={(e) => setNewProjBuilder(e.target.value)}
                  className="bg-white border-2 border-black p-2 font-poppins text-xs text-black"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Short summary of what this project does..."
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                className="w-full bg-white border-2 border-black p-2 font-poppins text-xs text-black"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white font-sora font-black uppercase text-xs border-2 border-black hover:bg-[#F5F474] hover:text-black transition-colors"
              >
                + Add to Projects Showcase
              </button>
            </form>
          </div>

          {/* Section 4: Recap Video Link */}
          <div className="space-y-3 border-t-4 border-black pt-6">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-[#E33CC7]" />
              <h4 className="text-lg font-sora font-black uppercase">
                4. Recap Video URL (Optional)
              </h4>
            </div>
            <input
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              value={recapVideo}
              onChange={(e) => setRecapVideo(e.target.value)}
              className="w-full bg-white border-4 border-black p-3 font-poppins text-sm text-black"
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="border-t-4 border-black pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs font-poppins text-black/60">
              Changes saved here appear immediately in <strong>03 // EXPERIENCES</strong> on the live site.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="px-6 py-3 border-4 border-black font-bold uppercase text-sm hover:bg-neutral-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveRecap}
                disabled={saving}
                className="px-8 py-3 bg-black text-white font-sora font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2DDFFF] hover:text-black transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                Save Recap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
