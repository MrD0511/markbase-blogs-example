'use client';

import { Calendar, Check, Clock, Share2 } from "lucide-react";
import { useState } from "react";

// Enhanced Metadata with Share Button
export default function BlogMetadata({
  date,
  author,
  readingTime,
  slug,
  title,
}: {
  date?: string;
  author?: string;
  readingTime: number;
  slug: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/blog/${slug}`;
    const text = `${title} - by ${author || "our blog"}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-8 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {date && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="text-gray-400 dark:text-gray-500" />
            <time dateTime={date} className="font-medium">
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        )}
        {readingTime && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock size={16} className="text-gray-400 dark:text-gray-500" />
            <span className="font-medium">{readingTime} min read</span>
          </div>
        )}
        {author && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>By</span>
            <span className="font-semibold text-gray-900 dark:text-white">{author}</span>
          </div>
        )}
      </div>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Share this post"
      >
        {copied ? (
          <>
            <Check size={16} className="text-green-600" />
            <span className="text-sm font-medium">Copied!</span>
          </>
        ) : (
          <>
            <Share2 size={16} />
            <span className="text-sm font-medium">Share</span>
          </>
        )}
      </button>
    </div>
  );
}
