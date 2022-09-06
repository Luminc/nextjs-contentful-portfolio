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
],
};