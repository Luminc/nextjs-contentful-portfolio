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
import type {
  SanityProject,
  SanityPage,
  SanityHeroImage,
} from '@/types/sanity'

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,           // edge-cached reads for published content
  token: process.env.SANITY_API_READ_TOKEN, // needed to read draft documents later
})

// Separate client that bypasses the CDN — used for data that includes
// hotspot/crop fields which the CDN may serve stale after Studio edits.
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

// Resolves a Sanity image field to { asset: { url, metadata: { dimensions } } }
const IMAGE_FIELDS = `{ asset->{ url, metadata { dimensions } }, hotspot, crop }`

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
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts Sanity hotspot data into a CSS object-position string.
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

  // Width and height of the visible (cropped) region, as fractions of 1
  const cropW = 1 - crop.left - crop.right
  const cropH = 1 - crop.top - crop.bottom

  // Re-map hotspot coords into the cropped space
  const relX = (x - crop.left) / cropW
  const relY = (y - crop.top) / cropH

  return {
    objectFit: 'cover',
    objectPosition: `${(relX * 100).toFixed(2)}% ${(relY * 100).toFixed(2)}%`,
  }
}

export default sanityClient
