"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../common/modeToggle";
import { BlogSidebar } from "@/components/blog/sidebar";

export function BlogNavbar({ blogs }: { blogs: any[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/blogs"
          className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white"
        >
          <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden />
          Journal
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="hidden sm:inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/blogs"
            className="hidden sm:inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2 transition-colors"
          >
            Blog
          </Link>
          <ModeToggle />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger >
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 dark:bg-gray-950">
              <div className="mt-8">
                <BlogSidebar blogs={blogs} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}