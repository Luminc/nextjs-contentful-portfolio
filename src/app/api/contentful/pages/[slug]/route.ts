import { NextResponse } from 'next/server'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const entries = await client.getEntries({
      content_type: 'about',
      'fields.slug': params.slug,
      limit: 1,
    })
    
    if (entries.items.length === 0) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json(entries.items[0])
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}