import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";

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
  `);
  return (
    <nav className="justify-content-between align-items-end nav-links py-2 px-4">
      <Link to="/" className="brand">
        {data.site.siteMetadata.title}
      </Link>
      <div className="nav-links">
        <div className="nav-links-item">
          <Link to="/projects" className="nav-links-text">
            Projects
          </Link>
        </div>
        {data.allContentfulPage.edges.map(item => (
          <div key={item.node.slug} className="nav-links-item">
            <Link to={`/${item.node.slug}`} className="nav-links-text">
              {item.node.title}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  );
};
