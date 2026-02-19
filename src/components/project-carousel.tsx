'use client'

import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import { SanityImage } from '@/types/sanity'
import { getSanityImageStyle } from '@/lib/sanity'

interface ProjectCarouselProps {
  images: SanityImage[]
  title: string
  interval?: number
  pause?: false | 'hover'
  controls?: boolean
  indicators?: boolean
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  images,
  title,
  interval = 5000,
  pause = 'hover',
  controls = true,
  indicators = true,
}) => {
  return (
    <Carousel
      fade
      interval={interval}
      pause={pause}
      controls={controls}
      indicators={indicators}
    >
      {images?.map((image, index) => (
        <Carousel.Item key={image.asset.url}>
          <Image
            src={image.asset.url}
            alt={title}
            width={image.asset.metadata?.dimensions?.width || 1200}
            height={image.asset.metadata?.dimensions?.height || 800}
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1000px"
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '30vh',
              ...getSanityImageStyle(image)
            }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProjectCarousel
