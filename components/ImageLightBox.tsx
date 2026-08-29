'use client'

import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch pinch-zoom support
  const [touchDistance, setTouchDistance] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          e.preventDefault();
          handleZoomIn();
          break;
        case "-":
        case "_":
          e.preventDefault();
          handleZoomOut();
          break;
        case "r":
        case "R":
          e.preventDefault();
          handleReset();
          break;
        case "ArrowUp":
          e.preventDefault();
          setOffset(prev => ({ ...prev, y: prev.y - 20 }));
          break;
        case "ArrowDown":
          e.preventDefault();
          setOffset(prev => ({ ...prev, y: prev.y + 20 }));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setOffset(prev => ({ ...prev, x: prev.x - 20 }));
          break;
        case "ArrowRight":
          e.preventDefault();
          setOffset(prev => ({ ...prev, x: prev.x + 20 }));
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Touch pinch-zoom handling
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      setTouchDistance(Math.sqrt(dx * dx + dy * dy));
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const delta = (newDistance - touchDistance) * 0.01;
      setZoom(prev => Math.max(1, Math.min(3, prev + delta)));
      setTouchDistance(newDistance);
    }
  };

  const handleTouchEnd = () => {
    setTouchDistance(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = alt || "image.png";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors z-10"
        title="Close (ESC)"
        aria-label="Close image viewer"
      >
        <X size={24} />
      </button>

      {/* Control toolbar */}
      <div className="absolute top-4 left-4 flex gap-2 flex-wrap md:flex-nowrap">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Zoom out (-)"
          disabled={zoom <= 1}
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>

        <div className="px-4 py-2.5 bg-white/10 rounded-lg text-white text-sm font-medium min-w-16 text-center">
          {Math.round(zoom * 100)}%
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Zoom in (+)"
          disabled={zoom >= 3}
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          className="px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
          title="Reset zoom (R)"
          aria-label="Reset zoom"
        >
          Reset
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="p-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          title="Download image"
          aria-label="Download image"
        >
          <Download size={20} />
        </button>
      </div>

      {/* Image container */}
      <div
        className={`overflow-auto max-h-[90vh] max-w-[90vw] ${
          isDragging ? "cursor-grabbing" : zoom > 1 ? "cursor-grab" : "cursor-default"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
          className="select-none"
          draggable={false}
        />
      </div>

      {/* Keyboard hints */}
      <div className="absolute bottom-4 left-4 right-4 text-white/60 text-xs md:text-sm space-y-1 max-w-2xl">
        <p>
          <span className="hidden md:inline">⌨️ Keyboard: </span>
          <span className="inline md:hidden">📱 Pinch to zoom • </span>
          <span className="font-mono text-white/70">+/- zoom • arrows pan • R reset • ESC close</span>
        </p>
      </div>

      <style>{`
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}