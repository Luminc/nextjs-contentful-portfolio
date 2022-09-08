import React from 'react';
import { graphql } from 'gatsby';
import ContentfulRichTech from '../../components/contentful-rich-text'
import Layout from '../../components/layout'
import {GatsbyImage, getImage} from 'gatsby-plugin-image'

const Project = ({ data }) => {
  const image = getImage(data.contentfulProject.featuredImage.gatsbyImageData)
  return (
    <Layout pageTitle={data.title}>
      <h1>{data.contentfulProject.title}</h1>
      <p>{data.contentfulProject.medium}</p>
      <p>{data.contentfulProject.year}</p>
      <GatsbyImage
      image={image}
      alt="Placeholder"
      />
      <section><ContentfulRichTech richText={data.contentfulProject.content} /></section>
    </Layout>
  );
};

export const data = graphql`
query ($id: String) {
    contentfulProject (id: {eq: $id}) {
      title
      medium
      url
      year
      featuredImage{
        gatsbyImageData(layout:FULL_WIDTH)
      }
      content {
        raw
      }
    }
  }
  
`;

export default Project;