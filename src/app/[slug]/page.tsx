/**
 * DYNAMIC PAGE - SERVER COMPONENT
 *
 * Server-rendered dynamic pages (About, etc.) with full SEO support.
 * This page generates static pages at build time and revalidates hourly.
 *
 * Features:
 * - Static Site Generation (SSG) via generateStaticParams
 * - Dynamic metadata for SEO
 * - Server-side data fetching
 * - Incremental Static Regeneration (ISR)
 */

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import { getPage, getPages } from '@/lib/sanity'
// React Bootstrap components replaced with plain HTML for Server Component compatibility
import Image from 'next/image'
import HeroFlight from '@/components/hero-flight'
import { siteMetadata } from '@/lib/site-metadata'

// Revalidate every hour (ISR)
export const revalidate = 3600

/**
 * GENERATE STATIC PARAMS
 * Pre-renders all pages at build time
 */
export async function generateStaticParams() {
  const pages = await getPages()
  return pages.map((page) => ({
    slug: page.slug,
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
  const page = await getPage(params.slug)

  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  const imageUrl = page.image?.asset?.url
  const pageDescription = siteMetadata.description

  return {
    title: `${page.title} | ${siteMetadata.title}`,
    description: pageDescription,
    openGraph: {
      title: page.title,
      description: pageDescription,
      type: 'website',
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: page.image?.asset?.metadata?.dimensions?.width,
            height: page.image?.asset?.metadata?.dimensions?.height,
            alt: page.title,
          },
        ],
      }),
    },
  }
}

/**
 * DYNAMIC PAGE COMPONENT
 */
export default async function DynamicPage({
  params,
}: {
  params: { slug: string }
}) {
  const page = await getPage(params.slug)

  if (!page) {
    notFound()
  }

  const isAboutPage = params.slug === 'about'

  // About page with scrolling background as passepartout frame around photo
  if (isAboutPage && page.image?.asset?.url) {
    return (
      <Layout pageTitle={page.title}>
        <div className="container-wide">
          <div className="row mb-5">
            <div className="col-md pb-5">
              <HeroFlight className="d-inline-block" minHeight="auto">
                <div style={{ padding: '7rem' }}>
                  <Image
                    src={page.image.asset.url}
                    alt={page.title}
                    width={page.image.asset.metadata?.dimensions?.width || 800}
                    height={page.image.asset.metadata?.dimensions?.height || 600}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    priority
                  />
                </div>
              </HeroFlight>
            </div>

            {page.richDescription && (
              <div className="col">
                <div className="container">
                  <ContentfulRichText richText={page.richDescription} />
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    )
  }

  // Standard page layout for other pages
  return (
    <Layout pageTitle={page.title}>
      <div className="container-wide">
        <div className="row mb-5">
          {page.image?.asset?.url && (
            <div className="col-md pb-5">
              <Image
                src={page.image.asset.url}
                alt={page.title}
                width={page.image.asset.metadata?.dimensions?.width || 800}
                height={page.image.asset.metadata?.dimensions?.height || 600}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }}
                priority
              />
            </div>
          )}

          {page.richDescription && (
            <div className="col">
              <div className="container">
                <ContentfulRichText richText={page.richDescription} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
