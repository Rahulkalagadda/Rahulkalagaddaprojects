# Rahul Kalagadda — Portfolio

An editorial 3D portfolio for AI engineering, software engineering, and software development. Charcoal, cobalt, chrome, and spacious typography carry the same design through every page.

## Pages

- Home — interactive chrome sculpture, selected work, and engineering disciplines.
- Projects — searchable, filterable collection of six source-linked projects.
- Project case studies — challenge, approach, implementation, architecture, and clear scope.
- About — profile, experience, approach, and education.
- Expertise — skills connected to projects and an illustrative AI request walkthrough.
- Playground — Three.js geometry, material, speed, drag, keyboard, pause, and reset controls.
- Contact — direct links and a form that prepares a mail-client draft.
- Résumé — printable version, Markdown download, and clipboard copy.

## Development

Requires Node.js 22 and npm. Run `npm ci`, then `npm run dev`.

Run `npm run lint` and `npm run build` for production checks. Use `npm start` to serve the production build.

The existing Next.js, Three.js, and GSAP dependencies are preserved. Lenis 1.3.26 is added for smooth wheel scrolling; the npm lockfile records the dependency.

## Editing the portfolio

Profile, navigation, projects, disciplines, and experience live in `src/data/portfolio.ts`. Project routes are generated from that collection. New interface illustrations can be added to `src/components/portfolio/ProjectVisual.tsx`.

Project artwork is original conceptual illustration, not a screenshot of a deployed application. Public repository links are provided in every case study. Prototypes are labeled as prototypes; unverified commercial metrics and clinical claims are omitted.

## 3D and accessibility

The sculpture loads Three.js on the client. Chrome uses an environment map and physical material. Geometry and material controls update the existing renderer. Offscreen tabs and hidden scenes stop automatic frames; resources are disposed when the scene unmounts.

Reduced motion starts automatic rotation paused. The playground can explicitly play motion. Drag or arrow keys rotate the object; Home resets the view. A static orbital illustration appears when WebGL is unavailable.

The shell includes a mobile menu, persistent light/dark themes, a skip link, a native modal command palette, visible keyboard focus, and print styles. Use Ctrl/⌘ K to search pages and project case studies.

## Contact behavior

The form opens an encoded mailto draft. It does not send or store submissions. Visitors review and send the message in their email application, with a copyable draft as a fallback. No email service or secret keys are required.

## Automated verification

`.github/workflows/portfolio-checks.yml` runs npm ci, lint, a production build, and isolated Playwright browser checks on pull requests. Browser tooling is installed into the runner's temporary directory and does not change the application lockfile.

The browser checks cover all 13 content routes, a missing case-study 404, desktop and mobile overflow, project filtering and search, command navigation, theme persistence, encoded contact drafts, rendered geometry/material/keyboard changes, and reduced-motion behavior. Screenshots are uploaded as a workflow artifact.

To run browser checks locally, install Playwright separately, install its Chromium browser, and set `PLAYWRIGHT_PATH` to its absolute `index.mjs` path before running `npm run check:browser`.


## Kinetic studio motion

Lenis smooths wheel scrolling while touch remains native. GSAP ScrollTrigger coordinates section reveals, project-card depth, magnetic button icons, and gentle parallax. Native scrolling and visible content remain the baseline. Anchor links account for the sticky header; the command dialog keeps its own native scroll.

Three.js now provides scroll/pointer-responsive chrome in the hero and a real cobalt orbital sculpture in the playground teaser. Scenes initialize near the viewport, pause offscreen or in hidden tabs, cap pixel density, and dispose resources on route changes. The playground includes helix geometry and a physical iridescent finish.

The header's visual-effects control pauses motion and saves the preference locally. Operating-system reduced motion disables smoothing, reveals, parallax, and automatic sculpture rotation. Visitors can explicitly play the studio sculpture. The résumé retains native scrolling and print-friendly content.
