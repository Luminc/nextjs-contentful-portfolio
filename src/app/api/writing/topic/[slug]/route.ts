import { NextResponse } from 'next/server'
import { getPostsByTopic } from '@/lib/blog'

/**
 * API route for filtering posts by topic
 * GET /api/writing/topic/[slug]
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Convert slug back to topic name (reverse the transformation)
    const topic = slug.replace(/-/g, ' ')
    
    // Get posts filtered by topic
    const posts = await getPostsByTopic(topic)
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts by topic:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch posts', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}