import { createClient } from 'contentful'
import { Document } from '@contentful/rich-text-types'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export interface ContentfulAsset {
  sys: any
  fields: any
}

export interface ContentfulProject {
  sys: any
  fields: any
}

export interface ContentfulPage {
  sys: any
  fields: any
}

export const getProjects = async (): Promise<ContentfulProject[]> => {
  const entries = await client.getEntries({
    content_type: 'project',
    order: ['-fields.date'] as any,
  })
  
  return entries.items as ContentfulProject[]
}

export const getProject = async (url: string): Promise<ContentfulProject | null> => {
  const entries = await client.getEntries({
    content_type: 'project',
    'fields.url': url,
    limit: 1,
  })
  
  return entries.items.length > 0 ? entries.items[0] as ContentfulProject : null
}

export const getPages = async (): Promise<ContentfulPage[]> => {
  const entries = await client.getEntries({
    content_type: 'page',
  })
  
  return entries.items as ContentfulPage[]
}

export const getPage = async (slug: string): Promise<ContentfulPage | null> => {
  const entries = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    limit: 1,
  })
  
  return entries.items.length > 0 ? entries.items[0] as ContentfulPage : null
}

export default client