'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteMetadata } from '@/lib/site-metadata'
import { usePages } from '@/hooks/usePages'
import dynamic from 'next/dynamic'

// Dynamically import TorusLogo to avoid SSR issues with Three.js
const TorusLogo = dynamic(
  () => import('@/components/torus-logo'),
  { ssr: false }
)

export const Header = () => {
  const pathname = usePathname()
  const { data: pages, error } = usePages()
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [isLogoPressed, setIsLogoPressed] = useState(false)
  const [spinVelocity, setSpinVelocity] = useState({ x: 0, y: 0 })

  // Gracefully handle errors - show navigation without dynamic pages
  const safePages = pages || []

  // Determine logo color: red when pressed, yellow when hovered, gray default
  const getLogoColor = () => {
    if (isLogoPressed) return 'rgb(255, 0, 0)' // Red for pressed
    if (isLogoHovered) return 'rgb(231, 213, 44)' // Yellow for hover
    return '#333333' // Default dark gray
  }

  // Apply random spin on click
  const handleLogoClick = (e: React.MouseEvent) => {
    // Only prevent navigation if we're already on the home page
    const isOnHomePage = pathname === '/'

    if (isOnHomePage) {
      e.preventDefault()
    }

    // Always apply spin (fun on home, brief visual feedback before navigation on other pages)
    // Generate random velocities
    let velX = (Math.random() - 0.5) * 40
    let velY = (Math.random() - 0.5) * 40

    // Ensure minimum spin magnitude for responsiveness
    const magnitude = Math.sqrt(velX * velX + velY * velY)
    const minMagnitude = 15

    if (magnitude < minMagnitude) {
      const scale = minMagnitude / magnitude
      velX *= scale
      velY *= scale
    }

    // Use functional update to ensure we add to the most current velocity
    setSpinVelocity((prev) => ({
      x: prev.x + velX,
      y: prev.y + velY,
    }))
  }

  return (
    <nav
      id="navigation"
      className="justify-content-between align-items-center nav-links py-2 px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="brand"
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => {
          setIsLogoHovered(false)
          setIsLogoPressed(false)
        }}
        onMouseDown={() => setIsLogoPressed(true)}
        onMouseUp={() => setIsLogoPressed(false)}
        onClick={handleLogoClick}
      >
        <div style={{ width: '90px', height: '90px', flexShrink: 0 }}>
          <TorusLogo
            color={getLogoColor()}
            spinVelocity={spinVelocity}
            onSpinVelocityChange={setSpinVelocity}
          />
        </div>
        <span>{siteMetadata.title}</span>
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