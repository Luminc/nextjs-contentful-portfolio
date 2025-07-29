'use client'

import Link from 'next/link'
import { siteMetadata } from '@/lib/site-metadata'
import { usePages } from '@/hooks/usePages'

export const Header = () => {
  const { data: pages, error } = usePages()
  
  // Gracefully handle errors - show navigation without dynamic pages
  const safePages = pages || []

  return (
    <nav 
      id="navigation" 
      className="justify-content-between align-items-end nav-links py-2 px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link href="/" className="brand">
        {siteMetadata.title}
      </Link>
      <div className="nav-links">
        <div className="nav-links-item">
          <Link href="/projects" className="nav-links-text">
            Projects
          </Link>
        </div>
        {safePages.map(page => (
          <div key={page.fields.slug} className="nav-links-item">
            <Link href={`/${page.fields.slug}`} className="nav-links-text">
              {page.fields.title}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  )
}