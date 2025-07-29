'use client'

import { useEffect, useState } from 'react'

interface SkipLink {
  href: string
  label: string
}

const SkipLinks = () => {
  const [skipLinks, setSkipLinks] = useState<SkipLink[]>([])

  useEffect(() => {
    // Dynamically detect available skip targets on the page
    const links: SkipLink[] = []
    
    // Always include main content
    if (document.querySelector('main')) {
      links.push({ href: '#main-content', label: 'Skip to main content' })
    }
    
    // Check for navigation
    if (document.querySelector('nav')) {
      links.push({ href: '#navigation', label: 'Skip to navigation' })
    }
    
    // Check for footer
    if (document.querySelector('footer')) {
      links.push({ href: '#footer', label: 'Skip to footer' })
    }
    
    // Check for projects grid
    if (document.querySelector('.card-columns')) {
      links.push({ href: '#projects-grid', label: 'Skip to projects' })
    }
    
    // Check for project content
    if (document.querySelector('.project-page')) {
      links.push({ href: '#project-content', label: 'Skip to project details' })
    }

    setSkipLinks(links)
  }, [])

  if (skipLinks.length === 0) return null

  return (
    <div className="skip-links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          onFocus={(e) => e.currentTarget.classList.add('skip-link-focused')}
          onBlur={(e) => e.currentTarget.classList.remove('skip-link-focused')}
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}

export default SkipLinks