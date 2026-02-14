/**
 * PROJECT DETAIL PAGE - SERVER COMPONENT
 *
 * Server-rendered project detail page with full SEO support.
 * This page generates static pages at build time and revalidates hourly.
 *
 * Features:
 * - Static Site Generation (SSG) via generateStaticParams
 * - Dynamic metadata for SEO (title, description, Open Graph)
 * - Schema.org structured data for rich results
 * - Server-side data fetching (no client-side loading states)
 * - Incremental Static Regeneration (ISR) - revalidates every hour
 */

import { Metadata } from 'next'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import Video from '@/components/video'
import MetadataSection from '@/components/metadata-section'
import ProjectCarousel from '@/components/project-carousel'
import { getProject, getProjects } from '@/lib/contentful'
import { generateProjectStructuredData } from '@/lib/structured-data'
import Image from 'next/image'
import Link from 'next/link'
import { createImageUrl, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

// Revalidate every hour (ISR)
export const revalidate = 3600

/**
 * GENERATE STATIC PARAMS
 * Pre-renders all project pages at build time
 */
export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project.fields.url,
  }))
}

/**
 * GENERATE METADATA
 * Dynamic metadata for SEO and social sharing
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = await getProject(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const imageUrl = project.fields.featuredImage?.fields?.file?.url
    ? createImageUrl(project.fields.featuredImage.fields.file.url)
    : undefined

  return {
    title: `${project.fields.title} | Jeroen Kortekaas`,
    description: project.fields.medium,
    openGraph: {
      title: project.fields.title,
      description: project.fields.medium,
      type: 'article',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: project.fields.featuredImage?.fields?.file?.details?.image?.width,
            height: project.fields.featuredImage?.fields?.file?.details?.image?.height,
            alt: project.fields.featuredImage?.fields?.description || project.fields.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.fields.title,
      description: project.fields.medium,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

/**
 * PROJECT PAGE COMPONENT
 */
export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  // Fetch project and all projects for navigation
  const [project, allProjects] = await Promise.all([
    getProject(params.slug),
    getProjects(),
  ])

  if (!project) {
    notFound()
  }

  // Calculate prev/next navigation
  const currentIndex = allProjects.findIndex((p) => p.fields.url === params.slug)
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const next = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  const formattedDate = formatDate(project.fields.date)
  const projectYear = new Date(project.fields.date).getFullYear()

  // Generate structured data for SEO
  const structuredData = generateProjectStructuredData(project)

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Layout className="project-page">
        <div className="container-xxl">
          <p className="text-center project-subtitle pt-2">{projectYear}</p>
          <h1 className="text-center display-1 py-2">{project.fields.title}</h1>
          <p className="text-center project-subtitle pb-5">
            {project.fields.medium}
          </p>
        </div>

        <div className="container-wide">
          <div className="row mb-5" id="project-content">
            <div className="col-md pb-5 featured-project-image">
              <Image
                src={createImageUrl(
                  project.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg'
                )}
                alt={
                  project.fields.featuredImage?.fields?.description ||
                  project.fields.title
                }
                width={
                  project.fields.featuredImage?.fields?.file?.details?.image?.width || 1200
                }
                height={
                  project.fields.featuredImage?.fields?.file?.details?.image?.height || 800
                }
                className="featured-project-image contain"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                priority
              />
            </div>

            {project.fields.content && (
              <div className="col">
                <div className="container">
                  <div className="pt-3">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                          <Link href="/projects">Projects</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          {project.fields.title}
                        </li>
                      </ol>
                    </nav>
                  </div>

                  <ContentfulRichText richText={project.fields.content} />

                  {/* New flexible metadata sections */}
                  {project.fields.metadataSections?.map((section) => (
                    <MetadataSection key={section.sys.id} section={section} />
                  ))}

                  {/* Fallback to legacy materials field */}
                  {!project.fields.metadataSections?.length &&
                    project.fields.materials && (
                      <div>
                        <p className="leading-loose caption caption-title">Materials:</p>
                        <p className="leading-loose caption">
                          {project.fields.materials}
                        </p>
                      </div>
                    )}

                  <p className="leading-loose caption caption-title">Date:</p>
                  <p className="leading-loose caption">{formattedDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        {project.fields.sections?.map((section: any) =>
          section.sys?.id ? (
            <section key={section.sys.id}>
              {section.sys.contentType?.sys.id === 'imageWide' && (
                <Image
                  src={createImageUrl(section.fields.image.fields.file.url)}
                  alt={section.fields.alt || section.fields.title}
                  width={section.fields.image.fields.file.details.image.width}
                  height={section.fields.image.fields.file.details.image.height}
                  loading="lazy"
                  style={{ width: '100%', height: 'auto' }}
                />
              )}

              {section.sys.contentType?.sys.id === 'documentation' &&
                section.fields.images?.map((image: any) => (
                  <div className="container-xxl" key={image.sys.id}>
                    <div className="image-wrapper">
                      <Image
                        src={createImageUrl(image.fields.file.url)}
                        alt={image.fields.fileName}
                        width={image.fields.file.details.image.width}
                        height={image.fields.file.details.image.height}
                        loading="lazy"
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>
                ))}

              {section.sys.contentType?.sys.id === 'containerVideo' && (
                <div className="container-sm my-5">
                  <Video
                    Src={createImageUrl(section.fields.video.fields.file.url)}
                    muted={true}
                  />
                </div>
              )}

              {section.sys.contentType?.sys.id === 'carousel' && (
                <div className="container-sm">
                  <ProjectCarousel
                    images={section.fields.images}
                    title={section.fields.title}
                    interval={section.fields.interval}
                    pause={section.fields.pause}
                    controls={section.fields.controls}
                    indicators={section.fields.indicators}
                  />
                </div>
              )}
            </section>
          ) : null
        )}

        {/* Main video */}
        {project.fields.video && (
          <div className="container-fluid my-5">
            <Video
              Src={createImageUrl(project.fields.video.fields.file.url)}
              Title={project.fields.video.fields.title}
            />
          </div>
        )}

        {/* Documentation images */}
        <div className="container">
          {project.fields.documentation?.map((image: any) => (
            <div className="image-wrapper" key={image.sys.id}>
              <Image
                alt={image.sys.id}
                src={createImageUrl(image.fields.file.url)}
                width={image.fields.file.details.image.width}
                height={image.fields.file.details.image.height}
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ))}

          {/* Navigation */}
          <div className="card-group align-items-end justify-content-between py-5 mt-4">
            {prev ? (
              <>
                <div className="card pagination-card d-none d-md-block">
                  <Link href={`/projects/${prev.fields.url}`}>
                    <Image
                      className="card-img"
                      src={createImageUrl(
                        prev.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg'
                      )}
                      alt={prev.fields.title}
                      width={600}
                      height={600}
                      loading="lazy"
                      style={{ objectFit: 'contain' }}
                    />
                  </Link>
                  <div className="card-body">
                    <Link href={`/projects/${prev.fields.url}`}>
                      <h5 className="card-title">&lt; {prev.fields.title}</h5>
                    </Link>
                  </div>
                </div>
                <div className="d-md-none">
                  <Link href={`/projects/${prev.fields.url}`}>&lt; Previous project</Link>
                </div>
              </>
            ) : (
              <div>
                <p className="card-title h2 grayed p2">&lt;</p>
              </div>
            )}

            {next ? (
              <>
                <div className="card pagination-card d-none d-md-block">
                  <Link href={`/projects/${next.fields.url}`}>
                    <Image
                      className="card-img"
                      src={createImageUrl(
                        next.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg'
                      )}
                      alt={next.fields.title}
                      width={600}
                      height={600}
                      loading="lazy"
                      style={{ objectFit: 'contain' }}
                    />
                  </Link>
                  <div className="card-body">
                    <Link href={`/projects/${next.fields.url}`}>
                      <h5 className="card-title text-right">{next.fields.title} &gt;</h5>
                    </Link>
                  </div>
                </div>
                <div className="d-md-none">
                  <Link href={`/projects/${next.fields.url}`}>Next project &gt;</Link>
                </div>
              </>
            ) : (
              <div>
                <p className="card-title h2 grayed p-3">&gt;</p>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  )
}
