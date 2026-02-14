/**
 * TypeScript interfaces for Contentful data structures
 */

// Base Contentful system fields
export interface ContentfulSys {
  id: string
  type: string
  createdAt: string
  updatedAt: string
  publishedVersion?: number
  revision?: number
  contentType: {
    sys: {
      type: string
      linkType: string
      id: string
    }
  }
  locale?: string
}

// Asset file details
export interface ContentfulFileDetails {
  size: number
  image?: {
    width: number
    height: number
  }
}

// Asset file
export interface ContentfulFile {
  url: string
  details: ContentfulFileDetails
  fileName: string
  contentType: string
}

// Asset
export interface ContentfulAsset {
  metadata: {
    tags: any[]
    concepts: any[]
  }
  sys: ContentfulSys
  fields: {
    title: string
    description?: string
    file: ContentfulFile
  }
}

// Rich text document structure
export interface ContentfulRichText {
  nodeType: string
  data: any
  content: any[]
}

// Project fields
export interface ContentfulProjectFields {
  title: string
  medium: string
  materials?: string // Legacy field - kept for backward compatibility
  metadataSections?: ContentfulMetadataSection[] // New flexible metadata sections
  date: string
  year: string
  type: 'Installation' | 'Writing'
  featured?: boolean
  content?: ContentfulRichText
  documentation?: ContentfulAsset[]
  url: string
  featuredImage?: ContentfulAsset
  video?: ContentfulAsset
  sections?: ContentfulSection[]
}

// Project
export interface ContentfulProject {
  metadata: {
    tags: any[]
    concepts: any[]
  }
  sys: ContentfulSys
  fields: ContentfulProjectFields
}

// Page fields
export interface ContentfulPageFields {
  title: string
  slug: string
  image?: ContentfulAsset
  richDescription?: ContentfulRichText
}

// Page
export interface ContentfulPage {
  metadata: {
    tags: any[]
    concepts: any[]
  }
  sys: ContentfulSys
  fields: ContentfulPageFields
}

// Hero image fields
export interface ContentfulHeroImageFields {
  title: string
  description?: string
  slug: string
  image?: ContentfulAsset
}

// Hero image
export interface ContentfulHeroImage {
  sys: ContentfulSys
  fields: ContentfulHeroImageFields
}

// Section types
export interface ContentfulSectionFields {
  title?: string
  alt?: string
  image?: ContentfulAsset
  images?: ContentfulAsset[]
  video?: ContentfulAsset
  interval?: number
  pause?: boolean
  controls?: boolean
  indicators?: boolean
}

export interface ContentfulSection {
  metadata?: {
    tags: any[]
    concepts: any[]
  }
  sys: ContentfulSys
  fields: ContentfulSectionFields
}

// Metadata section fields (for flexible project metadata)
export interface ContentfulMetadataSectionFields {
  title: string
  content: ContentfulRichText
  displayStyle?: 'caption' | 'paragraph' | 'list'
}

export interface ContentfulMetadataSection {
  metadata?: {
    tags: any[]
    concepts: any[]
  }
  sys: ContentfulSys
  fields: ContentfulMetadataSectionFields
}

// Carousel fields
export interface ContentfulCarouselFields {
  title: string
  images: ContentfulAsset[]
  pause: boolean
  indicators: boolean
  controls: boolean
  interval: number
}

// Container video fields
export interface ContentfulContainerVideoFields {
  title: string
  video: ContentfulAsset
}

// API response types
export interface ContentfulResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}