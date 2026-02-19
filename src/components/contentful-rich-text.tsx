'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import slugify from '@sindresorhus/slugify'

/**
 * RICH TEXT RENDERER — Portable Text (Sanity)
 *
 * Drop-in replacement for the previous Contentful rich text renderer.
 * Accepts Sanity Portable Text blocks and renders them with the same
 * Bootstrap styling as before.
 */

const createJumpLink = (children: any) => (
  <a href={`#${slugify(String(children))}`} className="position-relative">
    {children}
  </a>
)

const components: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <b className="fw-bold">{children}</b>,
    em: ({ children }) => <i className="fst-italic">{children}</i>,
    underline: ({ children }) => <u className="text-decoration-underline">{children}</u>,
    code: ({ children }) => (
      <code className="font-monospace px-1 py-2 mx-1 bg-light rounded">{children}</code>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.target || '_blank'}
        rel="noreferrer"
        className="text-primary text-decoration-underline"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }) => {
      // Render empty paragraphs as line breaks
      const text = Array.isArray(children)
        ? children.map(c => (typeof c === 'string' ? c : '')).join('')
        : String(children ?? '')
      return text.trim() === '' ? <br /> : <p className="lh-lg">{children}</p>
    },
    h1: ({ children }) => (
      <h2 className="display-4 text-start fw-bold text-dark lh-sm mb-2">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="display-4 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="display-5 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="display-6 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="h4 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="h5 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h6>
    ),
    blockquote: ({ children, value }) => (
      <blockquote className="border-start border-primary border-4 bg-light p-3 rounded fw-bold my-4">
        &ldquo;{value?.children?.[0]?.text}&rdquo;
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-unstyled ps-4">{children}</ul>,
    number: ({ children }) => <ol className="list-group list-group-numbered">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-1">{children}</li>,
    number: ({ children }) => <li className="mb-1">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      const url = value?.asset?.url
      if (!url) return null
      return (
        <div className="mb-4">
          <Image
            src={url}
            alt={value?.alt || ''}
            width={value?.asset?.metadata?.dimensions?.width || 800}
            height={value?.asset?.metadata?.dimensions?.height || 600}
            loading="lazy"
            className="img-fluid"
          />
        </div>
      )
    },
  },
}

interface ContentfulRichTextProps {
  richText: any
}

const ContentfulRichText: React.FC<ContentfulRichTextProps> = ({ richText }) => {
  if (!richText) return null
  return (
    <div>
      <PortableText value={richText} components={components} />
    </div>
  )
}

export default ContentfulRichText
