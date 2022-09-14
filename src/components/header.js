import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import {
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
  linkStyling,
} from "./layout.module.css";

export const Header = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          description
          siteUrl
          title
        }
      }
      allContentfulPage {
        edges {
          node {
            slug
            title
          }
        }
      }
    }
  `)
  return (
    <nav>
      <div className="d-flex justify-content-between align-items-end nav-links">
        <Link to="/" className={linkStyling}>
          {data.site.siteMetadata.title}
        </Link>
        <div className={navLinks}>
          <div className={navLinkItem}>
            <Link to="/projects" className={navLinkText}>
              Projects
            </Link>
          </div>
          {data.allContentfulPage.edges.map(item => (
            <div key={item.node.slug} className={navLinkItem}>
              <Link to={`/${item.node.slug}`} className={navLinkText}>
                {item.node.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
