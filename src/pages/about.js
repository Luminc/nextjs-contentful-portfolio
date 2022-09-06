import * as React from 'react'
import Layout from '../components/layout'
import { StaticImage } from 'gatsby-plugin-image'

const AboutPage = () => {
    return (
        <Layout pageTitle="About">
            <StaticImage src="../images/jeroen.jpg" alt="A photo of Jeroen holding a piece of rock in front of his eyes with a diagonal layer of quartz through it"/>
            <p>Jeroen Kortekaas, (1991, NL) is an interdisciplinary artist working with a practice that shifts between psychogeography, research, drawing, sculpture and assemblage. His work utilises motifs of the network — such as infrastructure, signals and animation — as metaphors for distributed agency. In his work he wants to create spaces dynamic relation. Kortekaas sees a work of art as authored by not just the artist, but out of relation between the artwork and artist, that in-between space which allows the emergence of new subjectivities. The goal of this practice to allow the emergence of new ontological perspectives, generating novel pathways of constructing the self.</p>
        </Layout>
    )
}
export const Head = () => <title>Jeroen Kortekaas</title>
export default AboutPage