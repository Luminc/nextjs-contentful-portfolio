import { NextResponse } from 'next/server'
import { getFolderStructure } from '@/lib/blog'

/**
 * API route for getting vault folder structure
 * GET /api/writing/vault
 */
export async function GET() {
  try {
    // Get the folder structure from dark-intelligibility vault
    const structure = getFolderStructure()
    
    return NextResponse.json(structure)
  } catch (error) {
    console.error('Error fetching vault structure:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch vault structure', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch vault structure' },
      { status: 500 }
    )
  }
}