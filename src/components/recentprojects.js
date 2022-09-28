import React from "react";
import { useStaticQuery, graphql, Link, navigate } from "gatsby";
import { Container } from "react-bootstrap";
import { GatsbyImage } from "gatsby-plugin-image";
import Button from "react-bootstrap/Button";

export const RecentProjects = () => {
  const data = useStaticQuery(graphql`
    query {
      allContentfulProject(sort: { fields: date, order: DESC }, limit: 3) {
        nodes {
          title
          url
          date
          year
          medium
          id
          featuredImage {
            gatsbyImageData(width: 1000)
          }
        }
      }
    }
  `);
  return (
    <Container>
      <h1 className="display-2 py-5">Recent Projects</h1>
      <div className="card-columns card-columns-3 d-block">
        {data.allContentfulProject.nodes.map(project => (
          <div className="card d-block">
            <Link to={`/projects/${project.url}`} key={project.id}>
              <GatsbyImage
                className="card-img"
                image={project.featuredImage.gatsbyImageData}
                alt={project.title}
              />
            </Link>

            <div className="card-body">
              <Link to={`/projects/${project.url}`} key={project.id}>
                <p className="overline">
                  {project.medium} — {project.year}
                </p>
                <h5 className="card-title">{project.title}</h5>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="py-5 text-right d-flex justify-content-center justify-content-md-end">
        <button
          className="shape-pill large-button"
          onClick={() => {
            navigate("/projects/");
          }}
        >
          Go to Projects
        </button>
      </div>
    </Container>
  );
};
