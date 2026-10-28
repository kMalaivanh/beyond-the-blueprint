# Beyond the Blueprint — Particle Film

A cinematic, scroll-directed engineering portfolio for Kailia Malaivanh.

## Current homepage

The homepage is now a **single continuous WebGL particle animation**, not a collection of project cards. Scroll drives a seven-beat animation timeline:

1. A universe of disconnected engineering information
2. Three groups of independently maintained artifacts
3. Flattened electrical schematic
4. Three-dimensional routing and branching
5. Shared engineering definitions and consolidation
6. Reusable architecture
7. Connected systems across disciplines

The film uses **1,250 individually animated particles**, 150 flowing tracer particles, supporting connection segments, a layered star field, camera orbit, and cinematic narrative captions. The mouse adds gentle parallax. A 3D harness demonstration is still available at `/harness.html`, and GGWordle / GitHub project links appear at the end.

### Technical architecture

- `film.js`: current Three.js animation engine and scroll timeline
- `film.css`: editorial film styling, mobile layout and caption transitions
- `index.html`: entry point
- `public/harness.html`: existing interactive RV harness case study
- Earlier experimental React components remain in the repo as references but are **not** used by the current homepage.

### Development

```bash
npm install
npm run dev
```

### Production / Vercel

```bash
npm run build
```

Use Vite as the framework preset and `dist` as the build output directory.

### Notes

All shapes and routes are synthetic storytelling representations. They do not reproduce confidential employer drawings, manufacturing data or specifications. This is an interactive browser-rendered particle film, **not a pre-rendered video**. The scrolling timeline is the playback control. Production build and browser/GPU QA should be completed before public release.
