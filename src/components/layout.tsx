'use client'

import { ReactNode } from 'react'
import { Footer } from './footer'
import { Header } from './header'
import { Container } from 'react-bootstrap'

interface LayoutProps {
  pageTitle?: string
  children: ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ pageTitle, children, className }) => {
  return (
    <div className={className}>
      <div className="flex-wrapper">
        <Header />
        <main>
          <Container>
            {pageTitle && <h1 className="display-1 py-5">{pageTitle}</h1>}
          </Container>
          {children}
        </main>
        <Footer className="mt-auto" />
      </div>
    </div>
  )
}

export default Layout