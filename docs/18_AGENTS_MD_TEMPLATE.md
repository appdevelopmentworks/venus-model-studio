# AGENTS.md テンプレート

Codexは、この内容をプロジェクトルートの`AGENTS.md`へ反映してよい。

```text
# Venus Model Studio Agent Rules

## Source of truth
- Read docs/ before implementation.
- Product requirements and acceptance criteria override stylistic preferences.

## Assets
- User-created media lives in root assets/.
- Never fabricate, replace, regenerate, or silently modify user media.
- Sync assets/ to public/assets/ using scripts.
- MP4 is required; WebM is optional.
- Missing optional media must use graceful fallbacks.
- Do not require GLB, FBX, Blender, or other manual 3D assets for the initial release.

## 3D & signature experience
- Build rings, particles, panels, lighting, depth, and camera motion procedurally with React Three Fiber.
- Keep all important content in semantic HTML.
- Dynamically load the Canvas.
- Respect reduced motion and WebGL fallback.
- Only one active video texture at a time.
- Control every effect through the quality tier system (T0-T3) in lib/performance.ts.
- Signature moments (docs/19) must each ship with reduced-motion, no-WebGL, and mobile fallbacks.
- Postprocessing only on tier T3, limited to subtle Bloom + Grain.

## Extensibility
- Home composition is declared in data/home-sections.json (section registry); never hardcode the section list.
- Components resolve media via asset slots (lib/assets.ts getAsset), never via raw paths.
- Adding a model, project, or section must require zero code changes.
- Layouts and 3D scenes must adapt to any item count without breaking.

## Content integrity
- Clearly label AI MODEL, REAL MODEL, and AI-ENHANCED REAL TALENT.
- Publish real people only when rightsStatus is approved.
- Clearly label concept projects.
- Never invent clients, awards, press mentions, measurements, or credits.

## Engineering
- Prefer Server Components.
- Use Client Components only for 3D, animation, media, audio, and interactive controls.
- TypeScript strict; no ignored type errors.
- No console errors or broken asset URLs.
- Run lint, typecheck, tests, E2E, asset validation, and production build before completion.

## UX
- Mobile-first fallback must remain premium without 3D.
- Audio is opt-in.
- Videos outside the viewport pause.
- Keyboard, focus, screen readers, reduced motion, and long translations must work.
```
