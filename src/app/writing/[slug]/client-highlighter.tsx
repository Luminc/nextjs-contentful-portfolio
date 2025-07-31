'use client'

import { useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'

interface ClientHighlighterProps {
  post: {
    content: string
  }
}

export default function ClientHighlighter({ post }: ClientHighlighterProps) {
  const searchParams = useSearchParams()
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
    console.log('Final search text:', decodedText)
    console.log('Original parameter:', searchText)
    
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
    
    // Try fallback with shorter text
    if (decodedText.length > 15) {
      const fallbackSearch = decodedText.substring(0, 15).trim()
      console.log('Trying fallback search:', fallbackSearch)
      return highlightTextInContent(fallbackSearch)
    }
    
    console.log('Text not found:', decodedText)
    return false
  }, [])

  // Handle highlighting when page loads
  useEffect(() => {
    if (!post || !post.content) return

    const checkForHighlight = (attempt = 1) => {
      // Try both Next.js searchParams and manual URL parsing
      const nextHighlightParam = searchParams.get('highlight')
      const urlParams = new URLSearchParams(window.location.search)
      const manualHighlightParam = urlParams.get('highlight')
      const highlightParam = nextHighlightParam || manualHighlightParam
      
      console.log(`Attempt ${attempt} - ClientHighlighter effect running`)
      console.log('Post content available:', !!post)
      console.log('Next.js highlight param:', nextHighlightParam)
      console.log('Manual highlight param:', manualHighlightParam)
      console.log('Final highlight param:', highlightParam)
      console.log('Current URL:', window.location.href)
      
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

    // Initial check
    checkForHighlight()
    
    // Also listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      setTimeout(() => checkForHighlight(), 100)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [post, highlightTextInContent, searchParams])

  return null // This component only handles highlighting logic
}