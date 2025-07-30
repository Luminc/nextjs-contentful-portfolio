'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * BLOG INDEX PAGE
 * 
 * This page displays all published blog posts from the Obsidian vault.
 * Features:
 * - Client-side rendering with loading states
 * - Responsive card layout
 * - Post metadata (date, reading time, tags)
 * - Graceful handling when no posts exist
 */

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Layout pageTitle="Blog">
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

  if (error) {
    return (
      <Layout pageTitle="Blog">
        <Container>
          <div className="alert alert-danger" role="alert">
            Error loading blog posts: {error}
          </div>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Blog">
      <Container>
        {posts.length === 0 ? (
          <Row className="justify-content-center text-center py-5">
            <Col lg={8}>
              <p className="lead text-muted mb-4">
                No blog posts available yet. The blog content will appear here once the Obsidian vault is connected.
              </p>
              <div className="alert alert-info">
                <strong>Development Note:</strong> Initialize the git submodule with your Obsidian vault to see blog posts.
                <br />
                <code>git submodule add [your-blog-repo-url] src/content/blog</code>
              </div>
            </Col>
          </Row>
        ) : (
          <>
            <p className="lead text-muted mb-5 text-center">
              Thoughts, insights, and stories from my journey in design and technology.
            </p>
            
            <Row>
              {posts.map((post) => (
                <Col key={post.slug} lg={6} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-3">
                        <small className="text-muted">
                          {format(new Date(post.date), 'MMMM d, yyyy')} • {post.readingTime} min read
                        </small>
                      </div>
                      
                      <Card.Title className="h4 mb-3">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="text-decoration-none text-dark"
                        >
                          {post.title}
                        </Link>
                      </Card.Title>
                      
                      <Card.Text className="text-muted mb-3 flex-grow-1">
                        {post.excerpt}
                      </Card.Text>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="mb-3">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="badge bg-light text-dark me-2 mb-1"
                              style={{ fontSize: '0.8rem' }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-auto">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Read More →
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </Layout>
  )
}