"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
} from "lucide-react";

interface ImageCropModalProps {
  imageSrc: string;
  open: boolean;
  onClose: () => void;
  onSave: (croppedDataUrl: string) => void;
  aspectRatio?: number; // default 16 / 9
}

const BG_COLORS = [
  { label: "White", value: "#ffffff" },
  { label: "Off-White", value: "#f5f5f5" },
  { label: "Light Gray", value: "#e5e7eb" },
  { label: "Black", value: "#000000" },
  { label: "Sunny", value: "#F5F474" },
  { label: "Aqua", value: "#2DDFFF" },
];

export function ImageCropModal({
  imageSrc,
  open,
  onClose,
  onSave,
  aspectRatio = 16 / 9,
}: ImageCropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  // Canvas internal dimensions
  const CANVAS_WIDTH = 1280;
  const CANVAS_HEIGHT = Math.round(1280 / aspectRatio); // 720 for 16:9

  // Transform states
  const [fitMode, setFitMode] = useState<"contain" | "cover">("contain");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = useState("#ffffff");

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  // Load image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImageObj(img);
      // Auto-set fit mode: if image aspect ratio is far from 16:9, contain fits best
      const imgAspect = img.width / img.height;
      if (Math.abs(imgAspect - aspectRatio) > 0.3) {
        setFitMode("contain");
      } else {
        setFitMode("cover");
      }
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    img.src = imageSrc;
  }, [imageSrc, aspectRatio]);

  // Compute transform and render canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObj) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const iw = imageObj.width;
    const ih = imageObj.height;

    // Base scale based on fit mode
    let baseScale = 1;
    if (fitMode === "contain") {
      baseScale = Math.min(CANVAS_WIDTH / iw, CANVAS_HEIGHT / ih);
    } else {
      baseScale = Math.max(CANVAS_WIDTH / iw, CANVAS_HEIGHT / ih);
    }

    const currentScale = baseScale * zoom;
    const drawW = iw * currentScale;
    const drawH = ih * currentScale;

    // Center coordinates + pan
    const centerX = (CANVAS_WIDTH - drawW) / 2 + pan.x;
    const centerY = (CANVAS_HEIGHT - drawH) / 2 + pan.y;

    // Smooth image rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imageObj, centerX, centerY, drawW, drawH);
  }, [imageObj, fitMode, zoom, pan, bgColor, CANVAS_WIDTH, CANVAS_HEIGHT]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Mouse & Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = CANVAS_WIDTH / rect.width;

    const dx = (e.clientX - dragStartRef.current.x) * scaleFactor;
    const dy = (e.clientY - dragStartRef.current.y) * scaleFactor;

    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !canvasRef.current || e.touches.length !== 1) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = CANVAS_WIDTH / rect.width;

    const dx = (e.touches[0].clientX - dragStartRef.current.x) * scaleFactor;
    const dy = (e.touches[0].clientY - dragStartRef.current.y) * scaleFactor;

    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setFitMode("contain");
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dataUrl = canvas.toDataURL("image/webp", 0.88);
    if (!dataUrl.startsWith("data:image/webp")) {
      dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    }
    onSave(dataUrl);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-4 border-black px-6 py-4 bg-[#F5F474]">
          <div>
            <h3 className="font-sora font-black uppercase text-lg text-black tracking-tight flex items-center gap-2">
              <Move className="w-5 h-5" />
              Resize &amp; Fit Cover Image
            </h3>
            <p className="text-xs font-poppins text-black/70">
              Drag to reposition or use controls to fit into the 16:9 card box.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Canvas Viewport (16:9 Frame) */}
          <div className="relative border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-neutral-100 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full aspect-video cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: "none" }}
            />
            <div className="absolute bottom-2 right-2 pointer-events-none bg-black/75 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono">
              16:9 Card Preview • Drag to Pan
            </div>
          </div>

          {/* Quick Fit Mode Toggle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setFitMode("contain");
                setPan({ x: 0, y: 0 });
              }}
              className={`p-3 border-2 border-black font-sora font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${
                fitMode === "contain"
                  ? "bg-[#2DDFFF] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "bg-white hover:bg-neutral-100"
              }`}
            >
              <Minimize2 className="w-4 h-4" />
              Fit Whole Logo (Contain)
            </button>
            <button
              type="button"
              onClick={() => {
                setFitMode("cover");
                setPan({ x: 0, y: 0 });
              }}
              className={`p-3 border-2 border-black font-sora font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${
                fitMode === "cover"
                  ? "bg-[#2DDFFF] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                  : "bg-white hover:bg-neutral-100"
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              Fill Entire Box (Cover)
            </button>
          </div>

          {/* Zoom Slider & Controls */}
          <div className="border-2 border-black p-3 bg-neutral-50 space-y-2">
            <div className="flex justify-between items-center text-xs font-poppins font-bold uppercase">
              <span>Zoom Scale: {Math.round(zoom * 100)}%</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-bold underline hover:text-[#F54D28] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Position
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.2, Number((z - 0.1).toFixed(2))))}
                className="p-1.5 border-2 border-black bg-white hover:bg-neutral-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-black cursor-pointer h-2 bg-neutral-200 border-2 border-black"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
                className="p-1.5 border-2 border-black bg-white hover:bg-neutral-200"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Background Color Picker (Useful when fitting a logo with margins) */}
          <div className="flex items-center justify-between text-xs font-poppins font-bold uppercase pt-1">
            <span className="text-black/70">Frame Background:</span>
            <div className="flex items-center gap-2">
              {BG_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setBgColor(c.value)}
                  className={`w-6 h-6 rounded-full border-2 border-black transition-transform ${
                    bgColor === c.value ? "scale-125 ring-2 ring-black" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t-4 border-black px-6 py-4 bg-white flex justify-between items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border-2 border-black font-sora font-black uppercase text-xs hover:bg-neutral-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 bg-[#F5F474] text-black font-sora font-black uppercase text-xs border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#2DDFFF] hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply &amp; Fit Image
          </button>
        </div>
      </div>
    </div>
  );
}
