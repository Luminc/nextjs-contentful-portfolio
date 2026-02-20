import { Metadata } from 'next'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import Video from '@/components/video'
import MetadataSection from '@/components/metadata-section'
import ProjectCarousel from '@/components/project-carousel'
import { getProject, getProjects, getSanityImageStyle, buildImageUrl } from '@/lib/sanity'
import { generateProjectStructuredData } from '@/lib/structured-data'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.url }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const project = await getProject(params.slug)
  if (!project) return { title: 'Project Not Found' }

  const imageUrl = project.featuredImage?.asset?.url

  return {
    title: `${project.title} | Jeroen Kortekaas`,
    description: project.medium,
    openGraph: {
      title: project.title,
      description: project.medium,
      type: 'article',
      ...(imageUrl && {
        images: [{
          url: imageUrl,
          width: project.featuredImage?.asset?.metadata?.dimensions?.width,
          height: project.featuredImage?.asset?.metadata?.dimensions?.height,
          alt: project.title,
        }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.medium,
      ...(imageUrl && { images: [imageUrl] }),
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string }
}) {
  const [project, allProjects] = await Promise.all([
    getProject(params.slug),
    getProjects(),
  ])

  if (!project) notFound()

  const currentIndex = allProjects.findIndex((p) => p.url === params.slug)
  const prev = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const next = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  const formattedDate = formatDate(project.date || '')
  const structuredData = generateProjectStructuredData(project)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Layout className="project-page">
        <div className="container-xxl">
          <p className="text-center project-subtitle pt-2">{project.year}</p>
          <h1 className="text-center display-1 py-2">{project.title}</h1>
          <p className="text-center project-subtitle pb-5">{project.medium}</p>
        </div>

        <div className="container-wide">
          <div className="row mb-5" id="project-content">
            <div className="col-md pb-5 featured-project-image">
              {project.featuredImage?.asset && (
                <Image
                  src={buildImageUrl(project.featuredImage, 1600)}
                  alt={project.title}
                  width={project.featuredImage.asset.metadata?.dimensions?.width || 1200}
                  height={project.featuredImage.asset.metadata?.dimensions?.height || 800}
                  className="featured-project-image contain"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                  priority
                />
              )}
            </div>

            {project.content && (
              <div className="col">
                <div className="container">
                  <div className="pt-3">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link href="/projects">Projects</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{project.title}</li>
                      </ol>
                    </nav>
                  </div>

                  <ContentfulRichText richText={project.content} />

                  {project.metadataSections?.map((section) => (
                    <MetadataSection key={section._id} section={section} />
                  ))}

                  {!project.metadataSections?.length && project.materials && (
                    <div>
                      <p className="leading-loose caption caption-title">Materials:</p>
                      <p className="leading-loose caption">{project.materials}</p>
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
        {project.sections?.map((section) => (
          <section key={section._id}>
            {section._type === 'imageWide' && section.image?.asset && (
              <Image
                // Full-bleed landscape — 2400px covers retina wide viewports
                src={buildImageUrl(section.image, 2400)}
                alt={section.alt || section.title || ''}
                width={section.image.asset.metadata?.dimensions?.width || 1920}
                height={section.image.asset.metadata?.dimensions?.height || 1080}
                loading="lazy"
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  minHeight: '40vh',
                  ...getSanityImageStyle(section.image)
                }}
              />
            )}

            {section._type === 'documentation' && section.images?.map((image, i) => (
              <div className="container-xxl" key={image.asset._id ?? image.asset.url + i}>
                <div className="image-wrapper">
                  <Image
                    // Portrait docs ~1300w in container-xxl; 1400 covers 2× retina
                    src={buildImageUrl(image, 1400)}
                    alt={section.title || ''}
                    width={image.asset.metadata?.dimensions?.width || 1300}
                    height={image.asset.metadata?.dimensions?.height || 1900}
                    loading="lazy"
                    sizes="(max-width: 576px) 100vw, (max-width: 1400px) 90vw, 1320px"
                    style={{
                      width: '100%',
                      height: 'auto',
                      ...getSanityImageStyle(image)
                    }}
                  />
                </div>
              </div>
            ))}

            {section._type === 'containerVideo' && section.video?.asset?.url && (
              <div className="container-sm my-5">
                <Video Src={section.video.asset.url} muted={true} />
              </div>
            )}

            {section._type === 'carousel' && section.images && (
              <div className="container-sm">
                <ProjectCarousel
                  images={section.images}
                  title={section.title || ''}
                  interval={section.interval}
                  pause={section.pause ? 'hover' : false}
                  controls={section.controls ?? true}
                  indicators={section.indicators ?? true}
                />
              </div>
            )}
          </section>
        ))}

        {/* Main video */}
        {project.video?.asset?.url && (
          <div className="container-fluid my-5">
            <Video Src={project.video.asset.url} Title={project.title} />
          </div>
        )}

        {/* Documentation images */}
        <div className="container">
          {project.documentation?.map((image, i) => (
            <div className="image-wrapper" key={image.asset._id ?? image.asset.url + i}>
              <Image
                alt={project.title}
                src={buildImageUrl(image, 1400)}
                width={image.asset.metadata?.dimensions?.width || 1300}
                height={image.asset.metadata?.dimensions?.height || 1900}
                loading="lazy"
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 90vw, 800px"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ))}

          {/* Prev / Next navigation */}
          <div className="project-navigation py-5 mt-5">
            <div className="row gx-5 align-items-center justify-content-between">
              <div className="col-6 text-start mb-4 mb-md-0">
                {prev ? (
                  <>
                    <Link href={`/projects/${prev.url}`} className="d-none d-md-flex text-decoration-none project-nav-link align-items-center">
                      <div style={{ width: '180px', flexShrink: 0 }}>
                        {prev.featuredImage?.asset && (
                          <Image src={buildImageUrl(prev.featuredImage, 400)} alt={prev.title} width={400} height={300} loading="lazy" className="shadow-sm" style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: '2px' }} />
                        )}
                      </div>
                      <div className="ps-4">
                        <span className="d-block text-uppercase small mb-1" style={{ letterSpacing: '2px', fontSize: '0.7rem' }}>Previous</span>
                        <h4 className="card-title mb-0 fw-light" style={{ fontSize: '1.4rem' }}>{prev.title}</h4>
                      </div>
                    </Link>
                    <div className="d-md-none">
                      <Link href={`/projects/${prev.url}`} className="d-block project-nav-link" style={{ fontSize: '1rem', fontWeight: 200 }}>
                        &larr; {prev.title}
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="d-none d-md-block opacity-25"><span className="display-4 text-muted">&larr;</span></div>
                )}
              </div>

              <div className="col-6 text-end">
                {next ? (
                  <>
                    <Link href={`/projects/${next.url}`} className="d-none d-md-flex text-decoration-none project-nav-link align-items-center justify-content-end text-end">
                      <div className="pe-4">
                        <span className="d-block text-uppercase small mb-1" style={{ letterSpacing: '2px', fontSize: '0.7rem' }}>Next</span>
                        <h4 className="card-title mb-0 fw-light" style={{ fontSize: '1.4rem' }}>{next.title}</h4>
                      </div>
                      <div style={{ width: '180px', flexShrink: 0 }}>
                        {next.featuredImage?.asset && (
                          <Image src={buildImageUrl(next.featuredImage, 400)} alt={next.title} width={400} height={300} loading="lazy" className="shadow-sm" style={{ objectFit: 'cover', width: '100%', height: 'auto', borderRadius: '2px' }} />
                        )}
                      </div>
                    </Link>
                    <div className="d-md-none text-end">
                      <Link href={`/projects/${next.url}`} className="d-block project-nav-link" style={{ fontSize: '1rem', fontWeight: 200 }}>
                        {next.title} &rarr;
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="d-none d-md-block opacity-25"><span className="display-4 text-muted">&rarr;</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}
