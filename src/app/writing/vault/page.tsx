'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Layout from '@/components/layout'

/**
 * VAULT OVERVIEW PAGE
 * 
 * This page displays the folder structure of the dark-intelligibility vault.
 * Features:
 * - Hierarchical folder navigation
 * - File counts per folder
 * - Clean, organized layout
 * - Direct links to folder browsing
 */

interface FolderStructure {
  [key: string]: string[]
}

export default function VaultPage() {
  const [folderStructure, setFolderStructure] = useState<FolderStructure>({})
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

  // Organize folders by hierarchy
  const organizeFolders = (structure: FolderStructure) => {
    const organized: { [key: string]: { files: string[], subfolders: string[] } } = {}
    
    Object.keys(structure).forEach(folderPath => {
      const parts = folderPath.split('/')
      const folderName = parts[parts.length - 1] || 'Root'
      
      organized[folderPath] = {
        files: structure[folderPath],
        subfolders: []
      }
    })
    
    return organized
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

  const organizedFolders = organizeFolders(folderStructure)
  const folderEntries = Object.entries(organizedFolders)
    .sort(([a], [b]) => a.localeCompare(b))

  return (
    <Layout pageTitle="Knowledge Vault">
      <div className="blog-page">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Link href="/writing" className="text-decoration-none" style={{ color: 'rgba(20, 20, 20, 0.5)' }}>
                ← Back to Writing
              </Link>
            </Col>
          </Row>

          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <p className="lead" style={{ fontSize: '1.3rem', color: 'rgba(20, 20, 20, 0.7)' }}>
                Explore the organized structure of philosophical concepts, thinkers, and reflections.
              </p>
            </Col>
          </Row>

          {folderEntries.length === 0 ? (
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
            <Row>
              {folderEntries.map(([folderPath, { files }]) => {
                const folderName = folderPath.split('/').pop() || 'Root'
                const displayName = folderName.replace(/^\d+\s*/, '') // Remove number prefix
                
                return (
                  <Col key={folderPath} lg={4} md={6} className="mb-4">
                    <Card className="folder-card h-100">
                      <Card.Body className="d-flex flex-column p-4">
                        <Card.Title className="folder-title mb-3">
                          <Link href={`/writing/folder/${encodeURIComponent(folderPath)}`}>
                            📁 {displayName}
                          </Link>
                        </Card.Title>
                        
                        <Card.Text className="folder-description mb-4 flex-grow-1">
                          {files.length} {files.length === 1 ? 'item' : 'items'}
                        </Card.Text>
                        
                        <div className="mt-auto">
                          <Link href={`/writing/folder/${encodeURIComponent(folderPath)}`} className="btn btn-sm">
                            Browse →
                          </Link>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                )
              })}
            </Row>
          )}
        </Container>
      </div>
    </Layout>
  )
}