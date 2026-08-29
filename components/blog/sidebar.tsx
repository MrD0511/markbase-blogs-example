import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

function slugify(title: string) {
  return title.replace(/\s+/g, "-").toLowerCase();
}

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function BlogSidebar({ blogs }: { blogs: any[] }) {
  const tags = Array.from(
    new Set(blogs.flatMap((b) => b.tags || b.categories || []))
  ).slice(0, 12);

  const recent = blogs.slice(0, 6);

  return (
    <Sidebar collapsible="icon" className="border-r dark:border-gray-800">
      <SidebarHeader>
        <Link href="/blogs" className="flex items-center gap-2 px-2 py-1.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden />
          <span className="font-semibold text-gray-900 dark:text-white group-data-[collapsible=icon]:hidden">
            Journal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono uppercase tracking-wider text-[11px]">
            Browse
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="All posts">
                  <Link href="/blogs">All posts</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {tags.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="font-mono uppercase tracking-wider text-[11px]">
              Topics
            </SidebarGroupLabel>
            <SidebarGroupContent className="group-data-[collapsible=icon]:hidden">
              <div className="flex flex-wrap gap-2 px-2">
                {tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer font-normal hover:bg-blue-100 dark:hover:bg-blue-900/40"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="font-mono uppercase tracking-wider text-[11px]">
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent className="group-data-[collapsible=icon]:hidden">
            <div className="flex flex-col gap-4 px-2">
              {recent.map((post) => {
                const slug = post.slug || slugify(post.title);
                return (
                  <Link key={slug} href={`/blogs/${slug}`} className="group block">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    {formatDate(post.date) && (
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-mono text-gray-500 dark:text-gray-500">
                        <Clock size={11} />
                        {formatDate(post.date)}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}