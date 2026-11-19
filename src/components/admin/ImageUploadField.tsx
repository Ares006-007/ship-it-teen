"use client";

import { useState, useRef } from "react";
import { Upload, Link as LinkIcon, X, Check, Crop, Sliders } from "lucide-react";
import { ImageCropModal } from "@/components/admin/ImageCropModal";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  storageFolder?: string;
  hint?: string;
}

export function ImageUploadField({
  label = "Cover Image",
  value,
  onChange,
  hint,
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Crop / Resize Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, WEBP, etc.).");
      return;
    }

    // Read the chosen image file and open the editor modal immediately
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCropImageSrc(dataUrl);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);

    // Reset file input so user can pick the same file again if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenCropExisting = () => {
    if (!value) return;
    setCropImageSrc(value);
    setCropModalOpen(true);
  };

  const handleSaveCrop = (croppedDataUrl: string) => {
    onChange(croppedDataUrl);
  };

  return (
    <div className="space-y-2">
      {/* Label & Mode Switcher */}
      <div className="flex justify-between items-center">
        <label className="block text-sm font-poppins font-bold uppercase text-black">
          {label}
        </label>
        <div className="flex border-2 border-black text-xs font-poppins font-bold uppercase">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-3 py-1 flex items-center gap-1 transition-colors ${
              mode === "upload" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
            }`}
          >
            <Upload className="w-3 h-3" /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-3 py-1 flex items-center gap-1 border-l-2 border-black transition-colors ${
              mode === "url" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
            }`}
          >
            <LinkIcon className="w-3 h-3" /> Paste URL
          </button>
        </div>
      </div>

      {hint && <p className="text-xs text-black/50 font-poppins">{hint}</p>}

      {/* Main Area */}
      {mode === "upload" ? (
        <div className="space-y-3">
          {/* File Picker Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-4 border-dashed border-black p-4 text-center cursor-pointer transition-all bg-white hover:bg-[#F5F474]/20 hover:border-black"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center py-2 space-y-1">
              <Upload className="w-6 h-6 text-black" />
              <span className="font-sora font-black uppercase text-xs">
                Click or Drop Image File Here to Edit &amp; Resize
              </span>
              <span className="font-poppins text-xs text-black/50">
                You will be able to crop, scale, and fit the image into the 16:9 card box
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins text-sm"
          />
        </div>
      )}

      {/* Live Preview Card with Edit & Resize button */}
      {value && (
        <div className="flex items-center gap-3 border-2 border-black p-2.5 bg-neutral-50 relative group">
          <div className="w-20 h-12 border-2 border-black overflow-hidden bg-neutral-200 shrink-0 relative aspect-video flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs font-bold uppercase text-[var(--color-shipit-green)]">
              <Check className="w-3.5 h-3.5" />
              Image Selected &amp; Ready
            </div>
            <p className="text-xs text-black/60 truncate font-mono">
              {value.startsWith("data:") ? "Custom Fitted 16:9 Image" : value}
            </p>
          </div>

          {/* Action buttons on thumbnail */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenCropExisting}
              className="px-2.5 py-1.5 border-2 border-black bg-[#F5F474] hover:bg-[#2DDFFF] text-black font-sora font-black uppercase text-[11px] flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              title="Resize and adjust fit"
            >
              <Crop className="w-3.5 h-3.5" />
              Resize / Fit
            </button>

            <button
              type="button"
              onClick={() => {
                onChange("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="p-1.5 border-2 border-black bg-white hover:bg-[var(--color-shipit-red)] text-black transition-colors"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Crop & Resize Modal */}
      <ImageCropModal
        imageSrc={cropImageSrc}
        open={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        onSave={handleSaveCrop}
        aspectRatio={16 / 9}
      />
    </div>
  );
}
