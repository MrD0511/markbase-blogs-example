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
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase()
    .replace(",", "");
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] [font-family:var(--font-mono)] [color:var(--ochre)]">
          Empty index
        </p>
        <h1 className="mb-3 text-4xl font-medium italic [font-family:var(--font-display)] [color:var(--ink)]">
          Nothing filed yet
        </h1>
        <p className="max-w-md text-[15px] [color:var(--ink-soft)]">
          No entries have been published. Check back once the first one is
          written.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Masthead */}
        <div className="mb-16">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
            {String(blogs.length).padStart(2, "0")} entries on file
          </p>
          <h1 className="mb-5 text-5xl font-medium italic leading-[1.05] sm:text-6xl [font-family:var(--font-display)] [color:var(--ink)]">
            The Journal
          </h1>
          <p className="max-w-lg text-[16px] leading-relaxed [color:var(--ink-soft)]">
            Notes, guides, and things we learned along the way — filed in the
            order we wrote them.
          </p>
        </div>

        {/* Featured entry */}
        {featured && (
          <Link
            href={`/blogs/${featured.slug}`}
            className="group mb-16 block border-t border-b py-10 [border-color:var(--paper-line)]"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.14em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
              <span
                className="inline-flex items-center gap-1.5"
                style={{ color: "var(--ochre)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full [background:var(--ochre)]" />
                Latest entry
              </span>
              {formatDate(featured.date) && <span>{formatDate(featured.date)}</span>}
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                {readingTime(featured.content)} min
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-medium italic leading-tight transition-colors sm:text-4xl [font-family:var(--font-display)] [color:var(--ink)] group-hover:[color:var(--teal-deep)]">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mb-6 max-w-xl text-[15px] leading-relaxed [color:var(--ink-soft)]">
                {featured.excerpt}
              </p>
            )}
            <span
              className="inline-flex items-center gap-2 text-[13px] font-medium [font-family:var(--font-mono)]"
              style={{ color: "var(--teal)" }}
            >
              Read entry
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </span>
          </Link>
        )}

        {/* Ledger of remaining entries */}
        {rest.length > 0 && (
          <ol>
            {rest.map((blog, i) => (
              <li
                key={blog.slug}
                className="border-b [border-color:var(--paper-line)]"
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr] gap-4 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                >
                  <span className="pt-1 text-[13px] tabular-nums [font-family:var(--font-mono)] [color:var(--ink-faint)]">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.1em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
                      {formatDate(blog.date) && <span>{formatDate(blog.date)}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {readingTime(blog.content)} min
                      </span>
                    </div>
                    <h3 className="mb-1.5 text-xl font-medium transition-colors sm:text-2xl [font-family:var(--font-display)] [color:var(--ink)] group-hover:[color:var(--teal-deep)]">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="line-clamp-2 max-w-xl text-[14px] leading-relaxed [color:var(--ink-soft)]">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}