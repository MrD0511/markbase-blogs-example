'use client'

import { ZoomIn } from "lucide-react";
import { useState } from "react";
import ImageLightbox from "./ImageLightBox";

export default function BlogImage({ src, alt, title }: any) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <figure
        className="my-8 cursor-pointer group"
        onClick={() => setIsLightboxOpen(true)}
        role="img"
        aria-label={alt}
      >
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
          {/* Skeleton loader */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          )}
          
          <img
            src={src}
            alt={alt}
            title={title}
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            className="w-full max-w-4xl rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
          />
          
          {/* Hover overlay with zoom hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center duration-200">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg">
                <ZoomIn size={18} className="text-white" />
                <span className="text-white text-sm font-medium">Click to zoom</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Improved caption styling */}
        {alt && (
          <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium leading-relaxed">
            {alt}
          </figcaption>
        )}
      </figure>

      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}