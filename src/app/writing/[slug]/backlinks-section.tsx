'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BacklinkContext } from '@/lib/blog'

interface BacklinksSectionProps {
  backlinks: BacklinkContext[]
}

export default function BacklinksSection({ backlinks }: BacklinksSectionProps) {
  const [showBacklinks, setShowBacklinks] = useState(false)

  if (backlinks.length === 0) {
    return null
  }

  return (
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
                href={`/writing/${backlink.slug}${backlink.anchorId ? `#${backlink.anchorId}` : ''}?highlight=${encodeURIComponent(backlink.context.substring(0, 30).trim())}`}
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
  )
}