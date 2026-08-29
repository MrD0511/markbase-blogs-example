import { getAllBlogs } from "@/lib/blogs";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

function slugify(title: string) {
  return title.replace(/\s+/g, "-");
}

function readingTime(content: string) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogsPage() {
  const raw: any[] = await getAllBlogs();

  const blogs = [...raw]
    .map((b) => ({ ...b, slug: b.slug || slugify(b.title) }))
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const [featured, ...rest] = blogs;

  if (!blogs.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 text-center px-6">
        <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
          Nothing here yet
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          No posts have been published. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
            Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
            Notes, guides, and things we learned along the way.
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="group block mb-16 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300 overflow-hidden"
          >
            <div className="p-8 md:p-12 relative">
              <span className="absolute top-8 right-8 md:top-12 md:right-12 h-2 w-2 rounded-full bg-blue-500 animate-pulse" aria-hidden />
              <div className="flex items-center gap-3 mb-5 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-500">
                <span>Latest</span>
                {formatDate(featured.date) && (
                  <>
                    <span aria-hidden>·</span>
                    <span>{formatDate(featured.date)}</span>
                  </>
                )}
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  {readingTime(featured.content)} min read
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-6 line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
              <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                Read article
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        )}

        {/* Grid of remaining posts */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blogs/${blog.slug}`}
                className="group relative flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-300"
              >
                <span className="absolute left-0 top-6 bottom-6 w-[2px] bg-gray-200 dark:bg-gray-800 group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors duration-300 rounded-full" aria-hidden />
                <div className="pl-4">
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-500">
                    {formatDate(blog.date) && <span>{formatDate(blog.date)}</span>}
                    {formatDate(blog.date) && <span aria-hidden>·</span>}
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
                      {readingTime(blog.content)} min
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
                      {blog.excerpt}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Read more
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}