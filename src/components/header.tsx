'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteMetadata } from '@/lib/site-metadata'
import dynamic from 'next/dynamic'

// Dynamically import TorusLogo to avoid SSR issues with Three.js
const TorusLogo = dynamic(
  () => import('@/components/torus-logo'),
  { ssr: false }
)

export const Header = () => {
  const pathname = usePathname()
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [isLogoPressed, setIsLogoPressed] = useState(false)
  const [spinVelocity, setSpinVelocity] = useState({ x: 0, y: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [shouldLoad3D, setShouldLoad3D] = useState(false) // When to start mounting 3D
  const [is3DReady, setIs3DReady] = useState(false) // When 3D is substantially visible (faded in)

  // Delay loading the 3D logo to prioritize LCP and TBT
  useEffect(() => {
    // 1. Wait for main thread to settle
    const loadTimer = setTimeout(() => {
      setShouldLoad3D(true)

      // 2. Give Three.js a moment to initialize before fading in
      // This prevents a "pop" of un-rendered canvas
      setTimeout(() => {
        setIs3DReady(true)
      }, 100)
    }, 2500)

    return () => clearTimeout(loadTimer)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

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
      className="justify-content-between align-items-center py-2 px-4"
      style={{ display: 'flex', position: 'relative', zIndex: 1000 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="brand"
        style={{ display: 'flex', alignItems: 'center', gap: '0', zIndex: 1001 }}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => {
          setIsLogoHovered(false)
          setIsLogoPressed(false)
        }}
        onMouseDown={() => setIsLogoPressed(true)}
        onMouseUp={() => setIsLogoPressed(false)}
        onClick={(e) => {
          handleLogoClick(e)
          closeMobileMenu()
        }}
      >
        <div style={{ width: '90px', height: '90px', flexShrink: 0, position: 'relative' }}>
          {/* 1. Static Placeholder - Fades out when 3D is ready */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: is3DReady ? 0 : 1,
              transition: 'opacity 1.0s ease-in-out',
              pointerEvents: is3DReady ? 'none' : 'auto'
            }}
          >
            <img
              src="/placeholder-torus-45.svg"
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* 2. 3D Component - Mounts late, then fades in */}
          {shouldLoad3D && (
            <div
              style={{
                width: '100%',
                height: '100%',
                opacity: is3DReady ? 1 : 0,
                transition: 'opacity 1.0s ease-in-out'
              }}
            >
              <TorusLogo
                color={getLogoColor()}
                spinVelocity={spinVelocity}
                onSpinVelocityChange={setSpinVelocity}
              />
            </div>
          )}
        </div>
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
          <Link href="/projects" className="nav-links-text display-1" onClick={closeMobileMenu}>
            Projects
          </Link>
        </div>
        <div className="nav-links-item">
          <Link href="/about" className="nav-links-text display-1" onClick={closeMobileMenu}>
            About
          </Link>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
    </nav>
  )
}