'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost, BacklinkContext } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * INDIVIDUAL BLOG POST PAGE
 * 
 * This page displays a single blog post with:
 * - Client-side rendering with loading states
 * - Full markdown content rendered as HTML
 * - Post metadata and navigation
 * - Responsive typography
 * - Back to blog navigation
 */

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [backlinks, setBacklinks] = useState<BacklinkContext[]>([])
  const [showBacklinks, setShowBacklinks] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/writing/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Post not found')
        }
        return res.json()
      })
      .then(data => {
        setPost(data)
        // Always try to fetch backlinks from the dedicated API
        return fetch(`/api/writing/backlinks/${slug}`)
          .then(res => res.ok ? res.json() : [])
          .then(backlinkData => {
            setBacklinks(backlinkData)
            setLoading(false)
          })
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  // Custom text highlighting system
  const highlightTextInContent = useCallback((searchText: string) => {
    const contentElement = document.querySelector('.blog-content')
    if (!contentElement) return false

    // Decode the URL-encoded text
    const decodedText = decodeURIComponent(searchText)
    
    // Remove existing highlights
    const existingHighlights = contentElement.querySelectorAll('.custom-highlight')
    existingHighlights.forEach(el => {
      const parent = el.parentNode
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el)
        parent.normalize()
      }
    })

    // Find and highlight the text
    const walker = document.createTreeWalker(
      contentElement,
      NodeFilter.SHOW_TEXT,
      null
    )

    const textNodes: Text[] = []
    let node
    while (node = walker.nextNode()) {
      textNodes.push(node as Text)
    }

    for (const textNode of textNodes) {
      const text = textNode.textContent || ''
      const lowerText = text.toLowerCase()
      const lowerSearch = decodedText.toLowerCase()
      
      const index = lowerText.indexOf(lowerSearch)
      if (index !== -1) {
        // Split the text and wrap the matching part
        const beforeText = text.substring(0, index)
        const matchText = text.substring(index, index + decodedText.length)
        const afterText = text.substring(index + decodedText.length)
        
        const span = document.createElement('span')
        span.className = 'custom-highlight'
        span.textContent = matchText
        
        const parent = textNode.parentNode
        if (parent) {
          if (beforeText) parent.insertBefore(document.createTextNode(beforeText), textNode)
          parent.insertBefore(span, textNode)
          if (afterText) parent.insertBefore(document.createTextNode(afterText), textNode)
          parent.removeChild(textNode)
          
          // Scroll to and animate the highlight
          setTimeout(() => {
            span.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest' 
            })
            span.classList.add('highlight-animate')
          }, 100)
          
          return true
        }
      }
    }
    
    // Fallback: try to find just the first few words if exact match fails
    if (decodedText.length > 10) {
      const fallbackSearch = decodedText.substring(0, 15).trim()
      return highlightTextInContent(fallbackSearch)
    }
    
    return false
  }, [])

  // Handle highlighting when page loads
  useEffect(() => {
    if (!post || !post.content) return

    const urlParams = new URLSearchParams(window.location.search)
    const highlightParam = urlParams.get('highlight')
    
    if (highlightParam) {
      // Wait for content to fully render
      setTimeout(() => {
        highlightTextInContent(highlightParam)
      }, 1000)
    }
  }, [post, highlightTextInContent])

  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </Layout>
    )
  }

  if (error || !post) {
    return (
      <Layout>
        <Container>
          <Row className="justify-content-center text-center py-5">
            <Col lg={8}>
              <h1 className="display-4 fw-bold text-dark mb-4">
                Post Not Found
              </h1>
              <p className="lead text-muted mb-4">
                The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
              <Link href="/writing" className="btn btn-primary">
                ← Back to Writing
              </Link>
            </Col>
          </Row>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <h1 className="text-center display-1 py-2">
          {post.title}
        </h1>
      </Container>
      <div className="blog-page">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              {/* Back navigation */}
              <div className="mb-5">
                <Link href="/writing" className="text-decoration-none" style={{ color: 'rgba(20, 20, 20, 0.5)' }}>
                  ← Back to Writing
                </Link>
              </div>

              {/* Post header */}
              <header className="mb-5">
                
                <div className="d-flex flex-wrap align-items-center mb-4 blog-meta">
                  <span className="me-4">
                    By {post.author}
                  </span>
                  <span className="me-4">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </span>
                  <span>
                    {post.readingTime} min read
                  </span>
                </div>

              </header>

              {/* Post content */}
              <article 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Topics colophon */}
              {post.topics && post.topics.length > 0 && (
                <div className="post-colophon">
                  <h6 className="colophon-heading">Topics</h6>
                  <div className="colophon-topics">
                    {post.topics.map((topic, index) => (
                      <span key={topic}>
                        <Link href={`/writing/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`} className="topic-link">
                          {topic}
                        </Link>
                        {index < (post.topics?.length || 0) - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Rhizomatic Backlinks Dropdown */}
              {backlinks.length > 0 && (
                <div className="post-backlinks">
                  <div 
                    className="backlinks-toggle"
                    onClick={() => setShowBacklinks(!showBacklinks)}
                    style={{ cursor: 'pointer' }}
                  >
                    <h6 className="backlinks-heading">
                      <span className="toggle-icon">
                        {showBacklinks ? '▼' : '▶'}
                      </span>
                      Referenced By ({backlinks.length})
                    </h6>
                  </div>
                  
                  {showBacklinks && (
                    <div className="backlinks-dropdown">
                      {backlinks.map((backlink) => (
                        <div key={backlink.slug} className="backlink-card">
                          <div className="backlink-header">
                            <Link 
                              href={`/writing/${backlink.slug}${backlink.anchorId ? `#${backlink.anchorId}` : ''}`} 
                              className="backlink-title"
                              title={`Go to ${backlink.title}${backlink.anchorId ? ` (${backlink.anchorId})` : ''}`}
                            >
                              {backlink.title}
                            </Link>
                            <div className="backlink-meta">
                              {backlink.folderPath && (
                                <span className="backlink-folder">
                                  {backlink.folderPath}
                                </span>
                              )}
                              {backlink.lineNumber && (
                                <span className="backlink-line">
                                  Line {backlink.lineNumber}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link 
                            href={`/writing/${backlink.slug}${backlink.anchorId ? `#${backlink.anchorId}` : ''}?highlight=${backlink.textFragment || ''}`}
                            className="backlink-context-link"
                            title="Click to view this excerpt in context"
                          >
                            <div className="backlink-context">
                              &ldquo;{backlink.context}&rdquo;
                            </div>
                          </Link>
                          {backlink.excerpt && backlink.excerpt !== backlink.context && (
                            <div className="backlink-excerpt">
                              {backlink.excerpt}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Post footer */}
              <footer className="blog-post-nav">
                <div className="d-flex justify-content-between align-items-center">
                  <Link href="/writing" className="btn">
                    ← All Writing
                  </Link>
                  
                  <div className="blog-meta">
                    Published {format(new Date(post.date), 'MMMM d, yyyy')}
                  </div>
                </div>
              </footer>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  )
}