'use client'

import Link from 'next/link'
import { useState } from 'react'
import { siteMetadata } from '@/lib/site-metadata'
import { usePages } from '@/hooks/usePages'

export const Header = () => {
  const { data: pages, error } = usePages()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Gracefully handle errors - show navigation without dynamic pages
  const safePages = pages || []

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav 
      id="navigation" 
      className="nav-header"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="nav-container">
        <Link href="/" className="brand" onClick={closeMobileMenu}>
          {siteMetadata.title}
        </Link>
        
        {/* Burger button for mobile */}
        <button 
          className={`burger-menu ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="nav-links-item">
            <Link href="/projects" className="nav-links-text" onClick={closeMobileMenu}>
              Projects
            </Link>
          </div>
          <div className="nav-links-item">
            <Link href="/writing" className="nav-links-text" onClick={closeMobileMenu}>
              Writing
            </Link>
          </div>
          {safePages.map(page => (
            <div key={page.fields.slug} className="nav-links-item">
              <Link href={`/${page.fields.slug}`} className="nav-links-text" onClick={closeMobileMenu}>
                {page.fields.title}
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={closeMobileMenu}></div>
        )}
      </div>
    </nav>
  )
}