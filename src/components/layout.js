import * as React from "react";
import Seo from "../components/seo";

import "../scss/app.scss";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import Container from "react-bootstrap/Container";

const Layout = ({ pageTitle, children, className }) => {
  return (
    <div className={className}>
      <Seo />
      <div className="flex-wrapper">
        <Header />

        <main>
          <Container>
            {pageTitle && <h1 className="display-1 py-5">{pageTitle}</h1>}
          </Container>
          {children}
        </main>

        <Footer className="mt-auto" />
      </div>
    </div>
  );
};

export default Layout;
