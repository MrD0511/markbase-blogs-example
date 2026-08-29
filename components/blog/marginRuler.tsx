"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

/**
 * Thin ruler-style reading progress bar, sticky under the article's sub-header.
 * Ticks at 0/25/50/75/100 echo the numbered entries elsewhere on the site.
 */
export function ReadingRuler() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight =
        (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const pct =
        scrollHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
          : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const ticks = [0, 25, 50, 75, 100];

  return (
    <div
      className="sticky top-14 z-30 hidden h-6 w-full border-b sm:block [background:var(--paper)] [border-color:var(--paper-line)]"
      aria-hidden
    >
      <div className="relative mx-auto h-full max-w-[1400px] px-4 sm:px-8">
        <div className="absolute inset-x-4 top-1/2 h-[2px] -translate-y-1/2 rounded-full [background:var(--paper-line)] sm:inset-x-8" />
        <div
          className="absolute left-4 top-1/2 h-[2px] -translate-y-1/2 rounded-full transition-[width] duration-150 ease-out [background:var(--teal)] sm:left-8"
          style={{ width: `calc(${progress}% - ${progress > 0 ? "0px" : "0px"})`, maxWidth: "calc(100% - 2rem)" }}
        />
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute top-0 h-full w-px [background:var(--paper-line)]"
            style={{ left: `calc(1rem + ${t}% * (100% - 2rem) / 100%)` }}
          >
            <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] tabular-nums [font-family:var(--font-mono)] [color:var(--ink-faint)]">
              {t}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Numbered table of contents. Numbering is justified here: headings are a
 * real, navigable sequence, not decoration.
 */
export function ArticleContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <nav className="sticky top-24 hidden lg:block" aria-label="Table of contents">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
        Contents
      </p>
      <ol className="space-y-1 border-l [border-color:var(--paper-line)]">
        {headings.map((h, i) => {
          const active = h.id === activeId;
          return (
            <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 0.75}rem` }}>
              <a
                href={`#${h.id}`}
                className="group -ml-px flex items-baseline gap-2 border-l py-1 pl-3 text-[13px] leading-snug transition-colors"
                style={{
                  borderColor: active ? "var(--teal)" : "transparent",
                }}
              >
                <span
                  className="shrink-0 text-[10px] tabular-nums [font-family:var(--font-mono)]"
                  style={{ color: active ? "var(--teal)" : "var(--ink-faint)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="line-clamp-2"
                  style={{ color: active ? "var(--ink)" : "var(--ink-soft)" }}
                >
                  {h.text}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}