'use client'

import { INLINES, BLOCKS, MARKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from 'next/image'
import slugify from '@sindresorhus/slugify'
import { createImageUrl } from '@/lib/utils'

const createJumpLink = (children: any) => {
  return (
    <a
      href={`#${slugify(children[0])}`}
      className="position-relative"
    >
      {children}
    </a>
  )
}

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: any) => <b className="fw-bold">{text}</b>,
    [MARKS.ITALIC]: (text: any) => <i className="fst-italic">{text}</i>,
    [MARKS.UNDERLINE]: (text: any) => <u className="text-decoration-underline">{text}</u>,
    [MARKS.CODE]: (text: any) => (
      <code className="font-monospace px-1 py-2 mx-1 bg-light rounded">
        {text}
      </code>
    ),
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noreferrer"
        className="text-primary text-decoration-underline"
      >
        {children}
      </a>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h2 className="display-4 text-start fw-bold text-dark lh-sm mb-2">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="display-4 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="display-5 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: any) => (
      <h4 className="display-6 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: any) => (
      <h5 className="h4 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: any) => (
      <h6 className="h5 text-start fw-bold text-dark lh-sm mb-2">
        {createJumpLink(children)}
      </h6>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-group list-group-numbered">{children}</ol>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-unstyled ps-4">{children}</ul>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li className="mb-1">{children}</li>
    ),
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
      if (node.content[0]?.value === '') {
        return <br />
      } else {
        return <p className="lh-lg">{children}</p>
      }
    },
    [BLOCKS.QUOTE]: (node: any, children: any) => (
      <blockquote className="border-start border-primary border-4 bg-light p-3 rounded fw-bold my-4">
        &ldquo;{node.content[0].content[0].value}&rdquo;
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="mb-4" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, description, title } = node.data.target.fields
      const imageUrl = createImageUrl(file.url)
      
      if (file.contentType?.startsWith('image/')) {
        return (
          <div className="mb-4">
            <Image
              src={imageUrl}
              alt={description || title || 'Embedded image'}
              width={file.details.image?.width || 800}
              height={file.details.image?.height || 600}
              loading="lazy"
              className="img-fluid"
            />
          </div>
        )
      }
      
      return (
        <a href={imageUrl} target="_blank" rel="noopener noreferrer">
          {title || file.fileName}
        </a>
      )
    },
  },
}

interface ContentfulRichTextProps {
  richText: any
}

const ContentfulRichText: React.FC<ContentfulRichTextProps> = ({ richText }) => {
  if (!richText) return null
  
  return <div>{documentToReactComponents(richText, options)}</div>
}

export default ContentfulRichText