import { getAllBlogs, getBlogBySlug } from "@/lib/blogs";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import remarkDirective from 'remark-directive'
import { remarkCallout } from '@/lib/markdown/remark-callout'
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
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import BlogMetadata from "@/components/BlogMetadata";

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

const mdxComponents = {
  h1: ({ children }: any) => (
    <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2
      id={String(children)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")}
      className="text-3xl lg:text-4xl font-bold mb-8 mt-16 text-gray-900 dark:text-white scroll-mt-32 border-t border-gray-200 dark:border-gray-800 pt-8"
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
      className="text-2xl lg:text-3xl font-semibold mb-6 mt-12 text-gray-800 dark:text-gray-100 scroll-mt-32"
    >
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="text-xl lg:text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-100">
      {children}
    </h4>
  ),
  p: ({ children }: any) => (
    <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-7 leading-relaxed">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-outside ml-6 mb-8 text-gray-700 dark:text-gray-300 space-y-4 text-base lg:text-lg">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside ml-6 mb-8 text-gray-700 dark:text-gray-300 space-y-4 text-base lg:text-lg">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  code: ({ children, className }: any) => {
    if (!className) {
      return (
        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded font-mono text-sm">
          {children}
        </code>
      );
    }
    return (
      <code className={className}>
        {children}
      </code>
    );
  },
  pre: ({ children }: any) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-4 my-8 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg text-gray-700 dark:text-gray-300 italic text-base lg:text-lg">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: any) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }: any) => <BlogImage src={src} alt={alt} />,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-8">
      <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-gray-50 dark:bg-gray-800">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => (
    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
      {children}
    </tbody>
  ),
  tr: ({ children }: any) => <tr>{children}</tr>,
  th: ({ children }: any) => (
    <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-gray-700 dark:text-gray-300">
      {children}
    </td>
  ),
  hr: () => (
    <hr className="my-12 border-gray-300 dark:border-gray-700" />
  ),
};

export async function generateStaticParams() {
  const blogs = await getAllBlogs();
  return blogs.map((blog: any) => ({
    slug: blog.slug || blog.title.replace(/\s+/g, "-").toLowerCase(),
  }));
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
              404
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Post not found
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            <ArrowLeft size={18} />
            Back to blog
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(blog.content);
  const headings = extractHeadings(blog.content);

  return (
    <>
      <ReadingProgress />

      <article className="min-h-screen bg-white dark:bg-gray-950">
        {/* Enhanced Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back to blog</span>
            </Link>
            <span className="text-xs font-mono text-gray-500 dark:text-gray-600">
              {readingTime} min read
            </span>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          {/* Hero Section */}
          <div className="mb-16 max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              {blog.title}
            </h1>
            {blog.excerpt && (
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Enhanced Metadata */}
          <BlogMetadata
            date={blog.date}
            author={blog.author}
            readingTime={readingTime}
            slug={slug}
            title={blog.title}
          />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote
                  source={blog.content}
                  components={{
                    ...mdxComponents,
                    Callout,
                    Youtube,
                    Faq,
                    CodeGroup,
                  }}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [
                        remarkGfm,
                        remarkDirective,
                        remarkCallout,
                        remarkYoutube,
                        remarkFaq,
                        remarkCodeGroup,
                      ],
                      rehypePlugins: [rehypeHighlight],
                    },
                  }}
                />
              </div>
            </div>

            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              {headings.length > 0 && <TableOfContents headings={headings} />}
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {blog.relatedPosts && blog.relatedPosts.length > 0 && (
          <section className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
                Related articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blog.relatedPosts.map((post: any) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    {post.date && (
                      <time className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer Section */}
        <section className="border-t border-gray-200 dark:border-gray-800 mt-20 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  More articles
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Check out our blog for more insights and tutorials.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                View all posts
                <ArrowLeft size={16} className="rotate-180" />
              </Link>
            </div>
          </div>
        </section>
      </article>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}