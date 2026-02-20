/**
 * TypeScript interfaces for Sanity data structures.
 *
 * These mirror the shape returned by the GROQ queries in src/lib/sanity.ts,
 * and are intentionally compatible with the Contentful interfaces they replace
 * so that components need no changes.
 */

// Resolved image asset (after asset-> dereference in GROQ)
export interface SanityImageAsset {
  _id: string    // used by @sanity/image-url builder
  url: string    // direct CDN URL (fallback / non-transformed)
  metadata: {
    dimensions: {
      width: number
      height: number
      aspectRatio: number
    }
  }
}

// Image field (type: "image" with hotspot: true in schema)
export interface SanityImage {
  asset: SanityImageAsset
  hotspot?: { x: number; y: number; height: number; width: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

// File field (type: "file" — used for videos)
export interface SanityFile {
  asset: {
    url: string
  }
}

// Portable Text block (minimal — full type comes from @portabletext/types if needed)
export type SanityPortableTextBlock = {
  _key: string
  _type: 'block'
  style: string
  children: { _key: string; _type: 'span'; text: string; marks: string[] }[]
  markDefs: { _key: string; _type: string; href?: string }[]
}

// Metadata section (resolved reference)
export interface SanityMetadataSection {
  _id: string
  title: string
  content: SanityPortableTextBlock[]
  displayStyle: 'caption' | 'paragraph' | 'list' | null
}

// Section types (resolved references from project.sections[]->)
export interface SanitySection {
  _id: string
  _type: 'imageWide' | 'documentation' | 'containerVideo' | 'carousel'
  title?: string
  alt?: string
  image?: SanityImage
  images?: SanityImage[]
  video?: SanityFile
  interval?: number
  pause?: boolean
  controls?: boolean
  indicators?: boolean
}

// Project document
export interface SanityProject {
  _id: string
  title: string
  medium: string
  materials?: string
  date: string | null
  year: string
  type: 'Installation' | 'Writing'
  featured: boolean | null
  url: string
  featuredImage: SanityImage | null
  video: SanityFile | null
  content: SanityPortableTextBlock[] | null
  documentation: SanityImage[] | null
  sections: SanitySection[] | null
  metadataSections: SanityMetadataSection[] | null
}

// Hero image document
export interface SanityHeroImage {
  _id: string
  title: string
  description: string
  slug: string
  image: SanityImage | null
}

// About / page document
export interface SanityPage {
  _id: string
  title: string
  slug: string
  image: SanityImage | null
  richDescription: SanityPortableTextBlock[] | null
}
