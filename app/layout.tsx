import type { Metadata } from "next";
import { Newsreader } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from "@/components/common/themeProvider";

export const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'], // Optional: Include if you plan to use italics
  variable: '--font-newsreader', // Defines a CSS variable for Tailwind integration
});

export const metadata: Metadata = {
  title: "Blogs Example - Markbase",
  description: "A markdown native CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" suppressHydrationWarning>
      <body className={`${newsreader.variable} min-h-full flex flex-col `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
