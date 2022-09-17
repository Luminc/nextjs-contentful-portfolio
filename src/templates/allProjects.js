import React from "react";
import { graphql, navigate, Link } from "gatsby";
import ContentfulRichTech from "../components/contentful-rich-text";
import Layout from "../components/layout";
import Video from "../components/video";
import Seo from "../components/seo";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Project = ({ data, pageContext }) => {
  const image = getImage(data.contentfulProject.featuredImage.gatsbyImageData);
  const { next } = pageContext;
  const { prev } = pageContext;
  return (
    <Layout pageTitle={data.title}>
      <Container fluid="xxl">
        <button onClick={() => navigate(-1)} className="shape-pill h4">
          Go Back
        </button>
        <p className="text-center project-subtitle pt-5">
          {data.contentfulProject.year}
        </p>
        <h1 className="text-center display-1 py-2">
          {data.contentfulProject.title}
        </h1>
        <p className="text-center project-subtitle pb-5">
          {data.contentfulProject.medium}
        </p>

        <Row>
          <Col md className="pb-5">
            <GatsbyImage
              image={image}
              alt={data.contentfulProject.featuredImage.description}
            />
          </Col>

          {data.contentfulProject.content && (
            <Col>
              <section>
                <ContentfulRichTech richText={data.contentfulProject.content} />
                {data.contentfulProject.materials && (
                  <>
                    <p className="materials-caption">Materials:</p>
                    <p className="materials-caption">
                      {data.contentfulProject.materials}
                    </p>
                  </>
                )}
              </section>
            </Col>
          )}
        </Row>
      </Container>

      {data.contentfulProject.video /*Checks is data exists and renders:*/ && (
        <Video
          Src={data.contentfulProject.video.url}
          Title={data.contentfulProject.video.title}
        />
      )}
      <Container>
        {data.contentfulProject.documentation.map(image => (
          <div className="image-wrapper">
            <GatsbyImage
              alt={image.id}
              image={image.gatsbyImageData}
              key={image.id}
            />
          </div>
        ))}
        <div className="card-group align-items-end justify-content-between py-5 mt-4">
          {prev ? (
            <div className="card pagination-card">
              <Link to={`/projects/${prev.url}`} key={prev.id}>
                <GatsbyImage
                  className="card-img "
                  image={prev.featuredImage.gatsbyImageData}
                  alt={prev.title}
                  objectFit="contain"
                />
              </Link>

              <div className="card-body">
                <Link to={`/projects/${prev.url}`} key={prev.id}>
                  <h5 className="card-title">&lt; {prev.title} </h5>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="card-title grayed">&lt;</p>
            </div>
          )}
          {next ? (
            <div className="card pagination-card">
              <Link to={`/projects/${next.url}`} key={next.id}>
                <GatsbyImage
                  className="card-img"
                  image={next.featuredImage.gatsbyImageData}
                  alt={next.title}
                />
              </Link>

              <div className="card-body">
                <Link to={`/projects/${next.url}`} key={next.id}>
                  <h5 className="card-title text-right">{next.title} &gt;</h5>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="card-title h2 grayed p-3">&gt;</p>
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export const data = graphql`
  query ($id: String) {
    contentfulProject(id: { eq: $id }) {
      video {
        url
        title
      }
      title
      medium
      url
      year
      materials
      documentation {
        id
        gatsbyImageData(width: 1500)
      }
      featuredImage {
        gatsbyImageData(layout: FULL_WIDTH)
        description
      }
      content {
        raw
      }
    }
  }
`;

export const Head = ({ data }) => <Seo title={data.contentfulProject.title} />;

export default Project;
