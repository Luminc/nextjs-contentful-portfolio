'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import { getPage } from '@/lib/api'
import { Container } from 'react-bootstrap'

export default function DynamicPage() {
  const params = useParams()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchedPage = await getPage(params.slug as string)
        setPage(fetchedPage)
      } catch (error) {
        console.error('Error fetching page:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPage()
    }
  }, [params.slug])

  if (loading) {
    return <Layout><Container><p>Loading...</p></Container></Layout>
  }

  if (!page) {
    return <Layout><Container><p>Page not found</p></Container></Layout>
  }

  return (
    <Layout pageTitle={page.fields.title}>
      <Container>
        {page.fields.richDescription && (
          <ContentfulRichText richText={page.fields.richDescription} />
        )}
      </Container>
    </Layout>
  )
}