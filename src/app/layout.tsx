import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rahul Kalagadda — AI Engineer | LLM & RAG Systems",
  description:
    "Personal portfolio and engineering case studies of Rahul Kalagadda. AI Engineer specializing in LLM & RAG Systems, deterministic policy engines, and scalable backend infrastructure.",
  keywords: [
    "Rahul Kalagadda",
    "AI Engineer",
    "LLM Systems",
    "RAG Architecture",
    "FastAPI",
    "Next.js",
    "Qdrant",
    "FAISS",
    "Groq",
    "Full-Stack AI Products",
    "Mumbai India AI Engineer",
  ],
  authors: [{ name: "Rahul Kalagadda", url: "https://github.com/Rahulkalagadda" }],
  creator: "Rahul Kalagadda",
  metadataBase: new URL("https://rahulkalagadda.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rahulkalagadda.vercel.app",
    title: "Rahul Kalagadda — AI Engineer | LLM & RAG Systems",
    description:
      "AI Engineer specializing in LLM & RAG Systems, Backend Engineering, and Full-Stack AI Products.",
    siteName: "Rahul Kalagadda Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul Kalagadda — AI Engineer",
    description:
      "AI Engineer specializing in LLM & RAG Systems, Backend Engineering, and Full-Stack AI Products.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-foreground font-sans selection:bg-amber selection:text-background min-h-screen">
        {children}
      </body>
    </html>
  );
}
