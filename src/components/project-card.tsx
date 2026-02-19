'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SanityProject } from '@/types/sanity'
import { getProjectYear } from '@/lib/utils'
import { getSanityImageStyle } from '@/lib/sanity'

interface ProjectCardProps {
  project: SanityProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isWriting = project.type === 'Writing'
  const cardClass = `card project-card ${isWriting ? 'project-writing' : 'project-installation'}`
  const imageUrl = project.featuredImage?.asset?.url || '/placeholder.jpg'

  // Writing cards use real dimensions for correct aspect ratio.
  // Installation cards use a fixed landscape ratio (matching the pre-migration
  // Contentful layout) so portrait images don't stretch the grid on mobile.
  const width = isWriting
    ? (project.featuredImage?.asset?.metadata?.dimensions?.width || 1000)
    : 1000
  const height = isWriting
    ? (project.featuredImage?.asset?.metadata?.dimensions?.height || 1200)
    : 600

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    ...getSanityImageStyle(project.featuredImage)
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
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ ...imageStyle, objectFit: 'contain' }}
            />
          </div>
        ) : (
          <Image
            className="card-img"
            src={imageUrl}
            alt={project.title}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
