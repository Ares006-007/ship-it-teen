"use client";

import { useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";
import type { EventProject } from "@/lib/eventTypes";

interface ProjectsDrawerProps {
  projects: EventProject[];
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  eventTitle: string;
}

export function ProjectsDrawer({
  projects,
  open,
  onClose,
  triggerRef,
  eventTitle,
}: ProjectsDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'button, [href], [tabindex]:not([tabindex="-1"])'
          )
        );
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
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Projects from ${eventTitle}`}
        className={`fixed right-0 top-0 h-full z-50 w-full max-w-md bg-white border-l-4 border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black px-6 py-4 bg-black text-white">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-60">
              Projects from
            </div>
            <div className="font-black uppercase tracking-tight text-lg leading-tight">
              {eventTitle}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="bg-white text-black p-2 border-2 border-white hover:bg-[#F5F474] hover:border-[#F5F474] transition-colors"
            aria-label="Close projects drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="border-4 border-black p-4 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-black uppercase tracking-tight text-xl">
                  {project.name}
                </span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 bg-black text-white p-1.5 hover:bg-[#F5F474] hover:text-black transition-colors border-2 border-black"
                  aria-label={`Open ${project.name}`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {project.builder && (
                <div className="text-sm font-bold uppercase tracking-widest text-black/60 mb-2">
                  by {project.builder}
                </div>
              )}
              {project.description && (
                <p className="text-sm font-poppins text-black/80 leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
