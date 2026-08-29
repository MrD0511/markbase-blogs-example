'use client';

import { useEffect, useState } from "react";

// Improved Table of Contents with scroll tracking
export default function TableOfContents({ headings }: { headings: any[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let currentId = "";
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top < 100) {
          currentId = heading.id;
        }
      }
      setActiveId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="relative">
      <div className="sticky top-24 space-y-1">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white mb-6 px-4">
          On this page
        </h3>
        <nav className="space-y-0.5 text-sm">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`
                block px-4 py-2 rounded-md transition-all duration-200
                ${
                  activeId === heading.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold border-l-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-l-2 border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }
                ${heading.level === 3 ? "ml-4" : ""}
              `}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}