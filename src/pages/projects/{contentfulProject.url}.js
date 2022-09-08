import React from 'react';
import { graphql } from 'gatsby';
import ContentfulRichTech from '../../components/contentful-rich-text'
import Layout from '../../components/layout'

const Project = ({ data }) => {


  return (
    <Layout pageTitle={data.title}>
      <h1>{data.contentfulProject.title}</h1>
      <p>{data.contentfulProject.medium}</p>
      <section><ContentfulRichTech richText={data.contentfulProject.content} /></section>
    </Layout>
  );
};

export const data = graphql`
query {
    contentfulProject {
      title
      medium
      url
      content {
        raw
      }
    }
  }
  
`;

export default Project;