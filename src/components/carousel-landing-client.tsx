'use client'

import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import { createImageUrl } from '@/lib/utils'
import { CarouselSkeleton } from './skeleton'
import { ContentfulHeroImage } from '@/types/contentful'

interface CarouselLandingProps {
  heroImages: ContentfulHeroImage[]
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
        const targetImage = image.fields.imageFp?.fields.image || image.fields.image
        const focalPoint = image.fields.imageFp?.fields.focalPoint

        // Calculate object position - defaulting to center if no focal point
        // If focalPoint coordinates are pixels (> 1 and not already percentages), 
        // we convert them to % by dividing by image dimensions.
        let objectPosition = 'center center'
        if (focalPoint) {
          const imgWidth = targetImage?.fields?.file?.details?.image?.width || 1200
          const imgHeight = targetImage?.fields?.file?.details?.image?.height || 800

          let x = focalPoint.focalPoint.x
          let y = focalPoint.focalPoint.y

          // If coordinates are clearly pixels (greater than a reasonable percentage or if they look like absolute values)
          // We convert them to percentages. If they are already 0-1, we treat them as normalized.
          if (x > 1.1 || y > 1.1) {
            // Check if they are already percentages (0-100) or pixels
            // Usually if x > 100 or y > 100, they are almost certainly pixels.
            // If they are between 1 and 100, they could be either, but let's assume pixels if they scale with image size.
            // A safer bet: if they are significantly larger than 100, or if we just divide anyway.
            x = (x / imgWidth) * 100
            y = (y / imgHeight) * 100
          } else {
            // Normalized 0-1
            x = x * 100
            y = y * 100
          }

          objectPosition = `${x}% ${y}%`
        }

        const positionStyles: React.CSSProperties = {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          minHeight: '50vh', // Ensure it matches SCSS and has a baseline height for cropping
        }

        return (
          <Carousel.Item key={image.sys.id}>
            <Link href={`/projects/${image.fields.slug}`}>
              <Image
                className="carousel-cover"
                src={createImageUrl(targetImage?.fields?.file?.url || '/placeholder.jpg')}
                alt={image.fields.description || image.fields.title || ""}
                width={targetImage?.fields?.file?.details?.image?.width || 1200}
                height={targetImage?.fields?.file?.details?.image?.height || 800}
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                style={positionStyles}
              />
            </Link>
            <Link href={`/projects/${image.fields.slug}`}>
              <Carousel.Caption style={{ paddingTop: "20px", paddingRight: "0" }}>
                <h5>{image.fields.title || "Placeholder"}</h5>
                <p className="leading-loose caption">{image.fields.description}</p>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        )
      })}
    </Carousel>
  )
}

export default CarouselLanding
