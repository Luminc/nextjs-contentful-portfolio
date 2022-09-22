import React from "react";
import { graphql, Link } from "gatsby";
import ContentfulRichTech from "../components/contentful-rich-text";
import Layout from "../components/layout";
import Video from "../components/video";
import Seo from "../components/seo";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
const Project = ({ data, pageContext }) => {
  const image = getImage(data.contentfulProject.featuredImage.gatsbyImageData);
  const { next } = pageContext;
  const { prev } = pageContext;
  return (
    <Layout pageTitle={data.title}>
      <Container fluid="xxl">
        {/* <button onClick={() => navigate(-1)} className="shape-pill h4">
          Go Back
        </button> */}
        <p className="text-center project-subtitle pt-5">
          {data.contentfulProject.year}
        </p>
        <h1 className="text-center display-1 py-2">
          {data.contentfulProject.title}
        </h1>
        <p className="text-center project-subtitle pb-5">
          {data.contentfulProject.medium}
        </p>
      </Container>
      <Row>
        <Col md className="pb-5 featured-project-image">
          <GatsbyImage
            image={image}
            alt={data.contentfulProject.featuredImage.description}
            className="featured-project-image contain"
          />
        </Col>

        {data.contentfulProject.content && (
          <Col>
            <Container>
              <ContentfulRichTech richText={data.contentfulProject.content} />
              {data.contentfulProject.materials && (
                <>
                  <p className="materials-caption">Materials:</p>
                  <p className="materials-caption">
                    {data.contentfulProject.materials}
                  </p>
                </>
              )}
            </Container>
          </Col>
        )}
      </Row>
      {console.log(data.contentfulProject.sections)}
      {data.contentfulProject.sections &&
        data.contentfulProject.sections.map(
          section =>
            section.id && (
              <section key={section.id}>
                {section.__typename === "ContentfulSectionImageWide" && (
                  <GatsbyImage
                    image={section.image.gatsbyImageData}
                    alt={section.alt}
                  />
                )}
                {section.__typename === "ContentfulDocumentation" &&
                  section.images.map(image => (
                    <Container xxl>
                      <div className="image-wrapper">
                        <GatsbyImage
                          image={image.gatsbyImageData}
                          alt={image.filename}
                          key={image.id}
                        />
                      </div>
                    </Container>
                  ))}
                {section.__typename === "ContentfulContainerVideo" && (
                  <Container fluid="sm">
                    <Video Src={section.video.url} muted={true} />
                  </Container>
                )}
                {section.__typename === "ContentfulCarousel" && (
                  <Container fluid="sm">
                    <Carousel
                      fade
                      interval={section.interval}
                      pause={section.pause}
                      controls={section.controls}
                      indicators={section.indicators}
                    >
                      {section.images.map(image => (
                        <Carousel.Item key={image.filename}>
                          <GatsbyImage
                            image={image.gatsbyImageData}
                            alt={section.title}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Container>
                )}
              </section>
            )
        )}
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
              <p className="card-title h2 grayed p2">&lt;</p>
            </div>
          )}
          {next ? (
            <div className="card pagination-card">
              <Link to={`/projects/${next.url}`} key={next.id}>
                <GatsbyImage
                  className="card-img"
                  image={next.featuredImage.gatsbyImageData}
                  alt={next.title}
                  width={600}
                  height={600}
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
      sections {
        __typename
        ... on ContentfulSectionImageWide {
          id
          image {
            gatsbyImageData
            id
          }
          title
          alt
        }
        ... on ContentfulDocumentation {
          id
          images {
            filename
            gatsbyImageData
            id
          }
        }
        ... on ContentfulCarousel {
          id
          images {
            filename
            gatsbyImageData
          }
          controls
          indicators
          interval
          pause
          title
        }
        ... on ContentfulContainerVideo {
          id
          video {
            url
            title
          }
        }
      }
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
