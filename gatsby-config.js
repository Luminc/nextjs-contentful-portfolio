module.exports = {
  siteMetadata: {
    title: `gatsby tutorial site`,
    siteUrl: `https://www.yourdomain.tld`
  },
  plugins: [{
    resolve: 'gatsby-source-wordpress',
    options: {
      "url": "https://wp.jeroenkortekaas.com/graphql/"
    }
  }]
};