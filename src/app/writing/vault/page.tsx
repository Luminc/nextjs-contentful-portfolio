'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost } from '@/lib/blog'

/**
 * VAULT OVERVIEW PAGE
 * 
 * Interactive folder explorer with expandable dropdowns.
 * Features:
 * - Expandable folder tree navigation
 * - Inline content preview
 * - Direct links to individual posts
 * - Hierarchical organization
 */

interface FolderStructure {
  [key: string]: string[]
}

interface ExpandedFolders {
  [key: string]: boolean
}

interface FolderContents {
  [key: string]: BlogPost[]
}

export default function VaultPage() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({})
  const [expandedFolders, setExpandedFolders] = useState<ExpandedFolders>({})
  const [folderContents, setFolderContents] = useState<FolderContents>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/writing/vault')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load vault structure')
        }
        return res.json()
      })
      .then(data => {
        setFolderStructure(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Toggle folder expansion and load content if needed
  const toggleFolder = async (folderPath: string) => {
    const isExpanded = expandedFolders[folderPath]
    
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !isExpanded
    }))
    
    // Load folder contents if expanding and not already loaded
    if (!isExpanded && !folderContents[folderPath]) {
      try {
        const response = await fetch(`/api/writing/folder/${encodeURIComponent(folderPath)}`)
        if (response.ok) {
          const posts = await response.json()
          setFolderContents(prev => ({
            ...prev,
            [folderPath]: posts
          }))
        }
      } catch (error) {
        console.error('Failed to load folder contents:', error)
      }
    }
  }

  // Organize folders hierarchically
  const organizeFolders = (structure: FolderStructure) => {
    const mainFolders: string[] = []
    const subFolders: { [key: string]: string[] } = {}
    
    Object.keys(structure).forEach(folderPath => {
      const parts = folderPath.split('/')
      if (parts.length === 1) {
        mainFolders.push(folderPath)
      } else {
        const parent = parts[0]
        if (!subFolders[parent]) {
          subFolders[parent] = []
        }
        subFolders[parent].push(folderPath)
      }
    })
    
    return { mainFolders: mainFolders.sort(), subFolders }
  }

  if (loading) {
    return (
      <Layout pageTitle="Knowledge Vault">
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
      <Layout pageTitle="Knowledge Vault">
        <Container>
          <div className="alert alert-danger" role="alert">
            Error loading vault structure: {error}
          </div>
          <Link href="/writing" className="btn btn-primary">
            ← Back to Writing
          </Link>
        </Container>
      </Layout>
    )
  }

  const { mainFolders, subFolders } = organizeFolders(folderStructure)

  // Render folder with expandable content
  const renderFolder = (folderPath: string, level: number = 0) => {
    const folderName = folderPath.split('/').pop() || 'Root'
    const displayName = folderName.replace(/^\d+\s*/, '') // Remove number prefix
    const isExpanded = expandedFolders[folderPath]
    const contents = folderContents[folderPath] || []
    const fileCount = folderStructure[folderPath]?.length || 0
    const hasSubfolders = subFolders[folderPath]?.length > 0

    return (
      <div key={folderPath} className={`vault-folder level-${level}`}>
        <div 
          className="folder-header"
          onClick={() => toggleFolder(folderPath)}
          style={{ cursor: 'pointer', paddingLeft: `${level * 1.5}rem` }}
        >
          <span className="folder-icon">
            {isExpanded ? '📂' : '📁'}
          </span>
          <span className="folder-name">{displayName}</span>
          <span className="folder-count">({fileCount})</span>
          <span className="expand-icon">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
        
        {isExpanded && (
          <div className="folder-contents">
            {contents.map(post => (
              <div key={post.slug} className="vault-file" style={{ paddingLeft: `${(level + 1) * 1.5}rem` }}>
                <span className="file-icon">📄</span>
                <Link href={`/writing/${post.slug}`} className="file-link">
                  {post.title}
                </Link>
                <span className="file-meta">
                  {post.readingTime}min
                  {post.backlinks && post.backlinks.length > 0 && (
                    <span className="backlink-count"> • {post.backlinks.length} refs</span>
                  )}
                </span>
              </div>
            ))}
            
            {hasSubfolders && subFolders[folderPath]?.map(subPath => 
              renderFolder(subPath, level + 1)
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Layout pageTitle="Knowledge Vault">
      <div className="blog-page">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              <Link href="/writing" className="text-decoration-none" style={{ color: 'rgba(20, 20, 20, 0.5)' }}>
                ← Back to Writing
              </Link>
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
            <Col lg={10} className="text-center">
              <p className="lead" style={{ fontSize: '1.3rem', color: 'rgba(20, 20, 20, 0.7)' }}>
                Interactive exploration of the philosophical knowledge base. Click folders to expand and explore content.
              </p>
            </Col>
          </Row>

          {Object.keys(folderStructure).length === 0 ? (
            <Row className="justify-content-center text-center py-5">
              <Col lg={8}>
                <p className="lead text-muted mb-4">
                  No vault structure found. The dark-intelligibility repository may not be initialized.
                </p>
                <Link href="/writing" className="btn btn-primary">
                  ← Back to Writing
                </Link>
              </Col>
            </Row>
          ) : (
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className="vault-explorer">
                  {mainFolders.map(folderPath => renderFolder(folderPath, 0))}
                  {/* Handle root level files if any */}
                  {folderStructure['.'] && folderStructure['.'].length > 0 && renderFolder('.', 0)}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </Layout>
  )
}