import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Microblog Generator | Create Impactful Contents with AI",
  description: "Transform your ideas into engaging microblogs with AI. Generate optimized social media content with different tones of voice and trend-based insigts.",
  keywords: [
    "microblogging",
    "AI content generation",
    "social media",
    "content creation",
    "smart microblog",
    "AI writing assistant",
    "content optimization",
    "engaging content",
    "social media strategy",
  ],
  authors: [{ name: "Glaucia Lemos", url: "https://www.youtube.com/@GlauciaLemos" }],
  openGraph: {
    title: "Smart Microblog Generator",
    description: "Transform your ideas into engaging microblogs with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

