'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'

interface TorusLogoProps {
  color?: string
  spinVelocity?: { x: number; y: number }
  onSpinVelocityChange?: (velocity: { x: number; y: number }) => void
}

/**
 * TorusLogo - Animated toroidal logo component
 * Optimized for header/logo usage with performance improvements
 */
export default function TorusLogo({
  color = '#333333',
  spinVelocity = { x: 0, y: 0 },
  onSpinVelocityChange,
}: TorusLogoProps) {
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const config = {
    lineCount: 30,
    speed: 0.15,
    tubeRadius: 3.45,
    torusRadius: 3.5,
    lineColor: color,
    strokeWidth: 1.0,
    rotationX: 80,
    rotationY: -45,
    fadeStart: 0.15,
    fadeEnd: 0.55,
  }

  // Intersection Observer to pause animation when off-screen
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', transition: 'all 0.2s ease' }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <TorusScene
          config={config}
          isVisible={isVisible}
          spinVelocity={spinVelocity}
          onSpinVelocityChange={onSpinVelocityChange}
        />
      </Canvas>
    </div>
  )
}

interface TorusSceneProps {
  config: {
    lineCount: number
    speed: number
    tubeRadius: number
    torusRadius: number
    lineColor: string
    strokeWidth: number
    rotationX: number
    rotationY: number
    fadeStart: number
    fadeEnd: number
  }
  isVisible: boolean
  spinVelocity: { x: number; y: number }
  onSpinVelocityChange?: (velocity: { x: number; y: number }) => void
}

function TorusScene({ config, isVisible, spinVelocity, onSpinVelocityChange }: TorusSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<any[]>([])
  const currentVelocityRef = useRef({ x: 0, y: 0 })
  const previousImpulseRef = useRef({ x: 0, y: 0 })

  // Target rotation angles in radians
  const targetRotation = useMemo(() => ({
    x: (config.rotationX * Math.PI) / 180,
    y: (config.rotationY * Math.PI) / 180,
  }), [config.rotationX, config.rotationY])

  // Precompute Unit Circle
  const circlePoints = useMemo(() => {
    const points: [number, number, number][] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      points.push([Math.cos(theta), Math.sin(theta), 0])
    }
    return points
  }, [])

  const indices = useMemo(
    () => Array.from({ length: config.lineCount }, (_, i) => i),
    [config.lineCount]
  )

  // Initialize rotation to target
  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.x = targetRotation.x
    groupRef.current.rotation.y = targetRotation.y
  }, [targetRotation])

  // When spin velocity changes, ADD it as an impulse (not replace)
  useEffect(() => {
    // Check if this is a new impulse (velocity changed from parent)
    if (
      spinVelocity.x !== previousImpulseRef.current.x ||
      spinVelocity.y !== previousImpulseRef.current.y
    ) {
      // Calculate the delta (new impulse to add)
      const deltaX = spinVelocity.x - previousImpulseRef.current.x
      const deltaY = spinVelocity.y - previousImpulseRef.current.y

      // Add the impulse to current velocity
      currentVelocityRef.current.x += deltaX
      currentVelocityRef.current.y += deltaY

      // Remember this impulse
      previousImpulseRef.current = { x: spinVelocity.x, y: spinVelocity.y }
    }
  }, [spinVelocity])

  // Update line colors when config.lineColor changes
  useEffect(() => {
    linesRef.current.forEach((lineObj) => {
      if (lineObj?.material) {
        lineObj.material.color.set(config.lineColor)
      }
    })
  }, [config.lineColor])

  // Animation loop - only runs when visible
  useFrame((state, delta) => {
    if (!isVisible || !groupRef.current) return

    const time = state.clock.getElapsedTime()
    const { speed, tubeRadius: r, torusRadius: R, fadeStart, fadeEnd } = config

    // Clamp delta to prevent massive spins when tab returns (max 1/15 second)
    const clampedDelta = Math.min(delta, 0.067)

    // Physics simulation for spin
    const springStiffness = 0.05 // How strongly it's pulled back
    const damping = 0.99 // Friction/deceleration

    // Calculate spring force (pulls rotation back to target)
    const deltaX = targetRotation.x - groupRef.current.rotation.x
    const deltaY = targetRotation.y - groupRef.current.rotation.y

    // Apply spring force and damping to velocity
    currentVelocityRef.current.x += deltaX * springStiffness
    currentVelocityRef.current.y += deltaY * springStiffness
    currentVelocityRef.current.x *= damping
    currentVelocityRef.current.y *= damping

    // Apply velocity to rotation
    groupRef.current.rotation.x += currentVelocityRef.current.x * clampedDelta
    groupRef.current.rotation.y += currentVelocityRef.current.y * clampedDelta

    linesRef.current.forEach((lineObj, i) => {
      if (!lineObj) return

      const initialU = (i / config.lineCount) * Math.PI * 2
      let u = (initialU + time * speed) % (Math.PI * 2)
      if (u < 0) u += Math.PI * 2

      const cosU = Math.cos(u)
      const progress = (cosU + 1) / 2

      // Calculate opacity
      let opacity = 0
      if (progress < fadeStart) opacity = 1
      else if (progress > fadeEnd) opacity = 0
      else {
        const range = fadeEnd - fadeStart
        opacity = range > 0.0001 ? 1 - (progress - fadeStart) / range : 0
      }
      opacity = Math.pow(opacity, 2)

      // Update position and scale
      const z = r * Math.sin(u)
      const currentR = R + r * cosU

      lineObj.scale.set(currentR, currentR, 1)
      lineObj.position.set(0, 0, z)

      // Update only dynamic properties (opacity and visibility)
      if (lineObj.material) {
        lineObj.material.opacity = opacity
        lineObj.material.visible = opacity > 0.01
      }
    })
  })

  return (
    <group ref={groupRef}>
      {indices.map((i) => (
        <Line
          key={i}
          ref={(el) => (linesRef.current[i] = el)}
          points={circlePoints}
          color={config.lineColor}
          lineWidth={config.strokeWidth}
          transparent
          opacity={1}
          depthWrite={true}
          toneMapped={false}
        />
      ))}
    </group>
  )
}
