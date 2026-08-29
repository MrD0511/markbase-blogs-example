"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../common/modeToggle";
import { BlogSidebar } from "@/components/blog/sidebar";

export function BlogNavbar({ blogs }: { blogs: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-14 border-b backdrop-blur [background:color-mix(in_srgb,var(--paper)_85%,transparent)] [border-color:var(--paper-line)]">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-4 sm:px-8">
        <Link href="/blogs" className="flex items-center gap-1.5">
          <span className="text-[14px] font-semibold uppercase tracking-[0.14em] [font-family:var(--font-mono)] [color:var(--ink)]">
            Journal
          </span>
          <span className="text-base leading-none" style={{ color: "var(--ochre)" }}>
            ·
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="hidden px-3 py-2 text-[13px] tracking-wide transition-colors sm:inline-block [font-family:var(--font-mono)] [color:var(--ink-soft)] hover:[color:var(--teal)]"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="hidden px-3 py-2 text-[13px] tracking-wide transition-colors sm:inline-block [font-family:var(--font-mono)] [color:var(--ink-soft)] hover:[color:var(--teal)]"
          >
            Index
          </Link>

          <ModeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-sm transition-colors hover:[background:var(--paper-dim)] lg:hidden"
            >
              <Menu className="h-4 w-4" style={{ color: "var(--ink)" }} />
            </SheetTrigger>
            <SheetContent
              side="left"
              className="journal w-80 border-0 p-0 [background:var(--paper)]"
            >
              <BlogSidebar blogs={blogs} mobile />
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}