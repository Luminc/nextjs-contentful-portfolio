import { SanitySection } from '@/types/sanity'

interface DownloadLinkProps {
  section: SanitySection
}

function formatFileSize(bytes?: number): string | null {
  if (!bytes) return null
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Link to a downloadable file with a small file icon. PDFs open in the browser's
// viewer (new tab); other types download as the browser decides.
const DownloadLink: React.FC<DownloadLinkProps> = ({ section }) => {
  const asset = section.file?.asset
  if (!asset?.url) return null

  const meta = [asset.extension?.toUpperCase(), formatFileSize(asset.size)]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="download-link">
      <a href={asset.url} target="_blank" rel="noopener noreferrer" className="download-link__anchor">
        <svg
          className="download-link__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M12 11v6" />
          <path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
        </svg>
        <span className="download-link__text">
          <span className="download-link__title">{section.title}</span>
          {meta && <span className="download-link__meta">{meta}</span>}
        </span>
      </a>
      {section.description && <p className="download-link__note">{section.description}</p>}
    </div>
  )
}

export default DownloadLink
