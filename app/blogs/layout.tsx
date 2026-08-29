import { getAllBlogs } from "@/lib/blogs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BlogSidebar } from "@/components/blog/sidebar";
import { BlogNavbar } from "@/components/blog/navbar";

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogs = await getAllBlogs();

  return (
    <SidebarProvider>
      <BlogSidebar blogs={blogs} />
      <SidebarInset className="bg-white dark:bg-gray-950">
        <BlogNavbar blogs={blogs} />
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}