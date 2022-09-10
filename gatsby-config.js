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
{ resolve: "gatsby-plugin-sharp",
options: {
  defaults: {
    placeholder: 'blurred'
  }
}
},
"gatsby-plugin-mdx",
"gatsby-transformer-sharp",
{
  resolve: `gatsby-source-contentful`,
  options: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
},
],
};