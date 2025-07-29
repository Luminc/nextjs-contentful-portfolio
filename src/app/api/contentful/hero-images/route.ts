import { NextResponse } from 'next/server'
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function GET() {
  try {
    const entries = await client.getEntries({
      content_type: 'heroImages',
    })
    
    return NextResponse.json(entries.items)
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return NextResponse.json({ error: 'Failed to fetch hero images' }, { status: 500 })
  }
}