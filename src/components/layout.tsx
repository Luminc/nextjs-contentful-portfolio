'use client'

import { ReactNode } from 'react'
import { Container } from 'react-bootstrap'
import { ErrorBoundary } from './error-boundary'

interface LayoutProps {
  pageTitle?: string
  children: ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ pageTitle, children, className }) => {
  return (
    <div className={className}>
      <Container>
        {pageTitle && <h1 className="display-1 py-5">{pageTitle}</h1>}
      </Container>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  )
}

export default Layout