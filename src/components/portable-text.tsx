import { PortableText, PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import Image from 'next/image'
import slugify from '@sindresorhus/slugify'

const createJumpLink = (children: React.ReactNode) => (
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
    normal: ({ children, value }) => {
      // Use raw span text to detect empty paragraphs — rendered children may be
      // React elements (not strings) when marks are applied, giving a false empty.
      const isEmpty = !value?.children?.some((span: { text?: string }) => span.text?.trim())
      return isEmpty ? <br /> : <p className="lh-lg">{children}</p>
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
    blockquote: ({ children }) => (
      <blockquote className="border-start border-primary border-4 bg-light p-3 rounded fw-bold my-4">
        &ldquo;{children}&rdquo;
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

export default function PortableTextRenderer({ value }: { value: PortableTextBlock[] }) {
  if (!value) return null
  return (
    <div>
      <PortableText value={value} components={components} />
    </div>
  )
}
