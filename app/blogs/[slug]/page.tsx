import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import remarkDirective from "remark-directive";
import { remarkCallout } from "@/lib/markdown/remark-callout";
import { Callout } from "@/components/Callout";
import CodeBlock from "@/components/CodeBlock";
import BlogImage from "@/components/BlogImage";
import { remarkYoutube } from "@/lib/markdown/remark-youtube";
import Youtube from "@/components/Youtube";
import { remarkFaq } from "@/lib/markdown/remark-faq";
import Faq from "@/components/Faq";
import { remarkCodeGroup } from "@/lib/markdown/remark-codeGroup";
import { CodeGroup } from "@/components/CodeGroup";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ArticleContents, ReadingRuler } from "@/components/blog/marginRuler";
import { remarkImage } from "@/lib/markdown/remark-image";


type Props = {
  params: { slug: string };
};

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content?.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function extractHeadings(content: string) {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    headings.push({ id, text, level });
  }

  return headings;
}

function formatDate(date?: string) {
  if (!date) return null;
  return new Date(date)
    .toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase()
    .replace(",", "");
}

const mdxComponents = {
  h1: ({ children }: any) => (
    <h1 className="mb-8 text-4xl font-medium italic leading-tight sm:text-5xl [font-family:var(--font-display)] [color:var(--ink)]">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2
      id={String(children)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")}
      className="mb-6 mt-16 scroll-mt-32 border-t pt-8 text-2xl font-medium italic sm:text-3xl [border-color:var(--paper-line)] [font-family:var(--font-display)] [color:var(--ink)]"
    >
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3
      id={String(children)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")}
      className="mb-5 mt-12 scroll-mt-32 text-xl font-semibold sm:text-2xl [color:var(--ink)]"
    >
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="mb-4 mt-8 text-lg font-semibold [color:var(--ink)]">
      {children}
    </h4>
  ),
  p: ({ children }: any) => (
    <p className="mb-6 text-[16px] leading-[1.75] sm:text-[17px] [color:var(--ink-soft)]">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="mb-7 ml-6 list-disc space-y-3 text-[16px] leading-relaxed [color:var(--ink-soft)]">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="mb-7 ml-6 list-decimal space-y-3 text-[16px] leading-relaxed [color:var(--ink-soft)]">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  code: ({ children, className }: any) => {
    if (!className) {
      return (
        <code className="rounded-[3px] px-1.5 py-0.5 text-[0.85em] [background:var(--paper-dim)] [color:var(--teal-deep)] [font-family:var(--font-mono)]">
          {children}
        </code>
      );
    }
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }: any) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }: any) => (
    <blockquote className="my-8 border-l-2 py-1 pl-6 text-[16px] italic leading-relaxed [border-color:var(--ochre)] [color:var(--ink-soft)]">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: any) => (
    <a
      href={href}
      className="underline decoration-1 underline-offset-2 transition-colors [color:var(--teal)] hover:[color:var(--teal-deep)]"
    >
      {children}
    </a>
  ),
  img: ({ src, alt, title }: any) => (
    <BlogImage src={src} alt={alt} title={title} />
  ),
  table: ({ children }: any) => (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse border [border-color:var(--paper-line)] text-[14px]">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="[background:var(--paper-dim)]">{children}</thead>
  ),
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => (
    <tr className="border-b [border-color:var(--paper-line)]">{children}</tr>
  ),
  th: ({ children }: any) => (
    <th className="border [border-color:var(--paper-line)] px-4 py-3 text-left font-semibold [color:var(--ink)]">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border [border-color:var(--paper-line)] px-4 py-3 [color:var(--ink-soft)]">
      {children}
    </td>
  ),
  hr: () => <hr className="my-12 [border-color:var(--paper-line)]" />,
};

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog: any) => ({
    slug: blog.slug || blog.title.replace(/\s+/g, "-"),
  }));
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] [font-family:var(--font-mono)] [color:var(--ochre)]">
          404
        </p>
        <h1 className="mb-4 text-4xl font-medium italic [font-family:var(--font-display)] [color:var(--ink)]">
          Entry not found
        </h1>
        <p className="mb-8 max-w-md text-[15px] [color:var(--ink-soft)]">
          The entry you're looking for doesn't exist, or has been removed
          from the index.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-[13px] font-medium [font-family:var(--font-mono)] [color:var(--teal)] hover:[color:var(--teal-deep)]"
        >
          <ArrowLeft size={14} />
          Back to index
        </Link>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);
  const headings = extractHeadings(blog.content);

  return (
    <article>

      {/* Sticky sub-header */}
      <header className="sticky top-14 z-30 border-b backdrop-blur [background:color-mix(in_srgb,var(--paper)_85%,transparent)] [border-color:var(--paper-line)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-8">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors [font-family:var(--font-mono)] [color:var(--ink-soft)] hover:[color:var(--teal)]"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Index</span>
          </Link>
          <span className="text-[11px] tracking-wide [font-family:var(--font-mono)] [color:var(--ink-faint)]">
            {readingTime} min read
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8 md:py-20">
        {/* Hero */}
        <div className="mx-auto mb-14 max-w-2xl">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.14em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
            {formatDate(blog.date) && <span>{formatDate(blog.date)}</span>}
            {blog.author && (
              <>
                <span aria-hidden>·</span>
                <span>{blog.author}</span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{readingTime} min read</span>
          </div>
          <h1 className="mb-6 text-4xl font-medium italic leading-[1.08] sm:text-6xl [font-family:var(--font-display)] [color:var(--ink)]">
            {blog.title}
          </h1>
          {blog.excerpt && (
            <p className="text-lg leading-relaxed sm:text-xl [color:var(--ink-soft)]">
              {blog.excerpt}
            </p>
          )}
        </div>

        {/* Content grid */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-[minmax(0,42rem)_16rem] lg:justify-center lg:gap-16">
          <div className="min-w-0">
            <MDXRemote
              source={blog.content}
              components={{ ...mdxComponents, Callout, Youtube, Faq, CodeGroup }}
              options={{
                mdxOptions: {
                  remarkPlugins: [
                    remarkGfm,
                    remarkDirective,
                    remarkCallout,
                    remarkYoutube,
                    remarkFaq,
                    remarkCodeGroup,
                    remarkImage
                  ],
                  rehypePlugins: [rehypeHighlight],
                },
              }}
            />
          </div>

          <ArticleContents headings={headings} />
        </div>
      </div>

      {/* Related entries */}
      {blog.relatedPosts && blog.relatedPosts.length > 0 && (
        <section className="border-t [background:var(--paper-dim)] [border-color:var(--paper-line)]">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8">
            <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.18em] [font-family:var(--font-mono)] [color:var(--ink-faint)]">
              Related entries
            </p>
            <div className="mx-auto max-w-3xl">
              {blog.relatedPosts.map((post: any, i: number) => (
                <Link
                  key={post.slug}
                  href={`/blogs/${post.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr] gap-4 border-b py-6 [border-color:var(--paper-line)] last:border-b-0"
                >
                  <span className="pt-1 text-[13px] tabular-nums [font-family:var(--font-mono)] [color:var(--ink-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-lg font-medium transition-colors sm:text-xl [font-family:var(--font-display)] [color:var(--ink)] group-hover:[color:var(--teal-deep)]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mb-2 line-clamp-2 text-[14px] leading-relaxed [color:var(--ink-soft)]">
                        {post.excerpt}
                      </p>
                    )}
                    {post.date && (
                      <time className="text-[10px] uppercase tracking-wide [font-family:var(--font-mono)] [color:var(--ink-faint)]">
                        {formatDate(post.date)}
                      </time>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <section className="border-t [border-color:var(--paper-line)]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="mb-1 text-[15px] font-medium [color:var(--ink)]">
              More from the journal
            </p>
            <p className="text-[13px] [color:var(--ink-soft)]">
              Every entry, filed in order, is in the index.
            </p>
          </div>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[13px] font-medium [font-family:var(--font-mono)] [color:var(--teal)] hover:[color:var(--teal-deep)]"
          >
            View all entries
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </article>
  );
}