// Client-side API functions that call our Next.js API routes
import { 
  ContentfulProject, 
  ContentfulPage, 
  ContentfulHeroImage 
} from '@/types/contentful'

export const getProjects = async (): Promise<ContentfulProject[]> => {
  const response = await fetch('/api/contentful/projects')
  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }
  return response.json()
}

export const getProject = async (slug: string): Promise<ContentfulProject | null> => {
  const response = await fetch(`/api/contentful/projects/${slug}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to fetch project')
  }
  return response.json()
}

export const getPages = async (): Promise<ContentfulPage[]> => {
  const response = await fetch('/api/contentful/pages')
  if (!response.ok) {
    throw new Error('Failed to fetch pages')
  }
  return response.json()
}

export const getPage = async (slug: string): Promise<ContentfulPage | null> => {
  const response = await fetch(`/api/contentful/pages/${slug}`)
  if (response.status === 404) {
    return null
  }
  if (!response.ok) {
    throw new Error('Failed to fetch page')
  }
  return response.json()
}

export const getHeroImages = async (): Promise<ContentfulHeroImage[]> => {
  const response = await fetch('/api/contentful/hero-images')
  if (!response.ok) {
    throw new Error('Failed to fetch hero images')
  }
  return response.json()
}