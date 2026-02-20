'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SanityProject } from '@/types/sanity'
import { getProjectYear } from '@/lib/utils'
import { buildImageUrl } from '@/lib/sanity'

interface ProjectCardProps {
  project: SanityProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isWriting = project.type === 'Writing'
  const cardClass = `card project-card ${isWriting ? 'project-writing' : 'project-installation'}`

  // 1500px — covers single-column mobile at 2× retina (~750px × 2) and
  // 2-col project index at 2× retina (~730px × 2 = 1460px).
  // Next.js picks the right srcset entry from deviceSizes; this is the ceiling
  // of what Sanity CDN will serve so double-processing stays within one quality step.
  const cdnWidth = 1500

  // Intrinsic dimensions for next/image aspect-ratio reservation.
  // Writing cards use real dims; installation cards use a fixed landscape ratio.
  const intrinsicWidth = isWriting
    ? (project.featuredImage?.asset?.metadata?.dimensions?.width || 800)
    : 800
  const intrinsicHeight = isWriting
    ? (project.featuredImage?.asset?.metadata?.dimensions?.height || 1100)
    : 530

  // buildImageUrl bakes hotspot/crop into fp-x/fp-y — no CSS object-position needed.
  const imageUrl = buildImageUrl(project.featuredImage, cdnWidth)

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    objectFit: isWriting ? 'contain' : 'cover',
  }

  return (
    <div className={cardClass}>
      <Link href={`/projects/${project.url}`}>
        {isWriting ? (
          <div className="writing-cover-wrapper">
            <Image
              className="card-img"
              src={imageUrl}
              alt={project.title}
              width={intrinsicWidth}
              height={intrinsicHeight}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={imageStyle}
            />
          </div>
        ) : (
          <Image
            className="card-img"
            src={imageUrl}
            alt={project.title}
            width={intrinsicWidth}
            height={intrinsicHeight}
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, 33vw"
            style={imageStyle}
          />
        )}
      </Link>

      <div className="card-body">
        <Link href={`/projects/${project.url}`}>
          <p className="overline">
            {project.medium} — {getProjectYear(project.date || '')}
          </p>
          <h5 className="card-title">{project.title}</h5>
        </Link>
      </div>
    </div>
  )
}
