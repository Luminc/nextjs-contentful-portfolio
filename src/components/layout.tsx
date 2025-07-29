'use client'

import { ReactNode } from 'react'
import { Footer } from './footer'
import { Header } from './header'
import { Container } from 'react-bootstrap'
import { ErrorBoundary } from './error-boundary'
import SkipLinks from './skip-links'

interface LayoutProps {
  pageTitle?: string
  children: ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ pageTitle, children, className }) => {
  return (
    <div className={className}>
      <SkipLinks />
      <div className="flex-wrapper">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <main id="main-content" role="main">
          <Container>
            {pageTitle && <h1 className="display-1 py-5">{pageTitle}</h1>}
          </Container>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <ErrorBoundary>
          <Footer className="mt-auto" />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default Layout