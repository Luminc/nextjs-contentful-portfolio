import * as React from "react";
import Layout from "../components/layout";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { navigate } from "gatsby";

const NotFoundPage = () => {
  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <div className="hero-flight"></div>
          </Col>
          <Col md className="p-5">
            <h1 className="display-1">404 not found</h1>
            <p className="leading-loose">Ouch, we couldn't find that page. </p>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="shape-pill large-button"
            >
              Continue
            </button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;

export const Head = () => <title>Not found</title>;
