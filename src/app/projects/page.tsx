import type { Metadata } from "next";
import { PageIntro, CallToAction, SourceLink, ActionLink } from "@/components/portfolio/Primitives";
import { ProjectExplorer } from "@/components/portfolio/ProjectExplorer";
export const metadata: Metadata = { title: "Projects", description: "Explore Rahul Kalagadda's AI systems, full-stack applications, and interface prototypes, with source-linked engineering case studies." };
export default function ProjectsPage() {
  return <><PageIntro number="01" label="The project collection" title="Built with intent." italic="Made to explore." text="A closer look at the systems, interfaces, and experiments behind my work. Filter by discipline, search the stack, or dive into the engineering decisions."><div className="project-collection-links"><ActionLink href="/projects/compare">Compare projects</ActionLink><SourceLink label="Explore all repositories" /></div></PageIntro><ProjectExplorer /><CallToAction /></>;
}
