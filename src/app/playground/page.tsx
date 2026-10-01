import type { Metadata } from "next";
import { PageIntro } from "@/components/portfolio/Primitives";
import { Playground } from "@/components/portfolio/Playground";
export const metadata: Metadata = { title: "3D Playground", description: "An interactive Three.js sculpture playground. Explore geometry, chrome, cobalt, pearl, and motion." };
export default function PlaygroundPage() {
  return <><PageIntro number="04" label="A small creative experiment" title="Less thinking." italic="More tinkering." text="A space to explore geometry, materials, and motion. Drag the sculpture, change a setting, and follow your curiosity." /><Playground /><div className="container playground-footnote mono"><span>EXPERIMENT / 001</span><span>KEYBOARD: ARROW KEYS TO ROTATE · HOME TO RESET</span><span>DESIGNED TO BE EXPLORED</span></div></>;
}
