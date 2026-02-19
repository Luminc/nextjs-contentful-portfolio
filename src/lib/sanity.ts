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
    `*[_type == "project" && defined(title) && defined(url)] | order(date desc) ${PROJECT_FIELDS}`
  )
}

// Single project by URL slug
export const getProject = async (url: string): Promise<SanityProject | null> => {
  return sanityClient.fetch(
    `*[_type == "project" && url == $url][0] ${PROJECT_FIELDS}`,
    { url }
  )
}

// All pages (about, etc.)
export const getPages = async (): Promise<SanityPage[]> => {
  return sanityClient.fetch(
    `*[_type == "about" && defined(slug)] {
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
    `*[_type == "about" && slug == $slug][0] {
      _id,
      title,
      slug,
      image ${IMAGE_FIELDS},
      richDescription
    }`,
    { slug }
  )
}

// Hero images for homepage carousel
export const getHeroImages = async (): Promise<SanityHeroImage[]> => {
  return sanityClient.fetch(
    `*[_type == "heroImages" && defined(slug) && !(_id in path("drafts.**"))] {
      _id,
      title,
      description,
      slug,
      image ${IMAGE_FIELDS}
    }`
  )
}

export default sanityClient
