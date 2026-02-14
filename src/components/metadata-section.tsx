'use client'

import { ContentfulMetadataSection } from '@/types/contentful'
import ContentfulRichText from './contentful-rich-text'

/**
 * METADATA SECTION COMPONENT
 *
 * Renders flexible metadata sections for projects with configurable titles
 * and rich text content. Replaces the hardcoded "Materials:" field with
 * composable sections that can have custom titles like "Colophon", "Thanks",
 * "Credits", "Specifications", etc.
 *
 * Features:
 * - Configurable section titles
 * - Rich text content support (bold, links, lists, etc.)
 * - Multiple display style options (caption, paragraph, list)
 * - Follows existing caption styling for consistency
 */

interface MetadataSectionProps {
  section: ContentfulMetadataSection
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ section }) => {
  const { title, content, displayStyle = 'caption' } = section.fields

  // Display style variants
  const getDisplayClasses = () => {
    switch (displayStyle) {
      case 'paragraph':
        return 'leading-loose'
      case 'list':
        return 'leading-loose caption'
      case 'caption':
      default:
        return 'leading-loose caption'
    }
  }

  return (
    <div className="metadata-section mb-3">
      {/* Title with caption styling to match existing "Materials:" pattern */}
      <p className="leading-loose caption caption-title mb-1">
        {title}:
      </p>

      {/* Rich text content */}
      <div className={getDisplayClasses()}>
        <ContentfulRichText richText={content} />
      </div>
    </div>
  )
}

export default MetadataSection
