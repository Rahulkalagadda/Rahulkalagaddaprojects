import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Shell } from "@/components/portfolio/Shell";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./forest.css";
import "./project-story.css";
import "./forest-music.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
export const metadata: Metadata = {
  title: { default: "Rahul Kalagadda — AI & Software Engineer", template: "%s — Rahul Kalagadda" },
  description: "Wild Systems: Rahul Kalagadda's forest-inspired portfolio. AI engineering, software engineering, and thoughtful web development, with an interactive realistic 3D forest.",
  authors: [{ name: "Rahul Kalagadda", url: "https://github.com/Rahulkalagadda" }],
  creator: "Rahul Kalagadda",
  keywords: ["Rahul Kalagadda", "AI Engineer", "Software Engineer", "Software Developer", "React", "Next.js", "FastAPI", "RAG"],
  openGraph: {
    type: "website", locale: "en_IN", siteName: "Rahul Kalagadda",
    title: "Rahul Kalagadda — AI & Software Engineer",
    description: "Ideas take root. Systems come alive. Explore Rahul's engineering projects and a living 3D forest.",
  },
  twitter: { card: "summary", title: "Rahul Kalagadda — AI & Software Engineer", description: "AI systems, full-stack applications, and thoughtful interfaces." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable + " " + cormorant.variable}>
    <head><link rel="preload" href="/forest/forest-clearing.webp" as="image" /></head>
    <body><Shell>{children}</Shell></body>
  </html>;
}
