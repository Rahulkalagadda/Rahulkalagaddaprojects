import type { Metadata } from "next";
import { PageIntro } from "@/components/portfolio/Primitives";
import { ForestLab } from "@/components/portfolio/ForestLab";
export const metadata: Metadata = { title: "Forest Lab", description: "Explore a realistic interactive Three.js forest. Change the light and wind, discover textured pine trees, ferns, and glowing fireflies." };
export default function PlaygroundPage() {
  return <><PageIntro number="04" label="An experiment in atmosphere" title="Take the" italic="scenic route." text="A tiny world of textured trees, drifting leaves, and quiet light. Change the atmosphere. Follow the fireflies. Stay a little longer." /><ForestLab /><div className="container playground-footnote mono"><span>WILD SYSTEMS / FOREST LAB</span><span>ARROW KEYS TO EXPLORE · HOME TO RESET</span><span>TAKE A MOMENT. LOOK AROUND.</span></div></>;
}
