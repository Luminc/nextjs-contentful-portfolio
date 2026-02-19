# Jeroen Kortekaas — Portfolio

Artist portfolio website for [jeroenkortekaas.com](https://www.jeroenkortekaas.com), built with **Next.js 14** and **Sanity** (migrated from Contentful). Deployed on Vercel.

## Architecture

```
/                       → Next.js 14 app (App Router) — deployed to Vercel
sanity-studio/          → Standalone Sanity Studio — run locally or deploy via sanity deploy
```

The Next.js app fetches content from Sanity at build/request time via GROQ queries. The studio is a separate project with its own `node_modules` and is excluded from the root `tsconfig.json`.

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero image carousel + recent projects + contact form |
| `/projects` | All projects grid with client-side type filtering |
| `/projects/[slug]` | Individual project page with composable sections |
| `/[slug]` | Generic pages (e.g. About) |

## Sanity Content Model

| Type | Purpose |
|---|---|
| `project` | Art project with featured image, sections, metadata |
| `heroImages` | Carousel images for the homepage |
| `about` | Generic pages (About etc.) |
| `imageWide` | Full-width image section |
| `documentation` | Multi-image collection section |
| `containerVideo` | Contained video block section |
| `carousel` | Image carousel section with configurable options |
| `metadataSection` | Flexible key/value metadata for project pages |
| `assets` | Site-wide assets (logos, favicons) |

Project pages are composable: `sections[]` references any section type and the frontend renders the appropriate component per `_type`.

## Getting Started

### Next.js App

1. **Clone and install**
   ```bash
   git clone git@github.com:Luminc/nextjs-contentful-portfolio.git
   cd nextjs-contentful-portfolio
   npm install
   ```

2. **Environment variables** — create `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=d2u6yqsx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_READ_TOKEN=your_sanity_read_token
   ```
   The read token can be generated at [sanity.io/manage](https://sanity.io/manage) → project → API → Tokens → add Viewer token.

3. **Run dev server**
   ```bash
   npm run dev
   # http://localhost:3000
   ```

### Sanity Studio

```bash
cd sanity-studio
npm install
npm run dev
# http://localhost:3333
```

To deploy the studio to Sanity's hosting:
```bash
cd sanity-studio
npm run deploy
# https://jeroen-kortekaas-portfolio.sanity.studio (or similar)
```

## Deployment

The Next.js app is deployed to **Vercel**. Required environment variables in Vercel project settings:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `d2u6yqsx` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `SANITY_API_READ_TOKEN` | Sanity Viewer token (server-side only) |

The Sanity Studio is deployed separately via `sanity deploy` from inside `sanity-studio/`.

## Tech Stack

- **Next.js 14** — App Router, server components, static + dynamic rendering
- **Sanity** — headless CMS, content fetched via `@sanity/client` and GROQ
- **React Bootstrap** — UI components and grid
- **Sass** — custom styling
- **Styled Components** — component-level CSS-in-JS
- **Three.js / React Three Fiber** — 3D elements
- **Vercel** — hosting and CI/CD
