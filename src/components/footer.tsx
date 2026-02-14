'use client'

import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'
import { siteMetadata } from '@/lib/site-metadata'

interface FooterProps {
  className?: string
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer 
      id="footer" 
      className={className}
      role="contentinfo"
      aria-label="Site footer"
    >
      <Container className="d-sm-block d-md-none">
        <ul className="footer-links">
          <li className="footer-links-brand">
            <Link href="/">{siteMetadata.author}</Link>
          </li>
          <li className="footer-links-item">
            <Link href="/projects">Projects</Link>
          </li>
          <li className="footer-links-item">
            <Link href="/about">About</Link>
          </li>
        </ul>
        <ul className="contact-links">
          <li className="contact-links-item">
            <a
              href={`mailto:${siteMetadata.email}`}
              target="_top"
              className="h2 external"
            >
              {siteMetadata.email}
            </a>
          </li>
          <li className="contact-links-item">
            <a href={`tel:${siteMetadata.phone}`} target="_top">
              {siteMetadata.phone}
            </a>
          </li>
        </ul>
        <ul className="social-links">
          <li className="social-links-item">
            <a href={siteMetadata.instagram} target="_top">
              Instagram
            </a>
          </li>
          <li className="social-links-item">
            <a href={siteMetadata.facebook} target="_top">
              Facebook
            </a>
          </li>
          <li className="social-links-item">
            <a href={siteMetadata.github} target="_top">
              Github
            </a>
          </li>
        </ul>
        <div className="copyright pb-3">
          &copy; {new Date().getFullYear()} {siteMetadata.author}
        </div>
      </Container>
      <Container fluid className="d-none d-md-block">
        <Row className="flex-column flex-md-row my-5">
          <Col className="text-center my-5">
            <a href={siteMetadata.siteUrl} target="_top" className="h2">
              {siteMetadata.author}
            </a>
          </Col>
          <Col className="text-center my-5">
            <a href={`mailto:${siteMetadata.email}`} target="_top" className="h2">
              {siteMetadata.email}
            </a>
          </Col>
          <Col className="text-center my-5">
            <a href={siteMetadata.instagram} target="_top" className="py-2 h2">
              Instagram
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <div className="mb-1">
              <div className="nav-bottom">
                <div className="py-4">
                  <div className="d-inline">
                    <Link href="/projects">PROJECTS</Link>
                  </div>
                  <div className="d-inline">
                    {" | "}
                    <Link href="/about">ABOUT</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="copyright pb-3">
              &copy; {new Date().getFullYear()} {siteMetadata.author}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}