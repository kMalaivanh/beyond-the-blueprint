# Beyond the Blueprint

An immersive portfolio for Kailia Malaivanh, built around engineering better systems.

## New interactive storytelling

- **Fragmentation to Connection**: scroll-driven narrative where 96 illustrative engineering artifacts converge into shared definition nodes, preserving model-specific variation.
- **Explore the architecture**: switch between three model layouts, add or remove a branch circuit, select highlighted nodes, and scrub the consolidation timeline.
- **Engineering economics**: adjust production volume, assumed labor rates and setup costs to explore when a harness approach may or may not break even. All scenario inputs are synthetic, not employer data.
- **3D Drawings to Harness**: separate WebGL scene at `/harness.html`, using the supplied demonstration.

## Experience

- Cinematic editorial homepage with kinetic hero, scroll reveals, animated technical scenes and interactive project navigation.
- Electrical engineering case study at **/harness.html**: 2D drawings, 3D RV wire routing, model-length morph, cable growth, manual-vs-harness installation and draggable before/after comparison.
- Software automation, data analytics, product design, and leadership chapters.

The 3D visualization is an illustrative reconstruction using generic vehicle geometry and fictional components, not confidential manufacturer CAD data. Figures in that animation are illustrative and should not be treated as recorded production measurements.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

Import this repository into Vercel as **Vite**, build command `npm run build`, output folder `dist`. With a linked Vercel project, updates to `main` usually trigger a new deployment automatically.

## Project structure

- `editorial.jsx` + `editorial.css` — current homepage
- `public/harness.html` — full 3D scroll experience (served at `/harness.html`)
- `src.jsx` + `SystemsLab.jsx` — earlier prototype kept as reference, not loaded by the homepage

## Next

Production QA across devices, technical project detail pages, performance optimization, and accessibility testing.
