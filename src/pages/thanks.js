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
            <h1 className="display-1">Thank you!</h1>
            <p className="leading-loose">Yay, you subscribed.</p>
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Back to index
            </button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;

export const Head = () => <title>Not found</title>;
