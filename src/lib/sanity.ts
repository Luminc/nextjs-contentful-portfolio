/**
 * SANITY CLIENT CONFIGURATION
 *
 * Drop-in replacement for src/lib/contentful.ts.
 * Exports the same four functions (getProjects, getProject, getPages, getPage,
 * getHeroImages) so that every page and component works without modification.
 *
 * Data is shaped to be compatible with the existing component props via the
 * SanityProject / SanityPage / SanityHeroImage interfaces in src/types/sanity.ts.
 *
 * Environment variables required (in .env):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_READ_TOKEN   (server-side only — not exposed to the browser)
 */

import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import type {
  SanityProject,
  SanityPage,
  SanityHeroImage,
  SanityImage,
} from '@/types/sanity'

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production', // no CDN in dev for instant Studio updates
  token: process.env.SANITY_API_READ_TOKEN, // needed to read draft documents later
})

// Separate client that always bypasses the CDN — used for hero images because
// hotspot/crop data can be stale on the CDN in production after Studio edits.
const sanityClientNoCdn = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

// ---------------------------------------------------------------------------
// Reusable GROQ fragments
// ---------------------------------------------------------------------------

// Resolves a Sanity image field.
// _ref is the raw asset reference ID used by @sanity/image-url to build CDN URLs.
// url and metadata.dimensions are kept for fallback src and aspect-ratio calculations.
const IMAGE_FIELDS = `{ asset->{ _id, _ref, url, metadata { dimensions } }, hotspot, crop }`

// Resolves a file field to { asset: { url } }
const FILE_FIELDS = `{ asset->{ url } }`

// Resolves a metadataSection reference
const METADATA_SECTION_FIELDS = `{
  _id,
  title,
  content,
  displayStyle
}`

// Resolves a section reference (imageWide | documentation | containerVideo | carousel)
const SECTION_FIELDS = `{
  _id,
  _type,
  title,
  alt,
  image ${IMAGE_FIELDS},
  images[] ${IMAGE_FIELDS},
  video ${FILE_FIELDS},
  interval,
  pause,
  controls,
  indicators
}`

// Full project projection
const PROJECT_FIELDS = `{
  _id,
  title,
  medium,
  materials,
  date,
  year,
  type,
  featured,
  url,
  featuredImage ${IMAGE_FIELDS},
  video ${FILE_FIELDS},
  content,
  documentation[] ${IMAGE_FIELDS},
  sections[]-> ${SECTION_FIELDS},
  metadataSections[]-> ${METADATA_SECTION_FIELDS}
}`

// ---------------------------------------------------------------------------
// Data fetching functions
// ---------------------------------------------------------------------------

// All projects, newest first — only published (defined title guards against
// the one stub document the migration created)
export const getProjects = async (): Promise<SanityProject[]> => {
  return sanityClient.fetch(
    `*[_type == "project" && defined(title) && defined(url) && !(_id in path("drafts.**"))] | order(date desc) ${PROJECT_FIELDS}`
  )
}

// Single project by URL slug
export const getProject = async (url: string): Promise<SanityProject | null> => {
  return sanityClient.fetch(
    `*[_type == "project" && url == $url && !(_id in path("drafts.**"))][0] ${PROJECT_FIELDS}`,
    { url }
  )
}

// All pages (about, etc.)
export const getPages = async (): Promise<SanityPage[]> => {
  return sanityClient.fetch(
    `*[_type == "about" && defined(slug) && !(_id in path("drafts.**"))] {
      _id,
      title,
      slug,
      image ${IMAGE_FIELDS},
      richDescription
    }`
  )
}

// Single page by slug
export const getPage = async (slug: string): Promise<SanityPage | null> => {
  return sanityClient.fetch(
    `*[_type == "about" && slug == $slug && !(_id in path("drafts.**"))][0] {
      _id,
      title,
      slug,
      image ${IMAGE_FIELDS},
      richDescription
    }`,
    { slug }
  )
}

// Hero images for homepage carousel — uses no-CDN client to ensure
// hotspot/crop data is always fresh after Studio edits.
export const getHeroImages = async (): Promise<SanityHeroImage[]> => {
  return sanityClientNoCdn.fetch(
    `*[_type == "heroImages" && defined(slug) && !(_id in path("drafts.**"))] {
      _id,
      title,
      description,
      slug,
      image ${IMAGE_FIELDS}
    }`
  )
}

// ---------------------------------------------------------------------------
// Image URL builder
// ---------------------------------------------------------------------------

const builder = imageUrlBuilder(sanityClient)

/**
 * Returns a Sanity image-url builder instance for the given image source.
 * Chain Sanity CDN transform methods before calling .url():
 *
 *   urlFor(image).width(800).auto('format').url()
 *   urlFor(image).width(1200).height(800).fit('crop').auto('format').url()
 *
 * Hotspot and crop data are applied automatically when the image object
 * contains those fields (the builder reads them directly from the source).
 */
export const urlFor = (source: SanityImageSource) => builder.image(source)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a SanityImage into a pre-sized CDN URL with hotspot/crop baked in.
 * Use this as the `src` for next/image (pass `unoptimized` to skip double-processing,
 * or omit it to let Next.js also run its optimisation pipeline on the result).
 *
 * @param image  - The SanityImage object (must include asset._ref or asset._id)
 * @param width  - Target display width in px (used to cap download size)
 * @param quality - JPEG/WebP quality 1–100 (default 85)
 */
export const buildImageUrl = (
  image: SanityImage | null | undefined,
  width: number,
  quality = 85,
): string => {
  if (!image?.asset) return '/placeholder.jpg'
  return urlFor(image)
    .width(width)
    .quality(quality)
    .auto('format')
    .url()
}

/**
 * Legacy helper — kept for backward compatibility.
 * New code should use buildImageUrl() instead, which passes hotspot/crop
 * to the CDN via fp-x/fp-y rather than as CSS object-position.
 *
 * Still useful when you need fill-mode images with CSS positioning
 * (e.g. next/image fill) and want to control focal point via CSS.
 */
export const getSanityImageStyle = (image: any): React.CSSProperties => {
  if (!image?.hotspot) {
    return {
      objectFit: 'cover',
      objectPosition: 'center center',
    }
  }

  const { x, y } = image.hotspot
  const crop = image.crop ?? { top: 0, bottom: 0, left: 0, right: 0 }

  const cropW = 1 - crop.left - crop.right
  const cropH = 1 - crop.top - crop.bottom

  const relX = (x - crop.left) / cropW
  const relY = (y - crop.top) / cropH

  return {
    objectFit: 'cover',
    objectPosition: `${(relX * 100).toFixed(2)}% ${(relY * 100).toFixed(2)}%`,
  }
}

export default sanityClient
