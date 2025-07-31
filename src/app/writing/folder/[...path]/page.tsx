'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * FOLDER BROWSING PAGE
 * 
 * This page displays all posts from a specific folder in the dark-intelligibility vault.
 * Features:
 * - Folder hierarchy navigation
 * - Posts organized by vault structure
 * - Breadcrumb navigation
 * - Responsive card layout
 */

export default function FolderPage() {
  const params = useParams()
  const pathSegments = Array.isArray(params.path) ? params.path : [params.path].filter(Boolean)
  const folderPath = pathSegments.join('/')
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!folderPath) return

    fetch(`/api/writing/folder/${encodeURIComponent(folderPath)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load folder posts')
        }
        return res.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [folderPath])

  // Generate breadcrumbs
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { name: 'Writing', path: '/writing' },
      { name: 'Vault', path: '/writing/vault' }
    ]
    
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += segment
      breadcrumbs.push({
        name: segment,
        path: `/writing/folder/${currentPath}`
      })
      if (index < pathSegments.length - 1) {
        currentPath += '/'
      }
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  const folderName = pathSegments[pathSegments.length - 1] || 'Root'

  if (loading) {
    return (
      <Layout pageTitle={`Folder: ${folderName}`}>
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
      <Layout pageTitle={`Folder: ${folderName}`}>
        <Container>
          <div className="alert alert-danger" role="alert">
            Error loading folder: {error}
          </div>
          <Link href="/writing" className="btn btn-primary">
            ← Back to Writing
          </Link>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout pageTitle={`${folderName}`}>
      <div className="blog-page">
        <Container>
          {/* Breadcrumb navigation */}
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  {breadcrumbs.map((crumb, index) => (
                    <li 
                      key={crumb.path} 
                      className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                    >
                      {index === breadcrumbs.length - 1 ? (
                        crumb.name
                      ) : (
                        <Link href={crumb.path}>{crumb.name}</Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </Col>
          </Row>

          {posts.length === 0 ? (
            <Row className="justify-content-center text-center py-5">
              <Col lg={8}>
                <p className="lead text-muted mb-4">
                  No posts found in this folder.
                </p>
                <Link href="/writing" className="btn btn-primary">
                  ← Back to Writing
                </Link>
              </Col>
            </Row>
          ) : (
            <div className="blog-index">
              <Row className="justify-content-center mb-5">
                <Col lg={8} className="text-center">
                  <p className="lead" style={{ fontSize: '1.2rem', color: 'rgba(20, 20, 20, 0.7)' }}>
                    {posts.length} {posts.length === 1 ? 'piece' : 'pieces'} in {folderName}
                  </p>
                </Col>
              </Row>
              
              <Row>
                {posts.map((post) => (
                  <Col key={post.slug} lg={6} className="mb-5">
                    <Card className="blog-card h-100">
                      <Card.Body className="d-flex flex-column p-4">
                        <div className="blog-meta mb-3">
                          {format(new Date(post.date), 'MMMM d, yyyy')} • {post.readingTime} min read
                        </div>
                        
                        <Card.Title className="card-title mb-3">
                          <Link href={`/writing/${post.slug}`}>
                            {post.title}
                          </Link>
                        </Card.Title>
                        
                        <Card.Text className="card-text mb-4 flex-grow-1">
                          {post.excerpt}
                        </Card.Text>
                        
                        <div className="mt-auto">
                          <Link href={`/writing/${post.slug}`} className="btn">
                            Read More →
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  )
}