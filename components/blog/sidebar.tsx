import Link from "next/link";

function slugify(title: string) {
  return title.replace(/\s+/g, "-");
}

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase()
    .replace(",", "");
}

export function BlogSidebar({
  blogs,
  mobile = false,
}: {
  blogs: any[];
  mobile?: boolean;
}) {
  const tags = Array.from(
    new Set(blogs.flatMap((b) => b.tags || b.categories || []))
  ).slice(0, 10);

  const recent = blogs.slice(0, 6);

  return (
    <aside
      className={`journal flex flex-col gap-10 border-r px-6 py-8 text-sm [border-color:var(--paper-line)] ${
        mobile
          ? "w-full border-0 pt-16"
          : "sticky top-14 h-[calc(100vh-3.5rem)] w-64 overflow-y-auto"
      }`}
    >
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
          Browse
        </p>
        <Link
          href="/blogs"
          className="text-[14px] font-medium transition-colors [color:var(--ink)] hover:[color:var(--teal)]"
        >
          All entries
        </Link>
      </div>

      {tags.length > 0 && (
        <div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
            Topics
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="cursor-default text-[13px] transition-colors [font-family:var(--font-mono)] [color:var(--ink-soft)] hover:[color:var(--ochre)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
          Recent
        </p>
        <ol className="flex flex-col gap-4 border-l [border-color:var(--paper-line)]">
          {recent.map((post, i) => {
            const slug = post.slug || slugify(post.title);
            return (
              <li key={slug} className="pl-4">
                <Link href={`/blogs/${slug}`} className="group block">
                  <span className="mb-1 flex items-baseline gap-2">
                    <span className="text-[10px] tabular-nums [font-family:var(--font-mono)] [color:var(--ink-faint)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {formatDate(post.date) && (
                      <span className="text-[10px] tracking-wide [font-family:var(--font-mono)] [color:var(--ink-faint)]">
                        {formatDate(post.date)}
                      </span>
                    )}
                  </span>
                  <p className="text-[13px] font-medium leading-snug transition-colors [color:var(--ink-soft)] group-hover:[color:var(--teal)]">
                    {post.title}
                  </p>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}