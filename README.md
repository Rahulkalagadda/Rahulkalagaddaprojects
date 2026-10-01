# Rahul Kalagadda — Wild Systems

A forest-inspired portfolio for AI engineering, software engineering, and software development. A photorealistic clearing, real textured 3D foliage, ivory editorial typography, and lime details connect every page.

## Run

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm run build
npm start
```

Next.js 14, React 18, TypeScript, Three.js, GSAP, and Lenis. No application secrets or provider accounts are required to run the portfolio.

## Pages

Home, Projects, About, Expertise, Forest Lab, Contact, Résumé, Credits, and six individual project case studies. Project filters, technology search, a command palette, mobile navigation, light/dark themes, and a persistent motion pause are included.

Case studies link to Rahul's public repositories. Scope descriptions distinguish working application code from integration prototypes; no measured business outcomes or model accuracy claims are invented. Project artwork is labeled as original interface concepts.

## The living forest

The hero and Forest Lab use self-hosted glTF pine, fern, and moss-rock models, with real PBR textures and foliage alpha. Meshopt reduces the tree and rock downloads; Three.js loads its decoder dynamically. The original forest backdrop is a 269KB WebP. The three models together are about 1.58MB. Asset sources, licenses, changes, and the image prompt are documented in [public/forest/ASSETS.md](public/forest/ASSETS.md) and on `/credits`.

Three.js adds multi-depth mist, circular firefly glow, drifting leaves, wind sway, and pointer/scroll camera parallax. The Forest Lab provides moonlight/sunrise lighting, wind strength, fireflies, mist, pause/play, reset, pointer dragging, and keyboard exploration. Arrow keys move the camera; Home resets it.

Scenes initialize near the viewport, cap pixel density and automatic rendering at 30fps, pause automatic frames offscreen or in hidden tabs, and dispose GPU resources on navigation. The photograph remains visible while WebGL loads or when WebGL is unavailable. Mobile keeps native touch scrolling. Device reduced-motion preferences and the global pause stop automatic motion; the Forest Lab can explicitly play its local scene.

Lenis smooths wheel scrolling; GSAP coordinates reveals, project-card tilt, magnetic button icons, and gentle parallax. Anchor links respect the sticky header. Search dialogs use native scrolling. Content remains available when the animation libraries cannot load.

## Contact and résumé

The contact form validates fields and prepares an encoded `mailto:` draft. It does not claim to send or store messages. Direct email, GitHub, and LinkedIn links remain available. The résumé can be printed/saved as PDF through the browser, downloaded as Markdown, or copied.

## Verification and hosting

`npm run lint` and `npm run build` validate the implementation. `.github/workflows/portfolio-checks.yml` installs isolated Playwright tooling on GitHub Actions and runs `scripts/browser-checks.mjs` against a production server. It verifies all 14 pages, a 404, desktop/mobile overflow, navigation/search, filters, contact encoding, theme persistence, all three loaded models, rendered light/fireflies/mist/camera controls, smooth scrolling/anchors, motion pause, reduced motion, and a WebGL fallback. Screenshots are uploaded as workflow artifacts.

Vercel builds a preview from the pull request through the repository's existing integration. Deployment protection may require the project owner's Vercel login. This branch does not change deployment protection or production settings.
