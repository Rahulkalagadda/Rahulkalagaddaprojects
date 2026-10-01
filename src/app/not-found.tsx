import { ActionLink, Eyebrow } from "@/components/portfolio/Primitives";
export default function NotFound() {
  return <section className="container not-found"><Eyebrow>404 / A small detour</Eyebrow><h1>This dimension<br /><span className="serif-word">doesn&apos;t exist.</span></h1><p>The page you&apos;re looking for may have moved. There&apos;s plenty more to explore.</p><div className="action-row"><ActionLink href="/" primary>Back to home</ActionLink><ActionLink href="/projects">Explore projects</ActionLink></div></section>;
}
