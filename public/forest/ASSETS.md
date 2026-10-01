# Wild Systems forest assets

The three glTF assets are CC0. They are self-hosted; the portfolio does not call the Poly Haven API.

- `pine.glb`: [Pine Sapling Small, Poly Haven](https://polyhaven.com/a/pine_sapling_small). Rico Cilliers (modeling), Rob Tuytel (photography). GLB conversion from [Papyszoo/CC0-Public-Domain-Models](https://github.com/Papyszoo/CC0-Public-Domain-Models/tree/main/packs/polyhaven-nature-plants/models/pine_sapling_small). Added the original twig alpha map, simplified geometry, resized textures to 512px, encoded WebP, and applied Meshopt compression.
- `fern.glb`: [Fern 02, Poly Haven](https://polyhaven.com/a/fern_02). Rico Cilliers (modeling), Rob Tuytel (scanning). Packed the original 1K glTF with the original diffuse, separate alpha, normal, and ARM textures; merged the alpha into the diffuse, resized textures to 512px, and encoded WebP.
- `moss-rock.glb`: [Rock Moss Set 01, Poly Haven](https://polyhaven.com/a/rock_moss_set_01). GLB conversion from [Papyszoo/CC0-Public-Domain-Models](https://github.com/Papyszoo/CC0-Public-Domain-Models/tree/main/packs/polyhaven-nature-rocks/models/rock_moss_set_01). Simplified geometry, resized textures to 512px, encoded WebP, and applied Meshopt compression.

[Poly Haven license](https://polyhaven.com/license) · [CC0 legal text](https://creativecommons.org/publicdomain/zero/1.0/)

`forest-clearing.webp` is an original AI-generated backdrop made for this portfolio. Converted from the generated PNG to WebP for web delivery. Prompt:

> A photorealistic cinematic forest clearing at blue hour, deep emerald broadleaf and conifer foliage, realistic ferns, mossy ground, wet finely detailed bark, atmospheric mist layers, and a quiet path leading into a softly illuminated distant clearing. Sparse warm firefly lights and pale green moonlight. Tall trunks and close leaves frame the outer sides and upper corners. Dark misty negative space at center-left for HTML typography; beautiful forest depth on the right. Natural irregular plants, premium photographic realism, restrained colors. No text, logos, people, buildings, or UI. Near-black forest green, moss green, silver mist, subtle warm light. Wide 16:9 composition.

The leaf mark, botanical branches, project visuals, falling leaves, mist shaders, and firefly shaders are original code-native artwork.

## Scroll-driven forest film

`forest-journey.mp4` (1280px, 3.39MB) and `forest-journey-mobile.mp4` (720px, 1.36MB) are derived from [Camera Moving Along Path in Forest](https://www.pexels.com/video/camera-moving-along-path-in-forest-10091405/) by dabatepatvideos, under the [Pexels License](https://www.pexels.com/license/). This license is distinct from the CC0 model license. Source download: https://videos.pexels.com/video-files/10091405/10091405-uhd_3840_2160_30fps.mp4.

Trimmed to ten seconds, removed audio, resized for desktop/phone, and encoded as H.264 at 24fps with a keyframe every six frames and fast-start metadata. The film is self-hosted. Scroll position drives its current time; it never loops or autoplays. Reduced-motion, global pause, and Save-Data preferences use the original still backdrop. `.github/workflows/forest-film.yml` documents the encoding recipe.
