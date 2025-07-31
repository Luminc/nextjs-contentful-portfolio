'use client'

import { useEffect, useCallback } from 'react'

interface ClientHighlighterProps {
  post: {
    content: string
  }
}

export default function ClientHighlighter({ post }: ClientHighlighterProps) {
  // Native text selection highlighting system
  const highlightTextInContent = useCallback((searchText: string) => {
    if (!window.getSelection) return false

    const contentElement = document.querySelector('.blog-content')
    if (!contentElement) return false

    // Clear any existing selection
    window.getSelection()?.removeAllRanges()

    // Decode the URL-encoded text
    const decodedText = decodeURIComponent(searchText)
    console.log('Searching for text:', decodedText)
    
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

    const urlParams = new URLSearchParams(window.location.search)
    const highlightParam = urlParams.get('highlight')
    
    if (highlightParam) {
      console.log('Highlighting text:', highlightParam)
      // Wait for content to fully render
      setTimeout(() => {
        const success = highlightTextInContent(highlightParam)
        console.log('Highlighting success:', success)
      }, 1500) // Increased timeout for slower connections
    }
  }, [post, highlightTextInContent])

  return null // This component only handles highlighting logic
}