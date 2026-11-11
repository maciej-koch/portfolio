# maciej-koch.com

Personal site: one page, three sections (Me / Exp / Stack), a 3D avatar and a handful of easter eggs.
Next.js 16 (App Router, static), React 19, three.js via React Three Fiber, TypeScript. Deployed on Vercel from `main`.

Use the Node.js version pinned in `.nvmrc` (npm is included):

```sh
nvm install
nvm use
npm ci --ignore-scripts
```

```sh
npm run dev        # http://localhost:3000
npm run build && npm start
npm run check      # typecheck + lint + unit tests
```

## Layout

- `app/` — root layout (metadata, JSON-LD), the page and a 404 (voxel digits over the dust).
- `components/Site.tsx` — the page: sections, menu, brand decode, toasts, terminal.
- `components/Scene.tsx`, `Model.tsx`, `Particles.tsx` — the 3D scene (client only): one mesh per section, dust in the background.
- `lib/content.ts` — all copy and the section list. `lib/eggs.ts` — easter-egg events and the found counter. `lib/drawings.ts` — line art the dust can form.
- `tests/unit` (Vitest).

## Models

Originals (e.g. Meshy exports) live in `models-src/` (git-ignored); `public/models/` only holds the optimized copy
that ships to the browser. To shrink a new textured export (~28 MB → ~0.5 MB):

```sh
G() { npx -y @gltf-transform/cli "$@"; }
G weld models-src/me-textured.glb /tmp/a.glb
G simplify /tmp/a.glb /tmp/b.glb --ratio 0.05 --error 0.01
G unlit /tmp/b.glb /tmp/c.glb   # texture shown as-is, independent of scene lights
G prune /tmp/c.glb /tmp/d.glb
G webp /tmp/d.glb /tmp/e.glb --quality 80   # keep the full 2048 texture: Meshy atlases have no island padding, smaller = visible seams
G quantize /tmp/e.glb /tmp/f.glb
G meshopt /tmp/f.glb public/models/me.glb     # EXT_meshopt_compression; Model.tsx sets the decoder
```

Note: the texture inside the current `public/models/me.glb` was hand-patched (a dark stroke next to the right eye painted
over with skin color, atlas texels ~1036–1049 × 1161–1189), so re-running the recipe from `models-src/` brings the stroke
back unless the source texture is patched too.

`public/og.png` is a 1200×630 screenshot of the page (`#me`, reduced motion); retake it when the avatar changes.

## CV

The CV is a page (`app/cv`, content in `lib/cv.ts`, not linked, `noindex`) printed to `public/cv.pdf` with`npm run cv`.
