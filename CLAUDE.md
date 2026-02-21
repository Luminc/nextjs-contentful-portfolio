# Claude Instructions — Jeroen Kortekaas Portfolio

## Project Overview

Artist portfolio website. Next.js 14 (App Router) frontend consuming Sanity as headless CMS, deployed on Vercel. Migrated from Contentful in early 2026.

- **Sanity project ID:** `d2u6yqsx` | **dataset:** `production`
- **GitHub:** `git@github.com:Luminc/nextjs-contentful-portfolio.git`
- **Live site:** https://www.jeroenkortekaas.com

## Repository Structure

```
/                       Next.js 14 app — the live website
src/
  app/                  App Router pages (server components by default)
  components/           React components (mix of server and client)
  lib/sanity.ts         All Sanity data fetching (GROQ queries)
  types/sanity.ts       TypeScript types for Sanity content
  scss/                 Global styles
sanity-studio/          Standalone Sanity Studio (separate project, own node_modules)
scripts/                One-off utility scripts
```

## Important Rules

### TypeScript / tsconfig
- `sanity-studio/` is excluded from the root `tsconfig.json` — it has its own tsconfig and its own `node_modules` containing `sanity`. Never remove it from the exclude list.

### Sanity GROQ Queries
- **Always** include `!(_id in path("drafts.**"))` in every query filter. Omitting this leaks draft documents to the live site. See `src/lib/sanity.ts` for the pattern used on all four fetch functions.
- The CDN client (`useCdn: true`) is used for most queries. A no-CDN client (`sanityClientNoCdn`) is used for `getHeroImages` because hotspot/crop data can be stale on the CDN after Studio edits.
- All content fetching lives in `src/lib/sanity.ts`. Add new queries there.

### Environment Variables
Required in `.env.local` for local dev and in Vercel project settings for production:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=d2u6yqsx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<viewer token from sanity.io/manage>
```

### Sanity Studio
- The studio lives in `sanity-studio/` (was `sanity-migrate/` before rename).
- Run locally: `cd sanity-studio && npm run dev` → http://localhost:3333
- Deploy: `cd sanity-studio && npm run deploy`
- **Not embedded** in the Next.js app — no `/studio` route exists.

### Image Handling
- All images served from `cdn.sanity.io` — configured in `next.config.js` remotePatterns.
- Use `buildImageUrl(image, width)` from `src/lib/sanity.ts` for all `<Image src={...}>` usage. This bakes hotspot/crop into `fp-x`/`fp-y` CDN params — no CSS `object-position` needed.
- `@sanity/image-url` uses the named export `createImageUrlBuilder` (v2 API). The builder instance (`builder`) wraps `sanityClient`.
- `getSanityImageStyle()` is kept as a legacy helper for fill-mode images (e.g. hero carousel with `next/image fill`) where CSS `object-position` is still needed.
- Width caps by context: landing cards 1500px, project-index cards 1500px, documentation 1400px, hero carousel 1500px, imageWide sections 2400px, nav thumbnails 400px.
- `next.config.js` `deviceSizes` includes 1500 to avoid double-reprocessing at the common card ceiling.
- The SVG warning on build is a known cosmetic issue (icon SVGs in public/) — ignore it.

### Content Model — Key Types
- `project` — main content type. Has `sections[]` array of references to section types, rendered composably.
- `heroImages` — homepage carousel slides.
- `about` — generic pages (slug-routed).
- Section types: `imageWide`, `documentation`, `carousel`, `containerVideo`, `metadataSection`.

### Vercel Deployment
- Build command: `npm run build` (root only — studio is not built by Vercel).
- The `sanity-studio/` directory is excluded from the Vercel build via `tsconfig.json` exclude.
- `vercel.json` sets security headers and image cache headers.
