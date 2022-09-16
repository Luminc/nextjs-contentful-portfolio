import * as React from 'react'
import Layout from '../components/layout'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const NotFoundPage = () => {
  return (
    <Layout>
      <Container>
        <Row>
      <Col></Col>
      <Col md className="p-5"><h1 className="display-1 text-center">404 not found</h1>
      <p className="leading-loose">We couldn't find that page. Are you lost?</p></Col>
      </Row>
      </Container>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => <title>Not found</title>
