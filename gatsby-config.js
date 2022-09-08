require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Jeroen Kortekaas`,
    description: `The artist portfolio website of Jeroen Kortekaas`,
    siteUrl: `https://www.jeroenkortekaas.com`
  },
  plugins: [
"gatsby-plugin-image",
"gatsby-plugin-sharp",
"gatsby-plugin-mdx",
"gatsby-transformer-sharp",
{
  resolve: "gatsby-source-filesystem",
  options: {
    name: `blog`,
    path: `${__dirname}/blog`,
  }
},
{
  resolve: `gatsby-source-contentful`,
  options: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
},
],
};