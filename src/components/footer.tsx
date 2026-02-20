'use client'

import Link from 'next/link'
import { Row, Col } from 'react-bootstrap'
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
      <div className="container-wide d-sm-block d-md-none">
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
              className="external"
            >
              {siteMetadata.email}
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
          {' · '}
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
      <div className="container-wide d-none d-md-block">
        <Row className="flex-column flex-md-row my-5">
          <Col className="text-start my-5">
            <a href={siteMetadata.siteUrl} target="_top" className="footer-desktop-link">
              {siteMetadata.author}
            </a>
          </Col>
          <Col className="text-center my-5">
            <a href={`mailto:${siteMetadata.email}`} target="_top" className="footer-desktop-link">
              {siteMetadata.email}
            </a>
          </Col>
          <Col className="text-end my-5">
            <a href={siteMetadata.instagram} target="_top" className="py-2 footer-desktop-link">
              Instagram
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <div className="copyright pb-3">
              &copy; {new Date().getFullYear()} {siteMetadata.author}
              {' · '}
              <Link href="/privacy">Privacy</Link>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  )
}