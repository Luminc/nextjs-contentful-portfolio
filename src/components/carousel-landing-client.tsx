'use client'

import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import { CarouselSkeleton } from './skeleton'
import { SanityHeroImage } from '@/types/sanity'

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
      {heroImages.map(image => {
        const imageUrl = image.image?.asset?.url || '/placeholder.jpg'
        const width = image.image?.asset?.metadata?.dimensions?.width || 1200
        const height = image.image?.asset?.metadata?.dimensions?.height || 800

        // Native Sanity hotspot → CSS object-position (set per-image in Sanity Studio)
        const hotspot = image.image?.hotspot
        const objectPosition = hotspot
          ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
          : 'center center'

        const positionStyles: React.CSSProperties = {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          minHeight: '50vh',
        }

        return (
          <Carousel.Item key={image._id}>
            <Link href={`/projects/${image.slug}`}>
              <Image
                className="carousel-cover"
                src={imageUrl}
                alt={image.description || image.title || ''}
                width={width}
                height={height}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                style={positionStyles}
              />
            </Link>
            <Link href={`/projects/${image.slug}`}>
              <Carousel.Caption style={{ paddingTop: "20px", paddingRight: "0" }}>
                <h5>{image.title || 'Placeholder'}</h5>
                <p className="leading-loose caption">{image.description}</p>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}

export default CarouselLanding
