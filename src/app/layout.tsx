import type { Metadata } from 'next'
import { Commissioner } from 'next/font/google'
import { siteMetadata } from '@/lib/site-metadata'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import SkipLinks from '@/components/skip-links'
import { ErrorBoundary } from '@/components/error-boundary'
import '../scss/app.scss'

const commissioner = Commissioner({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-commissioner',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: siteMetadata.author }],
  creator: siteMetadata.author,
  metadataBase: new URL(siteMetadata.siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteMetadata.siteUrl,
    title: siteMetadata.title,
    description: siteMetadata.description,
    siteName: siteMetadata.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: `@${siteMetadata.twitterUsername}`,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={commissioner.variable}>
        <SkipLinks />
        <div className="flex-wrapper">
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
          <main id="main-content" role="main">
            {children}
          </main>
          <ErrorBoundary>
            <Footer className="mt-auto" />
          </ErrorBoundary>
        </div>
      </body>
    </html>
  )
}