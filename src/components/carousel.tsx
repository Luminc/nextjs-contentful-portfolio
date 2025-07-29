'use client'

import { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import Image from 'next/image'
import Link from 'next/link'
import { getHeroImages } from '@/lib/api'

interface HeroImage {
  sys: {
    id: string
  }
  fields: any
}

const CarouselLanding = () => {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const images = await getHeroImages()
        setHeroImages(images as HeroImage[])
      } catch (error) {
        console.error('Error fetching hero images:', error)
      }
    }

    fetchHeroImages()
  }, [])

  const createImageUrl = (url: string) => {
    return url.startsWith('//') ? `https:${url}` : url
  }

  if (heroImages.length === 0) {
    return <div>Loading...</div>
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
      {heroImages.map(image => (
        <Carousel.Item key={image.sys.id}>
          <Link href={`/projects/${image.fields.slug}`}>
            <Image
              className="carousel-cover"
              src={createImageUrl(image.fields.image?.fields?.file?.url || '/placeholder.jpg')}
              alt={image.fields.description || image.fields.title || ""}
              width={image.fields.image?.fields?.file?.details?.image?.width || 1200}
              height={image.fields.image?.fields?.file?.details?.image?.height || 800}
              priority
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover'
              }}
            />
          </Link>
          <Link href={`/projects/${image.fields.slug}`}>
            <Carousel.Caption style={{ paddingTop: "20px", paddingRight: "0" }}>
              <h5>{image.fields.title || "Placeholder"}</h5>
              <p className="leading-loose caption">{image.fields.description}</p>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default CarouselLanding