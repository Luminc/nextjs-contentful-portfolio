# Project Memory — Jeroen Kortekaas Portfolio

Running log of decisions, fixes and context for this project.

---

## Migration: Contentful → Sanity (Feb 2026)

The site was originally built on Contentful. Migrated to Sanity using `contentful-to-sanity` tooling. Migration artifacts (export JSONs, ndjson dataset) live in `sanity-studio/` alongside the studio itself.

**What changed:**
- `src/lib/contentful.ts` replaced by `src/lib/sanity.ts` — exports the same four functions (`getProjects`, `getProject`, `getPages`, `getPage`, `getHeroImages`) so all page components required zero changes.
- Types moved to `src/types/sanity.ts`.
- `next.config.js` gained `cdn.sanity.io` in `remotePatterns` (Contentful CDN hostnames kept for any old assets).
- `package.json` replaced Contentful SDK with `@sanity/client`.

---

## Issues Fixed

### Build: `Cannot find module 'sanity/cli'` (Feb 2026)
- **Cause:** Root `tsconfig.json` globbed `**/*.ts`, picking up `sanity-studio/sanity.cli.ts`. `sanity` is only in `sanity-studio/node_modules`, not root.
- **Fix:** Added `"sanity-studio"` to `exclude` in root `tsconfig.json`.

### Build: `Error: Configuration must contain projectId` on `/sitemap.xml` (Feb 2026)
- **Cause:** Sanity environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`) were not set in Vercel project settings.
- **Fix:** Added all three env vars in Vercel → Settings → Environment Variables.

### Draft documents leaking to projects index (Feb 2026)
- **Cause:** `getProjects()` GROQ query was missing the `!(_id in path("drafts.**"))` filter. `getHeroImages` already had it; the others did not.
- **Fix:** Added draft filter to all four fetch functions in `src/lib/sanity.ts`.

---

## Decisions

- **Studio hosting:** Sanity Studio runs locally (`cd sanity-studio && npm run dev`). `sanity deploy` was run but studio access via Sanity's hosted URL is not yet verified. Local studio fully functional.
- **No embedded studio:** The Next.js app does not embed the studio at `/studio`. The studio is a separate standalone project.
- **Folder rename:** `sanity-migrate/` → `sanity-studio/` for clarity (the migration is complete; the folder now serves as the ongoing Studio). Rename requires stopping the studio dev server first (`mv` fails while the process holds the directory open).
- **CDN vs no-CDN:** Hero images use a no-CDN Sanity client to ensure hotspot/crop edits are immediately reflected. All other queries use the CDN client.
