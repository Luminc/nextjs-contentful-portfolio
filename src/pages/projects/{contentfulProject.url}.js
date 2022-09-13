import React from 'react';
import { graphql } from 'gatsby';
import ContentfulRichTech from '../../components/contentful-rich-text'
import Layout from '../../components/layout'
import Video from '../../components/video'
import Seo from '../../components/seo'
import {GatsbyImage, getImage} from 'gatsby-plugin-image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Project = ({ data }) => {
  const image = getImage(data.contentfulProject.featuredImage.gatsbyImageData)
  return (
    <Layout pageTitle={data.title}>
      <Container fluid="xxl">
      <h1 className="text-align-center">{data.contentfulProject.title}</h1>
      <p>{data.contentfulProject.medium}</p>
      <p>{data.contentfulProject.year}</p>
      <Row>
        <Col md>
            <GatsbyImage
      image={image}
      alt="Placeholder"
      />
      </Col>
      
        
      {data.contentfulProject.content &&
      <Col>
      <section>
        <ContentfulRichTech richText={data.contentfulProject.content} />
      </section>
      </Col>}
      
      
      </Row>
      </Container>
      <Container>
      { data.contentfulProject.video && 
      <Video Src={data.contentfulProject.video.url} Title={data.contentfulProject.video.title}/>}
      {data.contentfulProject.documentation.map(image => (
              <GatsbyImage alt={image.id} image={image.gatsbyImageData} key={image.id}/>
            ))}
      </Container>
    </Layout>
  );
};

export const data = graphql`
query ($id: String) {
    contentfulProject (id: {eq: $id}) {
      video {
        url
        title
      }
      title
      medium
      url
      year
      documentation {
        id
        gatsbyImageData(width:1000)
      }
      featuredImage{
        gatsbyImageData(layout:FULL_WIDTH)
      }
      content {
        raw
      }
    }
  }
  
`;

export const Head = ({data}) => <Seo title={data.contentfulProject.title}/>

export default Project;