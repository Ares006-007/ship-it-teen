"use client";

import { useState, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon, Check } from "lucide-react";

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
  storageFolder = "covers",
  hint,
}: ImageUploadFieldProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WEBP, etc.).");
      return;
    }

    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be under 10MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");

    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const storageRef = ref(storage, `${storageFolder}/${Date.now()}_${sanitizedName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Storage upload error:", error);
          setUploadError("Upload failed: " + (error.message || "Storage error. Check Firebase Storage rules."));
          setUploading(false);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          onChange(downloadUrl);
          setUploading(false);
          setUploadProgress(100);
        }
      );
    } catch (err: any) {
      console.error(err);
      setUploadError("Failed to start upload: " + (err.message || "Unknown error"));
      setUploading(false);
    }
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

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-[var(--color-shipit-red)] border-2 border-black text-black font-bold p-2 text-xs font-poppins">
          {uploadError}
        </div>
      )}

      {/* Main Area */}
      {mode === "upload" ? (
        <div className="space-y-3">
          {/* File Picker Zone */}
          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-4 border-dashed border-black p-4 text-center cursor-pointer transition-all ${
              uploading
                ? "bg-neutral-100 opacity-80 cursor-wait"
                : "bg-white hover:bg-[#F5F474]/20 hover:border-black"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-black" />
                <span className="font-sora font-black uppercase text-xs">
                  Uploading to Firebase Storage ({uploadProgress}%)...
                </span>
                <div className="w-48 h-2 bg-neutral-200 border-2 border-black overflow-hidden">
                  <div
                    className="h-full bg-[#2DDFFF] transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 space-y-1">
                <Upload className="w-6 h-6 text-black" />
                <span className="font-sora font-black uppercase text-xs">
                  Click or Drop Image File Here
                </span>
                <span className="font-poppins text-xs text-black/50">
                  PNG, JPG, WEBP, GIF up to 10MB
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* URL Input Mode */
        <div>
          <input
            type="url"
            placeholder="https://images.unsplash.com/photo-..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white border-4 border-black py-3 px-4 text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-1 focus:translate-x-1 transition-all font-poppins text-sm"
          />
        </div>
      )}

      {/* Live Preview Card (if value exists) */}
      {value && (
        <div className="flex items-center gap-3 border-2 border-black p-2 bg-neutral-50 relative group">
          <div className="w-16 h-12 border-2 border-black overflow-hidden bg-neutral-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs font-bold uppercase text-[var(--color-shipit-green)]">
              <Check className="w-3.5 h-3.5" />
              Image Selected
            </div>
            <p className="text-xs text-black/60 truncate font-mono">{value}</p>
          </div>
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
      )}
    </div>
  );
}
