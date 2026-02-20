'use client'

import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import { CarouselSkeleton } from './skeleton'
import { buildImageUrl, getSanityImageStyle } from '@/lib/sanity'
import type { SanityHeroImage } from '@/types/sanity'

interface CarouselLandingProps {
  heroImages: SanityHeroImage[]
}

const CarouselLanding: React.FC<CarouselLandingProps> = ({ heroImages }) => {
  if (!heroImages || heroImages.length === 0) {
    return <CarouselSkeleton />
  }

  return (
    <Carousel
      pause={false}
      indicators={false}
      controls={false}
      className="mb-5 m-auto"
      fade
      style={{ width: "97vw", maxWidth: "1500px" }}
    >
      {heroImages.map((image, index) => {
        // Cap at 1500px wide (matches the carousel maxWidth) — saves bandwidth on large originals.
        const imageUrl = buildImageUrl(image.image, 1500)

        return (
          <Carousel.Item key={image._id}>
            <div className="d-flex flex-column">
              <Link
                href={`/projects/${image.slug}`}
                style={{
                  display: 'block',
                  position: 'relative',
                  width: '100%',
                  height: '65vh',
                  minHeight: '450px',
                  maxHeight: '800px',
                  overflow: 'hidden'
                }}
              >
                <Image
                  className="carousel-cover"
                  src={imageUrl}
                  alt={image.description || image.title || ''}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  style={getSanityImageStyle(image.image)}
                />
              </Link>
              <div
                className="carousel-caption-static"
                style={{
                  paddingTop: "1.5rem",
                  paddingBottom: "1rem",
                  textAlign: "right",
                  color: "var(--text-primary-dark, #000)"
                }}
              >
                <Link href={`/projects/${image.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h5 style={{ fontWeight: 400, marginBottom: '0.5rem' }}>
                    {image.title || 'Placeholder'}
                  </h5>
                  <p className="leading-loose caption" style={{ margin: 0 }}>
                    {image.description}
                  </p>
                </Link>
              </div>
            </div>
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}

export default CarouselLanding
