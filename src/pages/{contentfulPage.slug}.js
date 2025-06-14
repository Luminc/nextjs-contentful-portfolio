import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { graphql } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import ContentfulRichTech from "../components/contentful-rich-text";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { EmailForm } from "../components/emailform";

const Page = ({ data }) => {
  const image = getImage(data.contentfulPage.image.gatsbyImageData);

  return (
    <Layout pageTitle={data.contentfulPage.title}>
      <Container size="xl">
        <Row>
          <Col md>
            <GatsbyImage
              image={image}
              alt={data.contentfulPage.image.description}
            />
          </Col>
          <Col>
            <ContentfulRichTech richText={data.contentfulPage.richdescription} />
          </Col>
        </Row>
        <EmailForm />
      </Container>
    </Layout>
  );
};

export const data = graphql`
  query ($id: String) {
    contentfulPage(id: { eq: $id }) {
      title
      image {
        gatsbyImageData
        description
      }
      richdescription {
        raw
      }
    }
  }
`;

export const Head = ({ data }) => <Seo title={data.contentfulPage.title} />;

export default Page;