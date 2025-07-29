'use client'

import Link from 'next/link'
import { siteMetadata } from '@/lib/site-metadata'
import { useEffect, useState } from 'react'
import { getPages, ContentfulPage } from '@/lib/api'

export const Header = () => {
  const [pages, setPages] = useState<ContentfulPage[]>([])

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const fetchedPages = await getPages()
        setPages(fetchedPages)
      } catch (error) {
        console.error('Error fetching pages:', error)
      }
    }

    fetchPages()
  }, [])

  return (
    <nav className="justify-content-between align-items-end nav-links py-2 px-4">
      <Link href="/" className="brand">
        {siteMetadata.title}
      </Link>
      <div className="nav-links">
        <div className="nav-links-item">
          <Link href="/projects" className="nav-links-text">
            Projects
          </Link>
        </div>
        {pages.map(page => (
          <div key={page.fields.slug} className="nav-links-item">
            <Link href={`/${page.fields.slug}`} className="nav-links-text">
              {page.fields.title}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  )
}