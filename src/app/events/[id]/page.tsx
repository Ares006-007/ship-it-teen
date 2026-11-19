"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Footer } from "@/components/Footer";
import { ImageGalleryModal } from "@/components/ui/ImageGalleryModal";
import type { FirestoreEvent, EventImage } from "@/lib/eventTypes";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  MapPin,
  ExternalLink,
  Video,
  ImageIcon,
  FolderGit2,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const youtuMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (youtuMatch) return `https://www.youtube.com/embed/${youtuMatch[1]}`;

    const ytMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
    if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

    if (url.includes("youtube.com/embed/")) return url;

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return url;
  } catch {
    return null;
  }
}

function getInitials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<FirestoreEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Gallery modal state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<EventImage[]>([]);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        const docRef = doc(db, "events", eventId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<FirestoreEvent, "id">;
          setEvent({ id: docSnap.id, ...data });
          if (data.images && data.images.length > 0) {
            setGalleryImages(data.images);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch event detail:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const embedUrl = event?.recapVideoUrl ? getEmbedUrl(event.recapVideoUrl) : null;

  if (loading) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-white flex flex-col justify-between">
        <div className="max-w-5xl mx-auto px-6 w-full flex flex-col items-center justify-center py-24">
          <div className="flex items-center gap-3 font-sora font-black uppercase text-xl text-black">
            <Loader2 className="w-8 h-8 animate-spin text-[#F54D28]" />
            Loading Event Recap...
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen pt-32 pb-24 bg-white flex flex-col justify-between">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="border-4 border-black p-12 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <span className="text-4xl font-black uppercase text-[#F54D28] tracking-widest block">
              404 // EVENT NOT FOUND
            </span>
            <p className="font-poppins text-black/70">
              The event or recap you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/#experiences"
              className="inline-block px-8 py-4 bg-[#F5F474] font-black uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#2DDFFF] transition-all"
            >
              ← Back to Past Editions
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const hasPhotos = (event.images?.length ?? 0) > 0;
  const hasProjects = (event.projects?.length ?? 0) > 0;
  const hasDescription = !!event.description?.trim();

  return (
    <main className="min-h-screen pt-28 pb-24 bg-white">
      {/* Top Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-4 pb-8">
        <Link
          href="/#experiences"
          className="inline-flex items-center gap-2 font-poppins font-bold uppercase text-xs tracking-widest text-black/60 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Past Editions &amp; Recaps
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Event Header Banner */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#2DDFFF] text-black px-4 py-1.5 font-bold uppercase text-xs border-b-4 border-l-4 border-black">
            Event Recap
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div className="space-y-4 max-w-3xl">
              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#F54D28] text-white px-3 py-1 border-2 border-black font-black uppercase text-sm tracking-wider">
                  {event.date}
                </span>
                <span className="bg-[#F5F474] text-black px-3 py-1 border-2 border-black font-bold uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location}
                </span>
                {event.status && (
                  <span className="bg-black text-white px-3 py-1 border-2 border-black font-bold uppercase text-xs tracking-wider">
                    {event.status}
                  </span>
                )}
              </div>

              {/* Event Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-sora font-black uppercase tracking-tight text-black leading-none">
                {event.title}
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 shrink-0">
              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-black text-white font-sora font-black uppercase tracking-wider text-xs border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F5F474] hover:text-black transition-all flex items-center gap-2"
                >
                  Original Event Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {hasPhotos && (
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="px-6 py-3.5 bg-[#2DDFFF] text-black font-sora font-black uppercase tracking-wider text-xs border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:bg-[#F5F474] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4" />
                  View Photos ({event.images?.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hero Cover Image (if present) */}
        {event.coverImage && (
          <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-black/5 max-h-[480px]">
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.coverImage}
                alt={event.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover max-h-[480px]"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-black/10 font-sora font-black text-4xl uppercase tracking-widest text-black/50">
                {getInitials(event.title)}
              </div>
            )}
          </div>
        )}

        {/* ── RECAP VIDEO SECTION (if present) ── */}
        {embedUrl && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-3">
              <Video className="w-6 h-6 text-[#F54D28]" />
              <h2 className="text-2xl font-sora font-black uppercase tracking-tight">
                Event Recap Video
              </h2>
            </div>

            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden aspect-video bg-black">
              <iframe
                src={embedUrl}
                title={`${event.title} Recap Video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              />
            </div>
          </section>
        )}

        {/* ── EVENT STORY & DESCRIPTION SECTION ── */}
        {hasDescription && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-3">
              <FileText className="w-6 h-6 text-[#2DDFFF]" />
              <h2 className="text-2xl font-sora font-black uppercase tracking-tight">
                The Story &amp; Recap
              </h2>
            </div>

            <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
              <div className="prose prose-lg max-w-none font-poppins text-black/90 leading-relaxed whitespace-pre-wrap text-base md:text-lg">
                {event.description}
              </div>
            </div>
          </section>
        )}

        {/* ── PHOTO GALLERY SECTION (if present) ── */}
        {hasPhotos && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b-4 border-black pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-[#F5F474]" />
                <h2 className="text-2xl font-sora font-black uppercase tracking-tight">
                  Photo Gallery ({event.images?.length})
                </h2>
              </div>
              <button
                onClick={() => setGalleryOpen(true)}
                className="text-xs font-bold uppercase tracking-wider underline hover:text-[#2DDFFF]"
              >
                Open Fullscreen
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {event.images?.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setGalleryOpen(true)}
                  className="border-4 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all"
                >
                  <div className="w-full aspect-video overflow-hidden bg-black/5 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.alt || `Photo ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {img.caption && (
                    <div className="p-3 border-t-2 border-black bg-white text-xs font-poppins font-bold text-black/80">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── STUDENT PROJECTS SHOWCASE SECTION (if present) ── */}
        {hasProjects && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b-4 border-black pb-3">
              <FolderGit2 className="w-6 h-6 text-[#E33CC7]" />
              <h2 className="text-2xl font-sora font-black uppercase tracking-tight">
                Projects Shipped by Builders ({event.projects?.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {event.projects?.map((proj, idx) => (
                <div
                  key={idx}
                  className="border-4 border-black bg-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-2xl font-sora font-black uppercase tracking-tight group-hover:text-[#2DDFFF] transition-colors">
                        {proj.name}
                      </h3>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 border-2 border-black bg-[#F5F474] text-black hover:bg-black hover:text-white transition-colors shrink-0"
                          title="Open Project / Repo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {proj.builder && (
                      <div className="text-xs font-poppins font-bold uppercase tracking-widest text-[#F54D28]">
                        Built by {proj.builder}
                      </div>
                    )}

                    {proj.description && (
                      <p className="text-sm font-poppins text-black/80 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {proj.url && (
                    <div className="pt-4 mt-4 border-t-2 border-black/10">
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 hover:underline"
                      >
                        Visit Project Repo / Demo →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Back Button */}
        <div className="pt-8 border-t-4 border-black flex justify-between items-center">
          <Link
            href="/#experiences"
            className="px-8 py-4 bg-white text-black font-sora font-black uppercase tracking-widest text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#F5F474] transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Past Editions
          </Link>

          <Link
            href="/#calendar"
            className="px-8 py-4 bg-black text-white font-sora font-black uppercase tracking-widest text-sm border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#2DDFFF] hover:text-black transition-all inline-flex items-center gap-2"
          >
            Explore Upcoming Events →
          </Link>
        </div>
      </div>

      {/* Fullscreen Image Gallery Modal */}
      {hasPhotos && (
        <ImageGalleryModal
          images={galleryImages}
          open={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          triggerRef={{ current: null }}
        />
      )}

      {/* Footer */}
      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
