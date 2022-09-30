import * as React from "react";
import Layout from "../components/layout";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { navigate } from "gatsby";

const NotFoundPage = () => {
  return (
    <Layout pageTitle="Thank you!">
      <Container>
        <Row>
          <Col>
            <div
              className="hero-flight"
              style={{ width: "100%", height: "50vh" }}
            ></div>
          </Col>
          <Col md className="p-5">
            <p className="leading-loose">
              Thanks for subscribing! I will keep you posted.
            </p>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="shape-pill large-button"
            >
              Return back
            </button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;

export const Head = () => <title>Not found</title>;
