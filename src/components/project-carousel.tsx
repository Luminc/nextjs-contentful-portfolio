'use client'

/**
 * PROJECT CAROUSEL CLIENT COMPONENT
 *
 * Client component wrapper for Bootstrap Carousel.
 * Extracted to enable Server Component architecture for project pages.
 *
 * This component handles the interactive carousel functionality
 * while allowing the parent page to be a Server Component.
 */

import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import { createImageUrl } from '@/lib/utils'
import { ContentfulAsset } from '@/types/contentful'

interface ProjectCarouselProps {
  images: ContentfulAsset[]
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
        <Carousel.Item key={image.sys.id}>
          <Image
            src={createImageUrl(image.fields.file.url)}
            alt={title}
            width={image.fields.file.details.image?.width || 1200}
            height={image.fields.file.details.image?.height || 800}
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1000px"
            style={{ width: '100%', height: 'auto' }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProjectCarousel
