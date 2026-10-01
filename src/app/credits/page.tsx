import type { Metadata } from "next";
import { PageIntro, SourceLink } from "@/components/portfolio/Primitives";
import { LeafMark } from "@/components/portfolio/Botanical";

export const metadata: Metadata = { title: "Forest credits", description: "The people and open assets behind Wild Systems, Rahul Kalagadda's forest portfolio." };
const assets = [
  { title: "Pine sapling", url: "https://polyhaven.com/a/pine_sapling_small", text: "Detailed evergreen foliage and bark. Modeling by Rico Cilliers; photography by Rob Tuytel." },
  { title: "Fern clumps", url: "https://polyhaven.com/a/fern_02", text: "Realistic serrated fronds for the forest floor. Modeling by Rico Cilliers; scanning by Rob Tuytel." },
  { title: "Mossy rocks", url: "https://polyhaven.com/a/rock_moss_set_01", text: "Textured natural rocks that give the clearing a grounded, tactile feel." },
];
export default function CreditsPage() {
  return <><PageIntro number="05" label="Good work has roots" title="A little credit." italic="A lot of gratitude." text="The forest brings together original art, open 3D assets, and a few lines of digital weather. Here are the roots of the landscape." />
    <section className="container"><div className="credits-grid">{assets.map(asset => <article key={asset.title}><LeafMark /><h2>{asset.title}</h2><p>{asset.text}</p><p>Source: <a href={asset.url} target="_blank" rel="noopener noreferrer">Poly Haven</a> · <a href="https://polyhaven.com/license" target="_blank" rel="noopener noreferrer">CC0</a></p></article>)}</div><div className="credits-note"><p>The moonlit forest backdrop was created for this portfolio with AI image generation. The pine and rock assets use GLB conversions from <a className="text-link" href="https://github.com/Papyszoo/CC0-Public-Domain-Models" target="_blank" rel="noopener noreferrer">CC0 Public Domain Models</a>; the fern comes directly from Poly Haven. All three were optimized for this site, with foliage alpha maps preserved.</p><p style={{ marginTop: 18 }}>Three.js renders the foliage, mist, leaves, and fireflies. GSAP and Lenis add gentle page motion. The project illustrations are original interface concepts, and each engineering case study links to its source repository.</p><div style={{ marginTop: 20 }}><SourceLink /></div></div></section></>;
}
