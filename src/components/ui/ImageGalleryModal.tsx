"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { EventImage } from "@/lib/eventTypes";

interface ImageGalleryModalProps {
  images: EventImage[];
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function ImageGalleryModal({
  images,
  open,
  onClose,
  triggerRef,
}: ImageGalleryModalProps) {
  const [current, setCurrent] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );

  // Reset to first image whenever modal opens
  useEffect(() => {
    if (open) {
      setCurrent(0);
      // Focus the close button after paint
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      // Return focus to the trigger button
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  // Keyboard navigation + focus trap
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      // Basic focus trap: keep Tab inside the dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.getAttribute("aria-hidden"));
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, prev, next, onClose]);

  // Swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  if (!open) return null;

  const img = images[current];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-3xl w-full mx-4 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-black text-white p-2 border-2 border-black hover:bg-[#F5F474] hover:text-black transition-colors"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Counter */}
        <div className="absolute top-3 left-3 z-10 bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-widest">
          {current + 1} / {images.length}
        </div>

        {/* Image */}
        <div className="relative w-full aspect-video bg-black/5 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={current}
            src={img.url}
            alt={img.alt}
            loading="lazy"
            className="max-w-full max-h-full object-contain"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        {/* Caption */}
        {img.caption && (
          <div className="border-t-4 border-black px-6 py-3 text-sm font-bold uppercase tracking-widest text-black/70">
            {img.caption}
          </div>
        )}

        {/* Navigation */}
        {images.length > 1 && (
          <div className="flex border-t-4 border-black">
            <button
              onClick={prev}
              className="flex-1 py-3 font-black uppercase tracking-widest text-sm border-r-2 border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" /> PREV
            </button>
            <button
              onClick={next}
              className="flex-1 py-3 font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
              aria-label="Next image"
            >
              NEXT <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
