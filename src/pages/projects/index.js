import * as React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../../components/layout";
import { GatsbyImage } from "gatsby-plugin-image";
import Seo from "../../components/seo";
import Container from "react-bootstrap/Container";

const ProjectPage = ({ data }) => {
  return (
    <Layout pageTitle="Projects">
      <Container>
        <div className="card-columns">
          {data.allContentfulProject.nodes.map(project => (
            <div className="card">
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
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query MyQuery {
    allContentfulProject(sort: { fields: date, order: DESC }) {
      nodes {
        title
        date
        url
        year
        medium
        id
        featuredImage {
          gatsbyImageData(width: 1000)
        }
      }
    }
  }
`;

export const Head = () => (
  <Seo
    title="Landing page"
    description="Jeroen Kortekaas, (1991, NL) is an interdisciplinary artist working with a practice that shifts between psychogeography, research, drawing, sculpture, and assemblage."
    keywords="Artist, Sculpture, Network, Animism, Agency "
  />
);
export default ProjectPage;
