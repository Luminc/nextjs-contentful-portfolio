import { Metadata } from 'next'
import Layout from '@/components/layout'
import { siteMetadata } from '@/lib/site-metadata'

export const metadata: Metadata = {
  title: 'Privacy | Jeroen Kortekaas',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container py-5" style={{ maxWidth: '640px' }}>
        <h1 className="pb-4">Privacy</h1>

        <p>
          Jeroen Kortekaas collects only your email address, and only if you
          choose to subscribe to the newsletter. Subscription is confirmed via
          a double opt-in email. Your address is used solely to send occasional
          updates about new work and exhibitions, based on your consent.
        </p>
        <p>
          Emails are sent via{' '}
          <a href="https://www.brevo.com" target="_blank" rel="noopener noreferrer">
            Brevo
          </a>{' '}
          (Sendinblue SAS, Paris, France), which stores your address on secure
          EU servers. Your email address is never shared with third parties.
        </p>
        <p>
          Every email includes an unsubscribe link. You may also request access
          to or deletion of your data at any time by writing to{' '}
          <a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>.
        </p>
        <p>
          No tracking cookies or analytics are used. No other personal data is
          collected.
        </p>

        <p className="caption pt-5">
          Last updated {new Date().getFullYear()} · {siteMetadata.author}
        </p>
      </div>
    </Layout>
  )
}
