import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CallToAction, PageIntro } from "@/components/portfolio/Primitives";
import { ProjectComparison } from "@/components/portfolio/ProjectComparison";

export const metadata: Metadata = {
  title: "Compare projects",
  description: "Compare Rahul Kalagadda's AI systems, full-stack applications, and interface prototypes by purpose, technology, architecture, and project scope.",
};

export default function CompareProjectsPage() {
  return <><PageIntro number="01.1" label="The work, side by side" title="Different systems." italic="Shared curiosity." text="From conversation pipelines to product interfaces. Explore how different projects turn an idea into a connected system."><Link className="text-link" href="/projects"><ArrowLeft size={16} />Back to all projects</Link></PageIntro><ProjectComparison /><CallToAction /></>;
}
