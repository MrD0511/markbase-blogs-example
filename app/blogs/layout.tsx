import { getAllBlogs } from "@/lib/blogs";
import { BlogSidebar } from "@/components/blog/sidebar";
import { BlogNavbar } from "@/components/blog/navbar";

export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const blogs = await getAllBlogs();

  return (
    <div className="journal min-h-screen [background:var(--paper)] [color:var(--ink)] [font-family:var(--font-body)]">
      <BlogNavbar blogs={blogs} />

      <div className="mx-auto flex">
        <div className="hidden shrink-0 lg:block">
          <BlogSidebar blogs={blogs} />
        </div>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}