import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Mastery Academy — Understand AI. Master LLMs. Build Intelligent Agents.",
  description:
    "A complete, modern educational platform covering AI, Machine Learning, Deep Learning, Generative AI, LLMs, Transformers, RAG, AI Agents, Multi-Agent Systems, and Production AI Engineering. From beginner to advanced.",
  keywords: [
    "AI", "Artificial Intelligence", "Machine Learning", "Deep Learning",
    "Generative AI", "LLM", "Large Language Models", "Transformer",
    "RAG", "Retrieval-Augmented Generation", "AI Agents", "Agentic AI",
    "Multi-Agent Systems", "AI Engineering", "Learn AI",
  ],
  authors: [{ name: "AI Mastery Academy" }],
  openGraph: {
    title: "AI Mastery Academy",
    description:
      "Understand AI. Master LLMs. Build Intelligent Agents. From beginner to advanced professional.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="ai-mastery-theme"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
