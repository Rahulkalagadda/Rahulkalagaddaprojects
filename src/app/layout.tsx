import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Shell } from "@/components/portfolio/Shell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" });
export const metadata: Metadata = {
  title: { default: "Rahul Kalagadda — AI & Software Engineer", template: "%s — Rahul Kalagadda" },
  description: "The portfolio of Rahul Kalagadda: AI engineering, software engineering, and thoughtful web development. Explore projects, engineering case studies, and an interactive 3D playground.",
  authors: [{ name: "Rahul Kalagadda", url: "https://github.com/Rahulkalagadda" }],
  creator: "Rahul Kalagadda",
  keywords: ["Rahul Kalagadda", "AI Engineer", "Software Engineer", "Software Developer", "React", "Next.js", "FastAPI", "RAG"],
  openGraph: {
    type: "website", locale: "en_IN", siteName: "Rahul Kalagadda",
    title: "Rahul Kalagadda — AI & Software Engineer",
    description: "Intelligence. Engineering. A little imagination. Explore Rahul's selected work and interactive 3D portfolio.",
  },
  twitter: { card: "summary", title: "Rahul Kalagadda — AI & Software Engineer", description: "AI systems, full-stack applications, and thoughtful interfaces." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable + " " + jetbrains.variable}>
    <body><Shell>{children}</Shell></body>
  </html>;
}
