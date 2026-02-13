import React from 'react'

interface HeroFlightProps {
  children?: React.ReactNode
  className?: string
  minHeight?: string
}

/**
 * HeroFlight Component
 *
 * A scrolling background animation component featuring the seamless texture
 * from background.png. The texture scrolls endlessly using the barberpole animation.
 *
 * Features:
 * - Seamless scrolling background texture
 * - Can contain child elements (e.g., framed images, text)
 * - Customizable minimum height
 * - Uses the legacy hero-flight animation from the original website
 */
export default function HeroFlight({ children, className = '', minHeight = '60vh' }: HeroFlightProps) {
  return (
    <div
      className={`hero-flight ${className}`}
      style={{ minHeight }}
    >
      {children}
    </div>
  )
}
