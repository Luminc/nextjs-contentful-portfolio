'use client'

import { SanityMetadataSection } from '@/types/sanity'
import PortableTextRenderer from './portable-text'

interface MetadataSectionProps {
  section: SanityMetadataSection
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ section }) => {
  const { title, content, displayStyle = 'caption' } = section

  const getDisplayClasses = () => {
    switch (displayStyle) {
      case 'paragraph': return 'leading-loose'
      case 'list':
      case 'caption':
      default: return 'leading-loose caption'
    }
  }

  return (
    <div className="metadata-section mb-3">
      <p className="leading-loose caption caption-title mb-1">{title}:</p>
      <div className={getDisplayClasses()}>
        <PortableTextRenderer value={content} />
      </div>
    </div>
  )
}

export default MetadataSection
