'use client'

import { useEffect, useCallback } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'

interface ClientHighlighterProps {
  post: {
    content: string
  }
}

// Helper function to extract titles from parentheses
function extractTitleFromParentheses(text: string): string[] {
  const results: string[] = []
  
  // Match text in parentheses like "(The Poison, the Purge"
  const parenMatch = text.match(/\(([^)]+)/g)
  if (parenMatch) {
    parenMatch.forEach(match => {
      const title = match.substring(1).trim() // Remove opening parenthesis
      if (title.length > 3) {
        results.push(title)
        // Also try with common title patterns
        if (title.includes(',')) {
          const parts = title.split(',').map(p => p.trim())
          results.push(...parts.filter(p => p.length > 3))
        }
      }
    })
  }
  
  return results
}

export default function ClientHighlighter({ post }: ClientHighlighterProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // Native text selection highlighting system
  const highlightTextInContent = useCallback((searchText: string) => {
    if (!window.getSelection) return false

    const contentElement = document.querySelector('.blog-content')
    if (!contentElement) {
      console.log('Blog content element not found!')
      return false
    }
    
    // Debug: show first 200 chars of content
    const contentText = contentElement.textContent || ''
    console.log('Content preview:', contentText.substring(0, 200) + '...')
    console.log('Content length:', contentText.length)

    // Clear any existing selection
    window.getSelection()?.removeAllRanges()

    // Handle double URL encoding by decoding twice if needed
    let decodedText = decodeURIComponent(searchText)
    // Check if it still contains encoded characters and decode again
    if (decodedText.includes('%')) {
      try {
        decodedText = decodeURIComponent(decodedText)
        console.log('Double-decoded text:', decodedText)
      } catch (e) {
        console.log('Failed to double-decode, using single decode')
      }
    }
    
    // Clean up the search text - remove trailing punctuation that might cause issues
    const cleanedText = decodedText.replace(/[.,;!?]+$/, '').trim()
    console.log('Final search text:', cleanedText)
    console.log('Original parameter:', searchText)
    console.log('Text after cleaning:', cleanedText)
    
    // Use the cleaned text for searching
    decodedText = cleanedText
    
    // Use the native find functionality to locate and select text (if available)
    if ('find' in window && typeof (window as any).find === 'function') {
      try {
        const found = (window as any).find(decodedText, false, false, true, false, true, false)
        if (found) {
          console.log('Found and selected text:', decodedText)
          
          // Scroll the selection into view
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const rect = range.getBoundingClientRect()
            
            // Scroll to center the selection
            window.scrollTo({
              top: window.scrollY + rect.top - window.innerHeight / 2,
              behavior: 'smooth'
            })
          }
          return true
        }
      } catch (error) {
        // window.find might not be available in all browsers
        console.warn('window.find not available:', error)
      }
    }

    // Fallback: manual text search and selection
    const walker = document.createTreeWalker(
      contentElement,
      NodeFilter.SHOW_TEXT,
      null
    )

    let textNode
    while (textNode = walker.nextNode()) {
      const text = textNode.textContent || ''
      const lowerText = text.toLowerCase()
      const lowerSearch = decodedText.toLowerCase()
      
      const index = lowerText.indexOf(lowerSearch)
      if (index !== -1) {
        try {
          const range = document.createRange()
          range.setStart(textNode, index)
          range.setEnd(textNode, index + decodedText.length)
          
          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            selection.addRange(range)
            
            // Scroll to selection
            const rect = range.getBoundingClientRect()
            window.scrollTo({
              top: window.scrollY + rect.top - window.innerHeight / 2,
              behavior: 'smooth'
            })
            
            console.log('Manually selected text:', decodedText)
            return true
          }
        } catch (error) {
          console.warn('Range selection failed:', error)
        }
      }
    }
    
    // Try multiple fallback strategies, prioritizing longer phrases
    const words = decodedText.split(' ')
    const fallbackStrategies = [
      // Try progressively shorter word-based phrases first
      words.slice(0, Math.min(8, words.length)).join(' '), // Up to 8 words
      words.slice(0, Math.min(6, words.length)).join(' '), // Up to 6 words
      words.slice(0, Math.min(4, words.length)).join(' '), // Up to 4 words
      words.slice(0, Math.min(3, words.length)).join(' '), // Up to 3 words
      words.slice(0, 2).join(' '), // First 2 words
      
      // Try to extract just the title in parentheses if present
      ...extractTitleFromParentheses(decodedText),
      
      words[0], // First word only
      // Character-based fallbacks as last resort
      decodedText.substring(0, 30).trim(),
      decodedText.substring(0, 20).trim(),
      decodedText.substring(0, 15).trim()
    ]
    
    for (const fallback of fallbackStrategies) {
      if (fallback && fallback.length > 2 && fallback !== decodedText) {
        console.log('Trying fallback search:', fallback)
        if (highlightTextInContent(fallback)) {
          return true
        }
      }
    }
    
    console.log('Text not found after all fallbacks:', decodedText)
    return false
  }, [])

  // Handle highlighting when page loads
  useEffect(() => {
    if (!post || !post.content) return

    const checkForHighlight = (attempt = 1) => {
      // Multiple ways to extract the highlight parameter
      const nextHighlightParam = searchParams.get('highlight')
      
      // Manual parsing from current URL
      const currentUrl = window.location.href
      const urlObj = new URL(currentUrl)
      const manualHighlightParam = urlObj.searchParams.get('highlight')
      
      // Direct regex extraction as fallback
      const regexMatch = currentUrl.match(/[?&]highlight=([^&#]*)/i)
      const regexHighlightParam = regexMatch ? decodeURIComponent(regexMatch[1]) : null
      
      const highlightParam = nextHighlightParam || manualHighlightParam || regexHighlightParam
      
      console.log(`Attempt ${attempt} - ClientHighlighter effect running`)
      console.log('Post content available:', !!post)
      console.log('Next.js highlight param:', nextHighlightParam)
      console.log('Manual highlight param:', manualHighlightParam)
      console.log('Regex highlight param:', regexHighlightParam)
      console.log('Final highlight param:', highlightParam)
      console.log('Current URL:', currentUrl)
      console.log('URL search portion:', urlObj.search)
      
      if (highlightParam) {
        console.log('Raw highlight parameter:', highlightParam)
        
        // Wait for content to fully render
        setTimeout(() => {
          console.log('Starting highlighting process...')
          const success = highlightTextInContent(highlightParam)
          console.log('Highlighting result:', success)
        }, 1000)
      } else {
        console.log('No highlight parameter found')
        // Retry up to 3 times in case of timing issues
        if (attempt < 3) {
          setTimeout(() => checkForHighlight(attempt + 1), 500)
        }
      }
    }

    // Initial check with delay to handle Next.js navigation timing
    setTimeout(() => checkForHighlight(1), 100)
    
    // Also listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      setTimeout(() => checkForHighlight(), 200)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [post, highlightTextInContent, searchParams, pathname])

  return null // This component only handles highlighting logic
}