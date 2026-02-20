'use client'

import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import { SanityImage } from '@/types/sanity'
import { buildImageUrl, getSanityImageStyle } from '@/lib/sanity'

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
        <Carousel.Item key={image.asset._id ?? image.asset.url}>
          <Image
            // 1400px — wide enough for portrait originals (~1300w) at retina in container-sm
            src={buildImageUrl(image, 1400)}
            alt={title}
            width={image.asset.metadata?.dimensions?.width || 1200}
            height={image.asset.metadata?.dimensions?.height || 1300}
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 576px) 100vw, 540px"
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
